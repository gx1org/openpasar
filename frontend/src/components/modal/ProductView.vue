<script setup>
import { Rp } from '../../helpers/fns';
import { useMiscStore } from '../../stores/misc';

const misc = useMiscStore()
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
          <p class="d-flex">
            <span class="fw-bold text-primary">{{ Rp(data.price) }}</span>
            <span class="text-danger small fw-bold ms-auto" v-if="data.in_stock == 'empty'">Habis</span>
          </p>
          <div style="white-space: pre-line;" class="mb-4">{{ data.description }}</div>
          <div v-if="misc.config.site_mode == 'official_store'" class="bg-light border p-2 card small">
            <div class="d-flex">
              <p class="mb-0">Butuh Bantuan?</p>            
              <div class="ms-auto">
                <a class="text-success small text-decoration-none" :href="'https://wa.me/'+misc.config.admin_phone" target="_blank">
                  <i class="bi bi-whatsapp"></i>
                  <span class="ms-0">
                    Chat Admin
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div v-else class="border p-2 small text-muted mb-0 d-flex bg-light">
            <span>
              <RouterLink :to="'/stores/'+data.store_id">{{ data.store_name }}</RouterLink>
              <br>
              {{ data.store_sales_count }}&times; penjualan
            </span>
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
