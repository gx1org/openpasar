<script setup>
import { ref } from 'vue';
import { apiReq, formatDate, handleErrorApi } from '../helpers/fns';
import SubmitButton from '../components/partial/SubmitButton.vue'
import { useMiscStore } from '../stores/misc';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore()
const misc = useMiscStore()
const form = ref({
  name: misc.activeSite.my_nickname
})

const isSending = ref(false)
const saveBtn = () => {
  isSending.value = true
  apiReq('patch', `/sites/${misc.activeSite.id}/profile`, form.value).then(() => {
    location.reload()
  })
  .catch(e => {
    handleErrorApi(e)
    isSending.value = false
  })
}
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Profil</h5>
      <div class="ms-auto">
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <td class="text-muted">ID</td>
            <td>{{ auth.user.id }}</td>
          </tr>
          <tr>
            <td class="text-muted">Email</td>
            <td>{{ auth.user.email }}</td>
          </tr>
          <tr>
            <td class="text-muted">Name</td>
            <td>{{ auth.user.name }}</td>
          </tr>
          <tr>
            <td class="text-muted">Registered</td>
            <td>{{ formatDate(auth.user.registered_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-3 border bg-light">
      <div class="mb-3">
        <label for="" class="form-label">Edit your nick name</label>
        <input type="text" class="form-control" v-model="form.name">
      </div>
      <SubmitButton @click="saveBtn" class="btn btn-primary w-100" :sending="isSending" :disabled="!form.name || form.name == auth.user.name">
        Save changes
      </SubmitButton>
    </div>
  </div>
</template>