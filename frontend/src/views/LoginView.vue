<script setup>
import { ref } from 'vue';
import { apiReq } from '../helpers/fns';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore()
const form = ref({
  username: '',
  password: '',
})

const submit = () => {
  apiReq('post', '/login', form.value).then(res => {
    auth.setAuth(res.data)
  })
}
</script>

<template>
  <div class="">
    <h5 class="mb-4">Login</h5>
    <div class="mb-3">
      <label for="" class="form-label">Username</label>
      <input type="text" class="form-control" v-model="form.username">
    </div>
    <div class="mb-3">
      <label for="" class="form-label">Password</label>
      <input type="password" class="form-control" v-model="form.password">
    </div>
    <div>
      <button class="btn btn-primary w-100" @click="submit">Login</button>
    </div>
  </div>
</template>