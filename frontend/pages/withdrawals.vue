<script setup>
import WithdrawalView from '../views/WithdrawalView.vue'
import { useMiscStore } from '../stores/misc';
const misc = useMiscStore()
useHead({
  title: 'Penarikan Saldo | ' + misc.config.site_name,
})
</script>

<template>
  <WithdrawalView />
</template>