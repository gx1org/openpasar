<script setup>
import CartView from '../views/CartView.vue'
import { useMiscStore } from '../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Keranjang | ' + misc.config.site_name,
})
</script>

<template>
  <CartView />
</template>