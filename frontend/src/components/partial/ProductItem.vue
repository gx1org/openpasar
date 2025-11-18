<script setup>
import { img, Rp } from '../../utils/fns';

const props = defineProps({
  data: Object
})
const emits = defineEmits(['clicked'])
</script>
<template>
  <a :href="'/p/' + data.sku" @click="emits('clicked')" class="text-decoration-none">
    <div class="card h-100">
      <img :src="img(data.image_url)" class="card-img-top square" alt="image">
      <div class="card-body p-2 border-top">
        <p class="card-title mb-1 small">{{ data.name }}</p>
        <div class="d-flex">
          <p class="card-text text-primary small fw-bold mb-0">
            {{ Rp(data.price) }}
          </p>
          <span class="text-danger small ms-auto" v-if="data.in_stock == 'empty'">Habis</span>
        </div>
      </div>
    </div>
  </a>
</template>