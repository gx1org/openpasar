<script setup>
import { onMounted, ref, computed } from 'vue';
import { apiReq, createPermalink, handleErrorApi } from '../helpers/fns';
import { useAuthStore } from '../stores/auth';
import { useMiscStore } from '../stores/misc';
import { useRouter } from 'vue-router';
import SubmitButton from '../components/partial/SubmitButton.vue'

const auth = useAuthStore()
const misc = useMiscStore()
const router = useRouter()
const form = ref({})
const isSending = ref(false)

const valid = computed(() =>{
  return form.value.name && form.value.subdomain
})

const submit = () => {
  if (form.value.subdomain.length < 5) {
    alert('Subdomain: at least 5 characters')
    return
  }

  isSending.value = true
  apiReq('post', '/sites', form.value).then(async res => {
    await auth.getSites()
    misc.setActiveSite(res.data.site)
    location.href = '/'
  })
  .catch(e => {
    handleErrorApi(e)
    isSending.value = false
  })
}

onMounted(() => {
  misc.setActiveSite({})
})
</script>

<template>
  <div>
    <h5 class="mb-4">Create Site</h5>
    <div>
      <div class="mb-3">
        <label for="" class="form-label">URL</label>
        <div class="input-group mb-2">
          <input type="text" class="form-control" v-model="form.subdomain">
          <span class="input-group-text">.webkus.com</span>
        </div>
        <span class="small text-muted">You can add your own domain later</span>
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Name</label>
        <input type="text" class="form-control" v-model="form.name">
      </div>
      <div>
        <SubmitButton @click="submit" class="btn btn-primary w-100"
        :sending="isSending"
        :disabled="!valid"
        >Create</SubmitButton>
      </div>
    </div>
  </div>
</template>