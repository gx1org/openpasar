<script setup>
import SaleDetailView from '../../views/seller/SaleDetailView.vue';
import { useMiscStore } from '../../stores/misc';
import { useRoute } from 'nuxt/app';
const route = useRoute()
const misc = useMiscStore()
useHead({
  title: 'Penjualan #' + route.params.id + ' | ' + misc.config.site_name,
})
</script>
<template>
  <SaleDetailView />
</template>