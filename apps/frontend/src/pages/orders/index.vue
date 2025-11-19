<script setup>
import OrderView from '../../views/OrderView.vue'
import { useMiscStore } from '../../stores/misc';
import LoginView from '~/views/LoginView.vue';
const auth = useAuthStore()
const misc = useMiscStore()
useHead({
  title: 'Pesanan Saya | ' + misc.config.site_name,
})

definePageMeta({
  requireAuth: true
})
</script>
<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <OrderView v-else />
  </div>
</template>