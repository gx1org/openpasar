<script setup>
import AccountView from '../views/AccountView.vue'
import { useMiscStore } from '../stores/misc';
import LoginView from '~/views/LoginView.vue';
const misc = useMiscStore()
const auth = useAuthStore()
useHead({
  title: 'Akun | ' + misc.config.site_name,
})
definePageMeta({
  requireAuth: true
})
</script>
<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <AccountView v-else />
  </div>
</template>