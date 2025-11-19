<script setup>
import OrderDetailView from '../../views/OrderDetailView.vue'
import { useMiscStore } from '../../stores/misc';
import { useRoute } from 'nuxt/app';
import LoginView from '~/views/LoginView.vue';
const route = useRoute()
const auth = useAuthStore()
const misc = useMiscStore()
useHead({
  title: 'Pesanan #' + route.params.id + ' | ' + misc.config.site_name,
})

definePageMeta({
  requireAuth: true
})
</script>
<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <OrderDetailView v-else />
  </div>
</template>