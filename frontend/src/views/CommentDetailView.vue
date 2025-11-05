<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { apiReq, formatDateTime, handleErrorApi } from '../helpers/fns';
import { useMiscStore } from '../stores/misc';
import SubmitButton from '../components/partial/SubmitButton.vue';

const misc = useMiscStore()
const siteId = computed(() => misc.activeSite.id)
const route = useRoute()
const id = computed(() => route.params.id)

const comment = ref({
  member: {},
  post: {}
})
const form = ref({})
const isFetching = ref(true)
const isSending = ref(false)

const isValid = computed(() => {
  return Boolean(form.value.comment)
})

const getData = () => {

  isFetching.value = true
  apiReq('get', `/sites/${siteId.value}/comments/${id.value}`).then(res => {
    comment.value = res.data.comment
    form.value.comment = res.data.comment.reply.comment
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const submit = () => {
  isSending.value = true
  apiReq('post',  `/sites/${siteId.value}/comments/${id.value}`, form.value).then(() => {
    getData()
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
    form.value.delete = false
  })
}

const deleteReply = () => {
  if (confirm('Delete reply?')) {
    form.value.delete = true
    submit()
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Comment Detail</h5>
      <div class="ms-auto">
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-header small">
        <p class="mb-0">
          <span>{{ comment.name }}</span>
          |
          <a v-if="comment.url" :href="comment.url"
            target="_blank" rel="noopener noreferrer">
            {{ comment.url }} &nearr;
          </a>
          <span v-else class="text-muted">
            No url
          </span>
        </p>
      </div>
      <div class="card-body">
        <p>
          {{ comment.comment }}
        </p>
        <p class="mb-0 small">
          in <a :href="misc.activeSite.home_url+'/p/'+comment.post.permalink" target="_blank" rel="noopener noreferrer">
            {{ comment.post.title }} &nearr;
          </a>
        </p>
      </div>
      <div class="card-footer small">
        <span>{{ formatDateTime(comment.created_at) }}, </span>
        <span>{{ comment.is_published ? 'Published' : 'Un-published' }}</span>
      </div>
    </div>
    <template v-if="comment.is_replied">
      <div v-if="!comment.show_reply" class="card mb-3">
        <div class="card-header small d-flex gap-2">
          <span class="me-auto">Admin</span>
          <a @click="deleteReply" href="javascript:;" class="btn btn-sm btn-outline-danger">Delete</a>
        </div>
        <div class="card-body">
          {{ comment.reply?.comment }}
        </div>
        <div class="card-footer small">
          <span>{{ formatDateTime(comment.created_at) }}</span>
        </div>
      </div>
    </template>
    <div v-if="comment.show_reply">
      <div class="mb-3">
        <label for="" class="form-label">Reply</label>
        <textarea class="form-control" rows="3" v-model="form.comment"></textarea>
      </div>
      <div class="d-flex">
        <button @click="comment.show_reply = false" class="btn btn-secondary w-100 me-2">
          Cancel
        </button>
        <SubmitButton @click="submit" :disabled="!isValid" :sending="isSending" class="btn btn-primary w-100">
          Save reply
        </SubmitButton>
      </div>
    </div>
    <div v-else class="d-flex">
      <RouterLink to="/comments" class="btn btn-secondary w-100 me-2">&larr; Back</RouterLink>
      <button @click="comment.show_reply = true" class="btn btn-primary w-100">
        Write/edit reply
      </button>
    </div>

  </div>
</template>