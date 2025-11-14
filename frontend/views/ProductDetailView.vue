<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { apiReq, handleErrorApi } from '../utils/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { useMiscStore } from '../stores/misc';
import LinkifiedText from '../components/partial/LinkifiedText.vue';

const misc = useMiscStore()
const route = useRoute()
const { data: product, pending: isFetching, error } = await useAsyncData('product', async () => {
  try {
    const res = await apiReq('get', `/catalogues/${route.params.sku}`)
    return res.data.product
  } catch (err) {
    handleErrorApi(err)
    return {}
  }
})
const images = ref(product.value.image_url?.split(','))
useHead({
  title: product.value.name + ' | ' + misc.config.site_name,
})

</script>

<template>
  <div>
    <SpinnerBox v-if="isFetching" />
    <div v-else class="modal-content">
        <div class="modal-header mb-4">
          <div id="carouselImg" class="carousel slide w-100">
            <div class="carousel-inner">
              <div v-for="i, k in images" class="carousel-item" :key="i" :class="{active: k == 0}">
                <img :src="img(i)" class="d-block w-100 square" alt="...">
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
        <div class="modal-body mb-4">
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
        <div class="modal-footer">
          <RouterLink :to="'/cart?add='+product.sku" class="btn btn-primary w-100">
            Beli Sekarang
          </RouterLink>
        </div>
      </div>
  </div>
</template>