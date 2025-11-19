<script setup>
import CartView from '../views/CartView.vue'
import { useMiscStore } from '../stores/misc';
import LoginView from '~/views/LoginView.vue';
const misc = useMiscStore()
const auth = useAuthStore()
useHead({
  title: 'Keranjang | ' + misc.config.site_name,
})
definePageMeta({
  requireAuth: true
})
</script>

<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <CartView v-else/>
  </div>
</template>