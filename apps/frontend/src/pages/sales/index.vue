<script setup>
import SaleView from '../../views/seller/SaleView.vue';
import { useMiscStore } from '../../stores/misc';
import LoginView from '~/views/LoginView.vue';
const auth = useAuthStore()
const misc = useMiscStore()
useHead({
  title: 'Penjualan Saya | ' + misc.config.site_name,
})
</script>
<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <SaleView v-else-if="auth.store.id" />
    <div v-else class="card text-center p-3">
      Kamu tidak memiliki toko
    </div>
  </div>
</template>