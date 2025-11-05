<script setup>
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import SubmitButton from '../components/partial/SubmitButton.vue';
import { useMiscStore } from '../stores/misc';
import { onBeforeRouteLeave } from 'vue-router';

const keys = ref([
  'header', 'home', 'directory', 'post', 'comment', 'notfound', 'footer', 'mainjs', 'maincss',
])
const bg = ref({
  header: 'bg-primary',
  home: 'bg-success',
  directory: 'bg-info',
  post: 'bg-danger',
  comment: 'bg-warning',
  notfound: 'bg-secondary',
  footer: 'bg-dark',
  mainjs: 'bg-primary-subtle text-primary',
  maincss: 'bg-success-subtle text-success',
})
const template = ref({})
const isFetching = ref(true)
const isSending = ref(false)
const misc = useMiscStore()

const getData = () => {
  if (!misc.activeSite.id) {
    return
  }
  window.cm = {}
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/templates`).then(res => {
    template.value = res.data.template || {}
    isFetching.value = false
    setTimeout(() => {
      for (const k of keys.value) {
        initCM(k)
      }
      isDirty.value = false
    }, 200)
  })
    .catch(handleErrorApi)
    .finally(() => {
    })
}

const isDirty = ref(false)

const updateData = () => {
  for (const k of keys.value) {
    template.value[k] = window.cm[k].getValue()
  }
  isSending.value = true
  apiReq('put', `/sites/${misc.activeSite.id}/templates`, template.value).then(() => {
    isDirty.value = false
  }).catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const initCM = (key) => {
  const el = document.getElementById(`tmpl_${key}`)
  let mode = 'htmlmixed'
  if (key == 'mainjs') {
    mode = 'javascript'
  }
  if (key == 'maincss') {
    mode = 'css'
  }
  const cm = new window.CodeMirror.fromTextArea(el, {
    mode,
    lineNumbers: true,
    matchBrackets: true,
    autoCloseTags: true
  })
  cm.getWrapperElement().style.fontFamily = "monospace";
  cm.getWrapperElement().style.fontSize = "12px";
  cm.getWrapperElement().style.padding = "0px";
  cm.getWrapperElement().style.minHeight = "4rem";
  cm.getWrapperElement().style.border = "none";
  cm.getWrapperElement().style.borderRadius = "0";
  cm.on("change", () => {
    isDirty.value = true
  })

  cm.setValue(template.value[key])
  window.cm[key] = cm
}

const jump = (e) => {
  const v = event.target.value
  document.getElementById(v).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  })
  event.target.value = ''
}

const handleBeforeUnload = (e) => {
  if (isDirty.value) {
    e.preventDefault();
    e.returnValue = "";
  }
};

function detectCmdS(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && this.location.pathname.startsWith('/templates/edit')) {
    e.preventDefault();
    updateData();
  }
}

onMounted(() => {
  getData()
  window.addEventListener("beforeunload", handleBeforeUnload)
  document.addEventListener('keydown', detectCmdS);
})
onUnmounted(() => {
  document.removeEventListener("keydown", detectCmdS);
});


onBeforeUnmount(() => {
  window.addEventListener("beforeunload", handleBeforeUnload)
})

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    if (confirm("Changes you made may not be saved. Discard it?")) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

</script>

<template>
  <div>
    <SpinnerBox v-if="isFetching" />
    <div v-else class="overflow-y text-white border-top border-bottom mb-3" style="height: calc(-188px + 100vh);overflow-y: auto;">
      <div v-for="k, i in keys" :key="i" class="ps-1 pt-1 mb-3" :class="bg[k]">
        <div class="mx-1 mb-1 d-flex" :id="k">
          <span class="mt-1">
            Part: <b>{{ k.replace('main', 'main.') }}</b>
          </span>
          <select class="form-control form-control-sm text-center ms-auto" @change="jump" style="width: 150px;">
            <option value="">Jump to</option>
            <option value="header">header</option>
            <option value="home">home</option>
            <option value="directory">directory</option>
            <option value="post">post</option>
            <option value="comment">comment</option>
            <option value="notfound">notfound</option>
            <option value="footer">footer</option>
            <option value="mainjs">main.js</option>
            <option value="maincss">main.css</option>
          </select>
        </div>
        <div class="">
          <textarea :id="`tmpl_${k}`" class="d-none"></textarea>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <RouterLink to="/templates" class="btn btn-secondary w-100 me-2">&larr; Back</RouterLink>
      <SubmitButton :sending="isSending" class="btn btn-primary w-100" @click="updateData">
        Save Changes
      </SubmitButton>
    </div>
  </div>
</template>
