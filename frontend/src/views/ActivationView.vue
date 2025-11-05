<script setup>
import { onMounted, ref } from 'vue';
import { useMiscStore } from '../stores/misc';
import { useRouter } from 'vue-router'
import SubmitButton from '../components/partial/SubmitButton.vue';
import { apiReq, handleErrorApi } from '../helpers/fns';

const router = useRouter()
const misc = useMiscStore()
const activationCode = ref('')

const isSending = ref(false)
const submitBtn = () => {
  isSending.value = true
  apiReq('post', `/sites/${misc.activeSite.id}/activate`, {
    code: activationCode.value
  })
    .then(res => {
      location.href = '/posts'
    })
    .catch(e => {
      handleErrorApi(e)
      isSending.value = false
  })
}

onMounted(() => {
  if (misc.activeSite.status == 'active') {
    router.push('/posts')
  }
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Site Activation</h5>
    </div>
    <div class="mb-4 bg-white border p-3">
      <div class="mb-3">
        <label for="" class="form-label">Enter Activation code</label>
        <input type="text" class="form-control" v-model="activationCode" @keyup.enter="submitBtn">
      </div>
      <div>
        <SubmitButton class="btn btn-primary w-100" @click="submitBtn" :sending="isSending" :disabled="!activationCode">Submit</SubmitButton>
      </div>
    </div>
    <div>
      <h5>Don't have it?</h5>
      <p>
      </p>
    </div>
  </div>
</template>