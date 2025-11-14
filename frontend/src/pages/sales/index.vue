<script setup>
import SaleView from '../../views/seller/SaleView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Penjualan Saya | ' + misc.config.site_name,
})
</script>
<template>
  <SaleView />
</template>