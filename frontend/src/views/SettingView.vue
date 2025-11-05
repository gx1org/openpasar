<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SubmitButton from '../components/partial/SubmitButton.vue';
import InputImage from '../components/partial/InputImage.vue';
import { useMiscStore } from '../stores/misc';
import CustomDomain from '../components/modal/CustomDomain.vue';

const auth = useAuthStore()
const form = ref({})
const isSending = ref(false)
const misc = useMiscStore()

const isValidForm = computed(() => {
  return Boolean(form.value.domain && form.value.name)
})

const saveBtn = async () => {
  isSending.value = true
  apiReq('put', '/sites/'+misc.activeSite.id, form.value)
    .then(async res => {
      await auth.getSites()
      misc.setActiveSite(res.data.site)
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

onMounted(() => {
  form.value = JSON.parse(JSON.stringify(misc.activeSite))
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">
        Setting
      </h5>
      <div class="ms-auto">
      </div>
    </div>
    <div class="">
      <div class="mb-3">
        <label for="" class="form-label">Domain</label>
        <div class="input-group">
          <input type="text" class="form-control" :value="misc.activeSite.domain" placeholder="" disabled>
          <button :disabled="misc.activeSite.is_pending_ssl" class="btn btn-light border" data-bs-toggle="modal" data-bs-target="#CustomDomain">
            Change
          </button>
        </div>
        <div v-if="misc.activeSite.is_pending_ssl" class="mt-2 small alert alert-danger">
          <p class="mb-2">
            We are issuing SSL for your domain.
            Your website may not be accessible for temporary.
          </p>
          <p class="mb-0">
            If this process takes longer than 15 minutes, please contact us.
          </p>
        </div>
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Name</label>
        <input type="text" class="form-control" v-model="form.name">
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Tagline</label>
        <input type="text" class="form-control" v-model="form.tagline">
      </div>
      <div class="mb-3">
        <InputImage v-model="form.icon" label="Icon" />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">URL to see Analytics</label>
        <input type="text" class="form-control" v-model="form.analytic_url">
      </div>
    </div>
    <div class="d-flex gap-2">
      <SubmitButton @click="saveBtn" class="btn btn-primary w-100" :sending="isSending" :disabled="!isValidForm">
        Save Changes
      </SubmitButton>
    </div>
    <CustomDomain :data="misc.activeSite" />
  </div>
</template>