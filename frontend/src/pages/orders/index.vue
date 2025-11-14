<script setup>
import OrderView from '../../views/OrderView.vue'
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Pesanan Saya | ' + misc.config.site_name,
})

definePageMeta({
  requireAuth: true
})
</script>
<template>
  <OrderView />
</template>