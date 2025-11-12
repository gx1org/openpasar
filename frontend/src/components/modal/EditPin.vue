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
  return form.value.new_pin
})

const isSending = ref(false)
const updateBtn = () => {
  isSending.value = true
  apiReq('put', `/user/pin`, form.value)
    .then(() => {
      emit('updated')
      closeBtn.value.click()
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

onMounted(() => {
  form.value = {...auth.user}
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="EditPin">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Atur PIN Penarikan</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="" class="form-label">PIN Lama</label>
            <input type="text" class="form-control" v-model="form.old_pin">
            <p class="mb-0 mt-1 small text-muted">Kosongkan jika belum pernah mengatur PIN</p>
          </div>
          <div class="mb-3">
            <label for="" class="form-label">PIN Baru</label>
            <input type="text" class="form-control" v-model="form.new_pin">
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
