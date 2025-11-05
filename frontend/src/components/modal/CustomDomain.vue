<script setup>
import { computed, onMounted, ref } from 'vue';
import { watch } from 'vue';
import { apiReq, handleErrorApi } from '../../helpers/fns';
import SubmitButton from '../partial/SubmitButton.vue'
import { useMiscStore } from '../../stores/misc';

const misc = useMiscStore()
const prop = defineProps({
  data: Object
})
const emits = defineEmits(['updated'])
const form = ref({
  domain: '',
  subdomain: '',
})
const isSubdomain = ref(true)

const finalDomain = computed(() => {
  return isSubdomain.value ? (
    form.value.subdomain ? form.value.subdomain + '.webkus.com' : ''
  ) : form.value.domain
})

const invalid = computed(() => {
  return !finalDomain.value || finalDomain.value == prop.data.domain
})

const handleMount = () => {
  const data = JSON.parse(JSON.stringify(prop.data))
  isSubdomain.value = prop.data.domain.endsWith('.webkus.com')
  if (isSubdomain.value) {
    form.value.subdomain = data.domain.replace('.webkus.com', '')
  } else {
    form.value.domain = data.domain
  }
}

watch(() => prop.data, handleMount)
onMounted(handleMount)

const isSending = ref(false)
const submitBtn = () => {  
  isSending.value = true
  apiReq('patch', `/sites/${misc.activeSite.id}/domain`, {
    domain: finalDomain.value
  }).then(() =>{
    location.reload()
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}
</script>
<template>
  <div class="modal fade" tabindex="-1" id="CustomDomain">
    <div class="modal-dialog my-2">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Site Domain
          </h5>
          <button id="CustomDomain-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="max-height: calc(100vh - 85px);overflow-y: auto;">
          <div class="mb-2">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :checked="isSubdomain" @click="isSubdomain = true" id="use-subdomain">
              <label class="form-check-label" for="use-subdomain">
                Subdomain
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" :checked="!isSubdomain" @click="isSubdomain = false" name="radioDefault" id="use-custom-domain">
              <label class="form-check-label" for="use-custom-domain">
                Custom domain
              </label>
            </div>
          </div>
          <div class="mb-3">
            <div class="input-group" v-if="isSubdomain">
              <input type="text" class="form-control" v-model="form.subdomain" placeholder="example">
              <span class="input-group-text">.webkus.com</span>
            </div>
            <div v-else class="input-group">
              <input type="text" class="form-control" v-model="form.domain" placeholder="example.com">
            </div>
          </div>
          <p class="small" v-if="!isSubdomain">
            You can read
          </p>
          <div>
            <SubmitButton @click="submitBtn" :disabled="invalid" :sending="isSending" class="btn btn-primary w-100">
              Save Changes
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
