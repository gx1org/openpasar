<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMiscStore } from '../../stores/misc';
import { apiReq, createPermalink, handleErrorApi } from '../../helpers/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const misc = useMiscStore()
const form = ref({})
const closeBtn = ref(null)
const router = useRouter()

const submit = () => {
  apiReq('post', `/sites/${misc.activeSite.id}/posts`, form.value)
    .then(res => {
      closeBtn.value.click()
      router.push('/posts/'+res.data.post.id)
    })
    .catch(handleErrorApi)
}

const permalinkDirty = ref(false)
const oninput = () => {
  if (!permalinkDirty.value) {
    form.value.permalink = createPermalink(form.value.title)
  }
}

onMounted(() => {
  const myModal = document.getElementById('CreatePost')
  const postTitle = document.getElementById('postTitle')

  myModal.addEventListener('shown.bs.modal', () => {
    postTitle.focus()
  })
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="CreatePost">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create New Post</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="max-height: calc(100vh - 85px);overflow-y: auto;">
          <div class="mb-3">
            <label for="" class="form-label">Title</label>
            <input type="email" class="form-control" id="postTitle" v-model="form.title" @input="oninput">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Permalink</label>
            <input type="email" class="form-control" id="postTitle" v-model="form.permalink" @input="permalinkDirty = true">
          </div>
          <div>
            <SubmitButton @click="submit" :disabled="!form.title || !form.permalink" class="btn btn-primary w-100">
              Create
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
