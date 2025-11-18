<script setup>
import AllProductView from '../../views/admin/AllProductView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Semua Produk | ' + misc.config.site_name,
})
</script>
<template>
  <AllProductView />
</template>