<script setup>
import StoreSearchView from '../../views/StoreSearchView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Cari Toko | ' + misc.config.site_name,
})
</script>
<template>
  <StoreSearchView />
</template>