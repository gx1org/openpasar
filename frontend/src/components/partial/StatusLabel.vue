<script setup>
import { computed } from 'vue'

const prop = defineProps({
    status: String
})
const colorMap = {
  'pending': 'danger',
  'in_process': 'warning',
  'sent': 'warning',
  'completed': 'success',
  'complained': 'danger',
  'canceled': 'muted',
  'rejected': 'dark',
}
const labelMap = {
  'pending': 'Menunggu Pembayaran',
  'in_process': 'Diprocess',
  'sent': 'Dikirim',
  'completed': 'Selesai',
  'complained': 'Dikomplain',
  'canceled': 'Dibatalkan',
  'rejected': 'Ditolak',
}
const statusColor = computed(() => {
  return colorMap[prop.status]
})
const statusLabel = computed(() => {
  return labelMap[prop.status]
})
</script>
<template>
  <span :class="'text-'+statusColor">
    {{ statusLabel }}
  </span>
</template>