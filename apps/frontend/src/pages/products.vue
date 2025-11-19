<script setup>
import ProductView from '../views/seller/ProductView.vue'
import { useMiscStore } from '../stores/misc';
import { useAuthStore } from '../stores/auth';
import LoginView from '~/views/LoginView.vue';
const auth = useAuthStore()
const misc = useMiscStore()
useHead({
  title: 'Produk Saya | ' + misc.config.site_name,
})
</script>

<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin" />
    <ProductView v-if="auth.store.id"/>
    <div v-else class="card text-center p-3">
      Kamu tidak memiliki toko
    </div>
  </div>
</template>