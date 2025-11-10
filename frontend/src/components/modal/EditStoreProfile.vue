<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { apiReq, handleErrorApi } from '../../helpers/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const auth = useAuthStore()
const emit = defineEmits(['updated'])
const form = ref({})
const closeBtn = ref(null)

const isValidForm = computed(() => {
  return form.value.name && form.value.email && form.value.phone
})

const isSending = ref(false)
const updateBtn = () => {
  isSending.value = true
  apiReq('put', `/user/stores`, form.value)
    .then(res => {
      auth.store = res.data.store
      emit('updated')
      closeBtn.value.click()
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

onMounted(() => {
  form.value = {...auth.store}
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="EditStoreProfile">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Pengaturan Toko</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="" class="form-label">Nama</label>
            <input type="text" class="form-control" v-model="form.name">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Email</label>
            <input type="email" class="form-control" v-model="form.email">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">No. Whatsapp</label>
            <input type="email" class="form-control" v-model="form.phone">
          </div>
          <div>
            <SubmitButton :disabled="!isValidForm" :sending="isSending" @click="updateBtn" class="btn btn-primary w-100">
              Simpan Perubahan
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
