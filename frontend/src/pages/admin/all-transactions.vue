<script setup>
import AllTransactionView from '../../views/admin/AllTransactionView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Semua Transaksi | ' + misc.config.site_name,
})
</script>
<template>
  <AllTransactionView />
</template>