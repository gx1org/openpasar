<script setup>
import OrderDetailView from '../../views/OrderDetailView.vue'
import { useMiscStore } from '../../stores/misc';
import { useRoute } from 'nuxt/app';
const route = useRoute()
const misc = useMiscStore()
useHead({
  title: 'Pesanan #' + route.params.id + ' | ' + misc.config.site_name,
})

definePageMeta({
  requireAuth: true
})
</script>
<template>
  <OrderDetailView />
</template>