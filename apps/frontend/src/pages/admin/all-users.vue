<script setup>
import AllUserView from '../../views/admin/AllUserView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Semua Transaksi | ' + misc.config.site_name,
})
</script>
<template>
  <AllUserView />
</template>