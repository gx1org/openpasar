<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { apiReq, handleErrorApi, normalizePin } from '../../utils/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const auth = useAuthStore()
const emit = defineEmits(['updated'])
const form = ref({})
const closeBtn = ref(null)

const isValidForm = computed(() => {
  return form.value.new_pin && form.value.new_pin.length === 6
  && (!form.value.old_pin || form.value.old_pin.length === 6)
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

const norm = (key) => {
  form.value[key] = normalizePin(form.value[key])
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
            <input type="text" class="form-control" v-model="form.old_pin" @input="norm('old_pin')">
            <p class="mb-0 mt-1 small text-muted">Kosongkan jika belum pernah mengatur PIN</p>
          </div>
          <div class="mb-3">
            <label for="" class="form-label">PIN Baru (6 digit angka)</label>
            <input type="text" class="form-control" v-model="form.new_pin" @input="norm('new_pin')">
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
