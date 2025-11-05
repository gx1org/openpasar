<script setup>
import { watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { RouterLink, useRoute } from 'vue-router';
import { useMiscStore } from '../../stores/misc';
import { apiReq, handleErrorApi, img } from '../../helpers/fns';

const route = useRoute()
const auth = useAuthStore()
const misc = useMiscStore()

watch(() => route.path, () => {
  let nt = document.getElementById('navbar_top')
  if (!nt) return
  if (nt.classList.contains('show')) {
    document.getElementById('navbar_top_btn').click()
  }
})

const logoutBtn = () => {
  if (confirm('Logout now?')) {
    apiReq('post', '/logout').then(() => {
      auth.setLogout()
      location.href = 'https://berdikori.com'
    })
    .catch(handleErrorApi)
  }
}

const switchBtn = () => {
  if (!confirm('Switch account?')) return
  apiReq('post', '/logout').then(() => {
    auth.setLogout()
    location.reload()
  })
  .catch(handleErrorApi)
}
</script>

<template>
  <nav class="navbar navbar-light navbar-expand px-3 fixed-top container bg-white border-bottom">
    <RouterLink to="/" class="navbar-brand me-2">
      <img :src="img(misc.config.site_icon)" alt="logo" width="30" class="mb-1" />
    </RouterLink>
    <div class="input-group">
      <input class="form-control" :placeholder="misc.config.site_name" aria-label="Search" aria-describedby="basic-addon2">
      <button class="btn btn-light border" type="button" id="basic-addon2">
        <i class="bi bi-search"></i>
      </button>
    </div>
  </nav>
</template>
