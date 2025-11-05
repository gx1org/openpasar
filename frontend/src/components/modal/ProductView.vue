<script setup>
import { Rp } from '../../helpers/fns';

const prop = defineProps({
  data: Object
})

</script>
<template>
  <div class="modal fade" tabindex="-1" id="ProductView">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <img :src="data.image_url" alt="image" class="w-100 rounded" style="aspect-ratio: 1/1;">
        </div>
        <button type="button" class="btn-close-product btn btn-light shadow border" data-bs-dismiss="modal" aria-label="Close">
          <span class="btn-close px-2"></span>
        </button>
        <div class="modal-body">
          <h5>{{ data.name }}</h5>
          <p>
            <span class="fw-bold text-primary">{{ Rp(data.price) }}</span>
          </p>
          <p style="white-space: pre-line;">{{ data.description }}</p>
          <p class="small text-muted mb-0">
            Penjual: {{ data.store_name }}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary w-100">
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
