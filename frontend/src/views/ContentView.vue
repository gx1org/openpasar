<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter} from 'vue-router';
import { apiReq, handleErrorApi } from '../helpers/fns';
import { useMiscStore } from '../stores/misc';
import TrashIcon from '../components/icon/TrashIcon.vue'
import InputImage from '../components/partial/InputImage.vue'

const misc = useMiscStore()
const route = useRoute()
const router = useRouter()
const id = route.params.id
const post = ref({})
const total = ref(0)
const contents = ref([])
const showingContent = ref(null)

const baseURL = computed(() => {
  return `/sites/${misc.activeSite.id}/posts/${id}`
})

const getPost = () => {
  apiReq('get', baseURL.value).then(res => {
    post.value = res.data.post
    getContents()
  })
  .catch(handleErrorApi)
}

const getContents = () => {
  apiReq('get', baseURL.value+'/contents').then(res => {
    contents.value = res.data.contents.map(v => {
      if (v.content_type == 'image') {
        v.dataObj = JSON.parse(v.data)
      }
      return v
    })
    total.value = res.data.total
  })
  .catch(handleErrorApi)
}

const contentUpsert = (content) => {
  if (content.content_type == 'image') {
    content.data = JSON.stringify(content.dataObj)
  }
  if (content.id == 'new') {
    apiReq('post', baseURL.value+'/contents', content).then(() => {
      showingContent.value = null
      getContents()
    })
    .catch(handleErrorApi)
  } else {
    apiReq('put', baseURL.value+'/contents/'+content.id, content).then(() => {
      showingContent.value = null
      getContents()
    })
    .catch(handleErrorApi)
  }
}

const contentDelete = (content) => {
  if(!confirm('Are you sure?')) {
    return
  }
  apiReq('delete', baseURL.value+'/contents/'+content.id).then(() => {
    showingContent.value = null
    getContents()
  })
  .catch(handleErrorApi)
}

const add = () => {
  contents.value.push({
    id: 'new',
    content_type: 'markdown',
    show: true,
    dataObj: {},
  })
  showingContent.value = 'new'
}

const cancel = () => {
  const i = contents.value.length - 1
  if (showingContent.value == 'new') {
    contents.value.splice(i, 1)
  }
  showingContent.value = null
}

const move = (content, to) => {
  apiReq('patch', baseURL.value+'/contents/'+content.id+'/move', { to }).then(() => {
    getContents()
  })
  .catch(handleErrorApi)
}

watch(() => misc.activeSite.id, () => {
  if (misc.activeSite.id) {
    getPost()
  }
})
onMounted(() => {
  if (misc.activeSite.id) {
    getPost()
  }
})
</script>

<template>
  <div v-if="misc.activeSite.id">
    <div class="d-flex">
      <h5 class="mb-4">Post Content</h5>
      <div class="ms-auto">
        <button @click="router.back()" class="btn btn-sm btn-link">&larr; Back</button>
      </div>
    </div>
    <div>
      <div v-for="ctn,i in contents" :key="i" class="mb-3 border p-2">
        <template v-if="showingContent == ctn.id">
          <div class="d-flex gap-2 mb-2">
            <div class="w-100">
              <select class="form-control form-control-sm" v-model="ctn.content_type" placeholder="Type" :disabled="ctn.id != 'new'">
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
                <option value="image">Image</option>
              </select>
            </div>
            <div class="pt-1">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="ctn.show" :value="true">
                <label class="form-check-label" for="flexSwitchCheckDefault"></label>
              </div>
            </div>
          </div>
          <div class="mb-2 pt-2">
            <div v-if="ctn.content_type == 'markdown'">
              <div class="d-flex">
                <label class="form-label">Content</label>
                <a href="javascript:;" class="ms-auto small" data-bs-toggle="modal" data-bs-target="#SyntaxGuide">Syntax</a>
              </div>
              <textarea class="form-control form-control-sm" rows="12" v-model="ctn.data" placeholder=""
              spellcheck="false"></textarea>
            </div>
            <div v-if="ctn.content_type == 'html'">
              <label class="form-label">HTML code</label>
              <textarea class="form-control form-control-sm" rows="12" v-model="ctn.data" placeholder=""
              style="font-family: 'Courier New', Courier, monospace;font-size: smaller;color: black;"
              spellcheck="false"
              ></textarea>
            </div>
            <div v-if="ctn.content_type == 'image'">
              <InputImage v-model="ctn.dataObj.url" label="Image" />
              <label class="form-label">Caption</label>
              <input type="text" class="form-control" placeholder="" v-model="ctn.dataObj.caption">
            </div>
          </div>
          <div  class="d-flex gap-2">
            <button v-if="ctn.id != 'new'" @click="contentDelete(ctn)" class="btn btn-sm btn-outline-danger">
              <TrashIcon style="width: 14px;" />
            </button>
            <button @click="cancel(i)" class="btn btn-sm btn-outline-secondary w-100">
              Cancel
            </button>
            <button @click="contentUpsert(ctn)" class="btn btn-sm btn-outline-primary w-100">
              Save
            </button>
          </div>
        </template>
        <template v-else>
          <div class="d-flex">
            <div :class="{'text-decoration-line-through': !ctn.show}">
              <p class="mb-1">{{ ctn.number }}. {{ ctn.content_type }}</p>
              <p v-if="ctn.content_type == 'image'" class="mb-0 small text-muted">{{ ctn.dataObj.caption.substring(0,50) || 'No caption' }}</p>
              <p v-else class="mb-0 small text-muted">{{ ctn.data.substring(0,50) }}</p>
            </div>
            <div class="ms-auto">
              <div class="btn-group btn-group-sm">
                <button @click="move(ctn, 'up')" v-if="ctn.number > 1" class="btn btn-light border" :disabled="showingContent">&uparrow;</button>
                <button @click="move(ctn, 'down')" v-if="ctn.number < total" class="btn btn-light border" :disabled="showingContent">&downarrow;</button>
                <button @click="showingContent = ctn.id" class="btn btn-light border" :disabled="showingContent">Edit</button>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="!showingContent">
        <button @click="add()" class="btn btn-primary w-100">
            + Add New Content
          </button>
      </div>
    </div>
  </div>
</template>