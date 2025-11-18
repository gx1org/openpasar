<script setup>
import AllStoreView from '../../views/admin/AllStoreView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Semua Toko | ' + misc.config.site_name,
})
</script>
<template>
  <AllStoreView />
</template>