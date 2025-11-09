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
          <div class="border p-2 small text-muted mb-0 d-flex bg-light">
            <span>Penjual: {{ data.store_name }}</span>
            <a :href="'https://wa.me/'+data.store_phone" target="_blank" rel="noopener noreferrer" class="text-success ms-auto text-decoration-none">
              <i class="bi bi-whatsapp"></i>
              Chat
            </a>
          </div>
        </div>
        <div class="modal-footer">
          <RouterLink :to="'/cart?add='+data.sku" class="btn btn-primary w-100">
            Beli Sekarang
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
