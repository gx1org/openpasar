<script setup>
import ConfigView from '../../views/admin/ConfigView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Konfigurasi | ' + misc.config.site_name,
})
</script>
<template>
  <ConfigView />
</template>