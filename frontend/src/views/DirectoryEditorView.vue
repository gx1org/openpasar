<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { apiReq, createPermalink, handleErrorApi } from '../helpers/fns';
import { useMiscStore } from '../stores/misc';
import SubmitButton from '../components/partial/SubmitButton.vue';

const misc = useMiscStore()
const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id)
const isNew = computed(() => {
  return route.params.id == 'new'
})
const isContributor = computed(() => {
  return misc.activeSite.my_role == 'contributor'
})

const form = ref({})
const isFetching = ref(true)
const isSending = ref(false)

const isValid = computed(() => {
  return Boolean(form.value.permalink)
})

const getData = () => {
  if (isNew.value) {
    form.value.is_published = isContributor.value ? false : true
    isFetching.value = false
    return
  }

  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/directories/${id.value}`).then(res => {
    form.value = res.data.directory
    isFetching.value = false
  })
  .catch(e => {
    handleErrorApi(e)
  })
}

const submit = async () => {
  isSending.value = true
  const method = isNew.value ? 'post' : 'put'
  const url = `/sites/${misc.activeSite.id}/directories` + (isNew.value ? '' : '/'+id.value)
  form.value.permalink = createPermalink(form.value.permalink)
  const payload = JSON.parse(JSON.stringify(form.value))

  apiReq(method, url, payload).then(() => {
    router.push('/directories')
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}

onMounted(() => {
  if (misc.activeSite.id) {
    getData()
  }
})
</script>

<template>
  <div v-if="misc.activeSite.id">
    <div class="d-flex">
      <h5 class="mb-4">{{ isNew ? 'Create Directory' : 'Edit Directory' }}</h5>
      <div class="ms-auto">
      </div>
    </div>
    <div v-if="!isFetching">
      <div class="mb-3">
        <label for="" class="form-label">Permalink</label>
        <div class="input-group">
          <input type="text" class="form-control" v-model="form.permalink" :disabled="form.is_default">
        </div>
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Description</label>
        <textarea class="form-control" v-model="form.description" :disabled="form.is_default"></textarea>
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Is Published</label>
        <select class="form-control" v-model="form.is_published" :disabled="form.is_default">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>
      <div class="d-flex">
        <RouterLink to="/directories" class="btn btn-secondary w-100 me-2">&larr; Back</RouterLink>
        <SubmitButton @click="submit" :disabled="!isValid || form.is_default" :sending="isSending" class="btn btn-primary w-100">
          Save Changes
        </SubmitButton>
      </div>
    </div>
  </div>
</template>