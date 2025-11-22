<script setup>
const props = defineProps({
  items: { type: Number },
  total: { type: Number },
})
const emits = defineEmits(['click'])
</script>
<template>
  <div v-if="props.items < props.total" class="text-center mt-4">
    <button class="btn btn-primary btn-sm" @click="emits('click')">Tampilkan lebih banyak</button>
  </div>
  <div v-else-if="props.items > 0" class="text-center mt-4 small">
    Sudah menampilkan semua hasil
  </div>
</template>