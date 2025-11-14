<script setup>
import ProductView from '../views/seller/ProductView.vue'
import { useMiscStore } from '../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Produk Saya | ' + misc.config.site_name,
})
</script>

<template>
  <ProductView />
</template>