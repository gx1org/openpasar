<script setup>
import AllWithdrawalView from '../../views/admin/AllWithdrawalView.vue';
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Semua Penarikan | ' + misc.config.site_name,
})
</script>
<template>
  <AllWithdrawalView />
</template>