<script setup>
import { Rp } from '../../helpers/fns';

const props = defineProps({
  data: Object
})
const emits = defineEmits(['clicked'])
</script>
<template>
  <a :href="'/search/?show=' + data.sku" @click="emits('clicked')" class="text-decoration-none">
    <div class="card h-100">
      <img :src="data.image_url" class="card-img-top" alt="image" style="aspect-ratio: 1/1;">
      <div class="card-body p-2 border-top">
        <p class="card-title mb-1 small">{{ data.name }}</p>
        <p class="card-text text-primary small fw-bold">
          {{ Rp(data.price) }}
        </p>
      </div>
    </div>
  </a>
</template>