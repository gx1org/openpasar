<script setup>
import FeaturedProductView from '../../views/admin/FeaturedProductView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Produk Unggulan | ' + misc.config.site_name,
})
</script>
<template>
  <FeaturedProductView />
</template>