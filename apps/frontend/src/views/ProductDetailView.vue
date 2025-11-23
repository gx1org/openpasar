<script setup>
import { ref } from 'vue';
import { useMiscStore } from '../stores/misc';
import LinkifiedText from '../components/partial/LinkifiedText.vue';

const misc = useMiscStore()
const props = defineProps({
  product: Object
})
const images = ref(props.product.image_url?.split(','))
useHead({
  title: (props.product.name || 'Produk tidak ditemukan') + ' | ' + misc.config.site_name,
})
</script>

<template>
  <div>
    <div v-if="!product.sku" class="text-center card">
      <div class="card-header">Error!</div>
      <div class="card-body">
        <p class="mb-2">Produk Tidak Ditemukan</p>
        <RouterLink
          to="/search"
          class="btn btn-primary"
        >
          Cari Produk
        </RouterLink>
      </div>
    </div>
    <template v-else>
      <div class="">
          <div class="mb-3 border-bottom pb-3">
            <div id="carouselImg" class="carousel slide w-100">
              <div class="carousel-inner">
                <div v-for="i, k in images" class="carousel-item" :key="i" :class="{active: k == 0}">
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
          <div class="mb-3 border-bottom pb-3">
            <h1 class="h2">{{ product.name }}</h1>
            <p class="d-flex">
              <span class="fw-bold text-primary">{{ Rp(product.price) }}</span>
              <span class="text-danger small fw-bold ms-auto" v-if="product.in_stock == 'empty'">Habis</span>
            </p>
            <div class="mb-4">
              <LinkifiedText :text="product.description" />
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
                <RouterLink :to="'/stores/'+product.store_id">{{ product.store_name }}</RouterLink>
                <br>
                {{ product.store_sales_count }}&times; penjualan
              </span>
              <a :href="'https://wa.me/'+product.store_phone" target="_blank" rel="noopener noreferrer" class="text-success ms-auto text-decoration-none">
                <i class="bi bi-whatsapp"></i>
                Chat
              </a>
            </div>
          </div>
          <div class="">
            <RouterLink :to="'/cart?add='+product.sku" class="btn btn-primary w-100">
              Beli Sekarang
            </RouterLink>
          </div>
      </div>
    </template>
  </div>
</template>
