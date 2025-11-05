<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { apiReq, createPermalink, formatDate, handleErrorApi } from '../helpers/fns';
import { useMiscStore } from '../stores/misc';
import SubmitButton from '../components/partial/SubmitButton.vue';
import InputImage from '../components/partial/InputImage.vue';
import SimpleMDE from '../components/partial/SimpleMDE.vue';

const misc = useMiscStore()
const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id)
const isContributor = computed(() => {
  return misc.activeSite.my_role == 'contributor'
})

const form = ref({})
const isFetching = ref(true)
const isSending = ref(false)
const showOption = ref(false)

const isValid = computed(() => {
  return Boolean(form.value.title && form.value.permalink && form.value.published_at && form.value.content)
})

const canView = ref(false)
const lastForm = ref('')

const getData = async () => {
  if (misc.directories.length == 0) {
    await misc.getDirectories()
  }

  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/posts/${id.value}`).then(res => {
    res.data.post.published_at = res.data.post.published_at.slice(0, 10)
    form.value = res.data.post
    isFetching.value = false
    if (!res.data.post.is_published) {
      showOption.value = true
    }
    setCanView(res.data.post)
    lastForm.value = JSON.stringify(form.value)
  })
  .catch(e => {
    handleErrorApi(e)
  })
}

const intervalId = ref(null)
const startAutoSave = () => {
  intervalId.value = setInterval(() => {
    const str = JSON.stringify(form.value)
    if (!canView.value && str != lastForm.value && location.pathname.startsWith('/posts/')) {
      submit()
    }
    lastForm.value = str
  }, 10000);
}

const setCanView = ({ is_published, published_at }) => {
  const t = (new Date(published_at)).getTime()
  const now = new Date().getTime()
  canView.value = is_published && (t < now)
}

const onInput = () => {
  if (!isNew.value || form.value.touched) return;
  form.value.permalink = createPermalink(form.value.title)
}

const savingKey = ref(0)
const submit = async () => {
  isSending.value = true
  let url = `/sites/${misc.activeSite.id}/posts/${id.value}`
  if (isContributor.value) {
    url += '/ascontributor'
  }
  const payload = JSON.parse(JSON.stringify(form.value))
  payload.published_at = new Date(payload.published_at).toISOString()
  apiReq('put', url, payload).then(() => {
    savingKey.value++
    setCanView(payload)
    toastBootstrap.value.show()
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}

function detectCmdS(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && this.location.pathname.startsWith('/posts/')) {
    e.preventDefault();
    submit();
  }
}

const toastBootstrap = ref(null)
onMounted(() => {
  getData()
  startAutoSave()
  const toastLiveExample = document.getElementById('liveToast')
  toastBootstrap.value = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  document.addEventListener('keydown', detectCmdS);
})

onUnmounted(() => {
  clearInterval(intervalId.value)
  document.removeEventListener("keydown", detectCmdS);
})

</script>

<template>
  <div v-if="misc.activeSite.id">
    <div class="d-flex">
      <h5 class="mb-4">Edit Post</h5>
      <div class="ms-auto">
      </div>
    </div>
    <template v-if="!isFetching">
      <div class="mb-3">
        <label for="" class="form-label">Title</label>
        <input @input="onInput" type="text" class="form-control" v-model="form.title">
      </div>
      <div class="mb-3">
        <div class="d-flex">
          <label for="" class="form-label">Content</label>
        </div>
        <SimpleMDE v-model="form.content" :savingKey="savingKey" />
      </div>
      <div v-if="!isContributor" class="text-center">
        <button class="btn btn-light border mb-3 btn-sm" @click="showOption = !showOption">
          Advanced options {{ showOption ? '&times;' : '&downarrow;' }}
        </button>
      </div>
      <div v-if="!isContributor" class="row g-3 bg-light border m-0 mb-3 px-1 pb-3 rounded collapse" :class="{show: showOption}">
        <div class="col-md-6">
          <label for="" class="form-label">Directory</label>
          <select class="form-control" v-model="form.directory_id">
            <option v-for="d,i in misc.directories" :key="i" :value="d.id">{{ d.permalink }}</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="" class="form-label">Permalink</label>
          <div class="input-group">
            <input @click="form.touched = true" type="text" class="form-control" v-model="form.permalink">
          </div>
        </div>
        <div class="col-md-6">
          <label for="" class="form-label">Tag</label>
          <div class="input-group">
            <input type="text" class="form-control" v-model="form.tag">
          </div>
        </div>
        <div class="col-md-6">
          <label for="" class="form-label">Is Published</label>
          <select class="form-control" v-model="form.is_published">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="" class="form-label">Publish Date</label>
          <input type="date" class="form-control" v-model="form.published_at">
        </div>
        <div class="col-md-6">
          <label for="" class="form-label">Indexable?</label>
          <select class="form-control" v-model="form.noindex">
            <option :value="false">Yes</option>
            <option :value="true">Prevent bots indexing this post</option>
          </select>
        </div>
        <div class="col-md-6">
          <InputImage v-model="form.thumbnail" label="Thumbnail" />
        </div>
        <div class="col-md-6">
          <InputImage v-model="form.featured_image" label="Featured Image" />
        </div>
      </div>
      <div class="d-flex">
        <RouterLink to="/posts" class="btn btn-secondary w-100 me-2">&larr; Back</RouterLink>
        <SubmitButton @click="submit" :disabled="!isValid" :sending="isSending" class="btn btn-primary w-100">
          Save Changes
        </SubmitButton>
      </div>
      <div>
        <a :href="`${misc.activeSite.home_url}/p/${form.permalink}`"
        target="_blank" rel="noopener noreferrer" class="w-100 btn btn-light border mt-2"
        :class="{disabled: !canView}"
        >
        <span v-if="canView">View post &nearr;</span>
        <del v-else>View post &nearr;</del>
        </a>
      </div>
    </template>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2000">
        <div class="d-flex">
          <div class="toast-body text-success">
            Changes saved successfully
          </div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
</template>