<script setup>
import SearchView from '../views/SearchView.vue';
import { useMiscStore } from '../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Cari Produk | ' + misc.config.site_name,
})
</script>
<template>
  <SearchView />
</template>