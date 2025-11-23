<script setup>
import { onMounted, ref, watch } from 'vue';
import { img, Rp } from '../../utils/fns';
import { useMiscStore } from '../../stores/misc';
import LinkifiedText from '../partial/LinkifiedText.vue';

const misc = useMiscStore()
const prop = defineProps({
  data: Object,
})
const images = ref([])
const syncImage = () => {
  images.value = prop.data.image_url?.split(',')
  setTimeout(() => {
    const el = document.querySelector('.carousel-item')
    el?.classList.add('active')    
  }, 100);
}

watch(() => prop.data.image_url, syncImage)
onMounted(() => syncImage)
</script>
<template>
  <div class="modal fade" tabindex="-1" id="ProductShow">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div id="carouselImg" class="carousel slide w-100">
            <div class="carousel-inner">
              <div v-for="i in images" class="carousel-item">
                <a :href="img(i)" target="_blank">
                  <img :src="img(i)" class="d-block w-100 square" alt="...">
                </a>
              </div>
            </div>
            <button v-show="images.length > 1" class="carousel-control-prev" type="button" data-bs-target="#carouselImg" data-bs-slide="prev">
              <h1 class="text-muted text-shadow">
                <i class="bi bi-arrow-left-circle-fill"></i>
              </h1>
            </button>
            <button v-show="images.length > 1" class="carousel-control-next" type="button" data-bs-target="#carouselImg" data-bs-slide="next">
              <h1 class="text-muted text-shadow">
                <i class="bi bi-arrow-right-circle-fill"></i>
              </h1>
            </button>
          </div>
        </div>
        <button type="button" class="btn-close-product btn p-0" data-bs-dismiss="modal" aria-label="Close" style="z-index: 2;">
          <i class="bi bi-x-circle-fill text-muted h1"></i>
        </button>
        <div class="modal-body">
          <h5>{{ data.name }}</h5>
          <p class="d-flex">
            <span class="fw-bold text-primary">{{ Rp(data.price) }}</span>
            <span class="text-danger small fw-bold ms-auto" v-if="data.in_stock == 'empty'">Habis</span>
          </p>
          <div class="mb-4 small">
            <LinkifiedText :text="data.description" />
          </div>
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
