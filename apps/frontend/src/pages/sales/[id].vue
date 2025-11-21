<script setup>
import SaleDetailView from '../../views/seller/SaleDetailView.vue';
import { useMiscStore } from '../../stores/misc';
import { useRoute } from 'nuxt/app';
import LoginView from '~/views/LoginView.vue';
const auth = useAuthStore()
const route = useRoute()
const misc = useMiscStore()
useHead({
  title: 'Penjualan #' + route.params.id + ' | ' + misc.config.site_name,
})
</script>
<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <SaleDetailView v-else-if="auth.store.id" />
    <div v-else class="card text-center p-3">
      Kamu tidak memiliki toko
    </div>
  </div>
</template>