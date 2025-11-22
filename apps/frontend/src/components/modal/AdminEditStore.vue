<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { apiReq, handleErrorApi } from '../../utils/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const props = defineProps({
  data: Object
})

const auth = useAuthStore()
const emit = defineEmits(['updated'])
const form = ref({})
const closeBtn = ref(null)

const isValidForm = computed(() => {
  return form.value.name && form.value.email && form.value.phone && form.value.user_id && form.value.description
})

const isSending = ref(false)
const updateBtn = () => {
  normalize()
  isSending.value = true
  const method = form.value.id ? 'put' : 'post'
  const url = form.value.id ? `/admin/stores/${form.value.id}` : `/admin/stores`
  apiReq(method, url, form.value)
    .then(async res => {
      if (form.value.user_id == auth.user.id || props.data.user_id == auth.user.id) {
        await auth.refreshAccessToken()
      }
      emit('updated')
      closeBtn.value.click()
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const searchUserInput = ref('')
const filteredUsers = ref([])
const searchUser = () => {
  apiReq('get', `/admin/users?search=${searchUserInput.value}`)
    .then(res => {
      filteredUsers.value = res.data.users
    })
    .catch(handleErrorApi)
}

const selectUser = (user = {}) => {
  form.value.user_id = user.id
  form.value.user_name = user.name
  form.value.email = user.email
  form.value.phone = user.phone
  searchUserInput.value = ''
  filteredUsers.value = []
}

const normalize = () => {
  form.value.phone = normalizePhone(form.value.phone)
}

const canSelectUser = ref(false)

watch(() => props.data, () => {
  form.value = {...props.data}
  if (!form.value.id) {
    canSelectUser.value = true
  }
})
onMounted(() => {
  form.value = {...props.data}
  if (!form.value.id) {
    canSelectUser.value = true
  }
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="AdminEditStore">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Pengaturan Toko</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="" class="form-label">Pengguna</label>
            <div v-if="form.user_id" class="input-group">
              <input :disabled="form.id" type="text" class="form-control" v-model="form.user_name">
              <button :disabled="form.id" class="btn btn-light border text-danger" @click="selectUser">&times;</button>
            </div>
            <div v-else>
              <input type="search" placeholder="Cari..." class="form-control" v-model="searchUserInput" @change="searchUser">
              <div class="mt-2">
                <a v-for="u,i in filteredUsers" :key="i" :class="{disabled:Boolean(u.store)}" href="javascript:;" @click="selectUser(u)" class="btn btn-light btn-sm me-2 border">
                  <s v-if="u.store">{{ u.name }}</s>
                  <span v-else>{{ u.name }}</span>
                </a>
                <span v-if="filteredUsers.length == 0" class="text-muted small">Tidak ada hasil</span>
              </div>
            </div>
          </div>
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
            <input type="text" class="form-control" v-model="form.phone" @change="normalize">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Deskripsi Toko</label>
            <textarea class="form-control" v-model="form.description" rows="7"></textarea>
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
