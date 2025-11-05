<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { useMiscStore } from '../../stores/misc';
import { apiReq, handleErrorApi } from '../../helpers/fns'

const auth = useAuthStore()
const emit = defineEmits(['updated'])
const prop = defineProps({
  data: Object
})

const misc = useMiscStore()
const form = ref({})
const closeBtn = ref(null)

const update = () => {
  apiReq('patch', `/sites/${misc.activeSite.id}/admins/${prop.data.id}`, form.value)
    .then(onSuccess)
    .catch(handleErrorApi)
}

const create = () => {
  apiReq('post', `/sites/${misc.activeSite.id}/admins`, form.value)
    .then(onSuccess)
    .catch(handleErrorApi)
}

const remove = () => {
  if (!confirm('Are you sure?')) {
    return
  }

  apiReq('delete', `sites/${misc.activeSite.id}/admins/${prop.data.id}`)
    .then(onSuccess)
    .catch(handleErrorApi)
}

const onSuccess = () => {
  if (prop.data.user_id == auth.user.id) {
    location.href = '/'
  } else {
    emit('updated')
    closeBtn.value.click()
  }
}

watch(() => prop.data.id, () => {
  form.value.role = prop.data.role
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="AdminPopup">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 v-if="prop.data.id" class="modal-title">Admin: {{ prop.data.user.name }}</h5>
          <h5 v-else class="modal-title">New Admin</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="max-height: calc(100vh - 85px);overflow-y: auto;">
          <div v-if="!prop.data.id" class="mb-3">
            <label for="" class="form-label">Email</label>
            <input type="email" class="form-control" v-model="form.email">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Role</label>
            <select class="form-control" v-model="form.role">
              <option value="contributor">contributor</option>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <button @click="update" v-if="prop.data.id" class="btn btn-primary w-100">Save Changes</button>
            <button @click="create" v-if="!prop.data.id" class="btn btn-primary w-100">Create</button>
          </div>
          <div v-if="prop.data.id">
            <hr>
            <button @click="remove" class="btn btn-outline-danger w-100">Remove</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
