<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { apiReq, handleErrorApi } from '../helpers/fns';
import { useMiscStore } from '../stores/misc';
import SubmitButton from '../components/partial/SubmitButton.vue';
import EyeIcon from '../components/icon/EyeIcon.vue';
import ImagePreview from '../components/modal/ProductView.vue';
import GalleryModal from '../components/modal/GalleryModal.vue';
import { onBeforeRouteLeave } from 'vue-router';

const misc = useMiscStore()
const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id)
const isNew = computed(() => {
  return route.params.id == 'new'
})

const form = ref({
  items: [],
  status: true,
  title: '',
})
const isFetching = ref(true)
const isSending = ref(false)
const isDirty = ref(false)

const isValid = computed(() => {
  return Boolean(form.value.name)
})

const getData = () => {
  if (isNew.value) {
    isFetching.value = false
    return
  }

  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/datasets/${id.value}`).then(res => {
    form.value = res.data.dataset
    isFetching.value = false
  })
  .catch(e => {
    handleErrorApi(e)
  })
}

const submit = async () => {
  if (!checkTitle()) return
  isSending.value = true
  const method = isNew.value ? 'post' : 'put'
  const url = `/sites/${misc.activeSite.id}/datasets` + (isNew.value ? '' : '/'+id.value)
  const payload = JSON.parse(JSON.stringify(form.value))

  apiReq(method, url, payload).then(() => {
    isDirty.value = false
    if (isNew.value) {
      router.push('/datasets')
    }
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}

const refineTitle = () => {
  const str = form.value.name.replace(/[^a-zA-Z0-9_]/g, '')
  form.value.name = str.charAt(0).toUpperCase() + str.slice(1)
  isDirty.value = true
}

const checkTitle = () => {
  const check = /^[a-zA-Z][a-zA-Z1-9_]*$/.test(form.value.name)
  if (!check) {
    alert('Title can only be started with alphabet (A-Z)')
    return false
  }
  return true
}

function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

const moveUp = (i) => {
  const items = form.value.items
  if (i > 0) {
    swap(items, i, i - 1);
  }
  isDirty.value = true
}

const moveDown = (i) => {
  const items = form.value.items
  if (i < items.length - 1) {
    swap(items, i, i + 1);
  }
  isDirty.value = true
}

const removeItem = (i) => {
  form.value.items.splice(i, 1)
  isDirty.value = true
}

const modalBtn = ref(null)
const previewed = ref('')
const show = (s) => {
  previewed.value = s
  modalBtn.value.click()
}

const browse = (i) => {
  galleryIndex.value = i
  document.getElementById('galleryBtn').click()
}
const galleryIndex = ref(null)
const galleryKey = ref(0)
const updateFromGallery = (url) => {
  galleryKey.value++
  form.value.items[galleryIndex.value].image = url
  isDirty.value = true
}

const removeImg = (i) => {
  form.value.items[i].image = ''
  isDirty.value = true
}

const handleBeforeUnload = (e) => {
  if (isDirty.value) {
    e.preventDefault();
    e.returnValue = "";
  }
};

function detectCmdS(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && this.location.pathname.startsWith('/datasets/')) {
    e.preventDefault();
    submit();
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
  <div v-if="misc.activeSite.id">
    <div class="d-flex">
      <h5 class="mb-4">{{ isNew ? 'Create Dataset' : 'Edit Dataset' }}</h5>
      <div class="ms-auto">
      </div>
    </div>
    <div v-if="!isFetching">
      <div class="d-flex">
        <div class="mb-3 w-100">
          <label for="" class="form-label">Name</label>
          <input type="text" class="form-control" v-model="form.name" @input="refineTitle" @change="checkTitle">
        </div>
      </div>
      <label for="" class="form-label">Data</label>
      <div class="table-responsive mb-3">
        <table class="table table-bordered mb-0">
          <thead class="table-primary text-center">
            <tr>
              <th style="width: 16px;">No</th>
              <th style="width: 97px;">Action</th>
              <th class="">Image</th>
              <th class="">Title</th>
              <th class="">Value</th>
              <th class="">Extra</th>
              <th class="">Extra2</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r,i in form.items">
              <td class="text-center" style="vertical-align: middle;">{{ i }}</td>
              <td class="" style="vertical-align: middle;">
                <div class="btn-group">
                  <button class="btn btn-sm btn-light border w-100 fw-bold" @click="moveUp(i)" :disabled="i == 0">&uarr;</button>
                  <button class="btn btn-sm btn-light border w-100 fw-bold" @click="moveDown(i)" :disabled="i == (form.items.length-1)">&darr;</button>
                  <button class="btn btn-sm btn-light border w-100 fw-bold text-danger" @click="removeItem(i)">&times;</button>
                </div>
              </td>
              <td class="p-1" style="width: 97px;">
                <div v-if="r.image" class="d-flex">
                  <img :src="r.image" @click="browse(i)" alt="click here" width="64" height="64" class="border" style="cursor: pointer;">
                  <div class="ms-1">
                    <button class="btn btn-light border rounded-0 px-1 pt-0 mb-1" @click="show(r.image)">
                      <EyeIcon style="width: 17px;"/>
                    </button><br>
                    <button class="btn btn-light border text-danger rounded-0 px-2 py-0" @click="removeImg(i)">&times;</button>
                  </div>
                </div>
                <div v-else>
                  <img src="/noimage.png" @click="browse(i)" alt="click here" width="64" height="64" class="border" style="cursor: pointer;">
                </div>
              </td>
              <td class="p-1" style="width: 97px;">
                <textarea v-model="r.title" class="border-0 p-1" style="width: 180px;height:64px;resize: none;" :class="{fontsmall: (r.title || '').length > 30}"></textarea>
              </td>
              <td class="p-1" style="width: 97px;">
                <textarea v-model="r.value" class="border-0 p-1" style="width: 180px;height:64px;resize: none;" :class="{fontsmall: (r.value || '').length > 30}"></textarea>
              </td>
              <td class="p-1" style="width: 97px;">
                <textarea v-model="r.extra" class="border-0 p-1" style="width: 180px;height:64px;resize: none;" :class="{fontsmall: (r.extra || '').length > 30}"></textarea>
              </td>
              <td class="p-1" style="width: 97px;">
                <textarea v-model="r.extra2" class="border-0 p-1" style="width: 180px;height:64px;resize: none;" :class="{fontsmall: (r.extra2 || '').length > 30}"></textarea>
              </td>
            </tr>
            <tr>
              <td class="text-center"></td>
              <td colspan="100%" class="">
                <button class="btn btn-sm btn-light border w-100 fw-bold" @click="form.items.push({})">+ Add row</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex">
        <RouterLink to="/datasets" class="btn btn-secondary w-100 me-2">&larr; Back</RouterLink>
        <SubmitButton @click="submit" :disabled="!isValid" :sending="isSending" class="btn btn-primary w-100">
          Save Changes
        </SubmitButton>
      </div>
    </div>
    <button ref="modalBtn" class="d-none" data-bs-toggle="modal" data-bs-target="#ImagePreview"></button>
    <ImagePreview :data="previewed" />
    <button data-bs-toggle="modal" data-bs-target="#GalleryModal" class="d-none" id="galleryBtn"></button>
    <GalleryModal @selected="updateFromGallery" :key="galleryKey" />
  </div>
</template>