<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { apiReq, handleErrorApi } from '../../utils/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const auth = useAuthStore()
const emit = defineEmits(['updated'])
const form = ref({})
const closeBtn = ref(null)
const props = defineProps({
  lastWd: Object
})

const isValidForm = computed(() => {
  return form.value.receiver && form.value.amount && form.value.amount > 0 && form.value.amount <= auth.user.balance
})

const isSending = ref(false)
const updateBtn = () => {
  isSending.value = true
  apiReq('post', `/user/withdrawals`, form.value)
    .then(() => {
      emit('updated')
      closeBtn.value.click()
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const tryMe = () => {
  form.value.receiver = event.target.innerText
}

const norm = (key) => {
  form.value.pin = normalizePin(form.value.pin)
}

onMounted(() => {
  if (props.lastWd) {
    form.value.receiver = props.lastWd.receiver
  }
  form.value.amount = auth.user.balance
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="WithdrawForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ajukan Penarikan</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="" class="form-label">Saldo</label>
            <input type="text" disabled class="form-control" :value="Rp(auth.user.balance)">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Nominal</label>
            <input type="number" class="form-control" v-model="form.amount">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Tujuan</label>
            <input type="text" class="form-control" v-model="form.receiver">
            <p v-if="!form.receiver" class="mb-0 mt-1 small text-muted">Contoh: 
              <a href="javascript:;" @click="tryMe">
                Seabank 90123456789 A.n John Doe
              </a>
            </p>
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Masukan PIN (6 digit angka)</label>
            <input type="text" class="form-control" v-model="form.pin" @input="norm('new_pin')">
          </div>
          <div>
            <SubmitButton :disabled="!isValidForm" :sending="isSending" @click="updateBtn" class="btn btn-primary w-100">
              Submit
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
