<script setup>
import TransactionDetailView from '../../../views/admin/TransactionDetailView.vue';
import { useMiscStore } from '../../../stores/misc';
import { useRoute } from 'nuxt/app';
const route = useRoute()
const misc = useMiscStore()
useHead({
  title: 'Transaksi #' + route.params.id + ' | ' + misc.config.site_name,
})
</script>
<template>
  <TransactionDetailView />
</template>