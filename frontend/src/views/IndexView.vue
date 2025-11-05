<script setup>
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useMiscStore } from '../stores/misc';
import { useRouter } from 'vue-router';
import { apiReq, handleErrorApi, Rp } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ProductView from '../components/modal/ProductView.vue';

const products = ref([])
const isFetching = ref(true)
const fetchData = () => {
  isFetching.value = true
  apiReq('get', '/catalogues?limit=6&sort=featured')
  .then(res => {
    products.value = res.data.products
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const productShowing = ref({})
const showProduct = (p) => {
  event.preventDefault()
  productShowing.value = p
  document.getElementById('ProductView-btn').click()
}

const misc = useMiscStore()

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="">
    <div class="card mb-4">
      <div class="card-body text-center py-4">
        <h1>{{ misc.config.site_name }}</h1>
        <p class="">{{ misc.config.site_description }}</p>
      </div>
    </div>
    <div class="d-flex">
      <h5 class="mb-4">Produk Unggulan</h5>
      <div class="ms-auto">
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="row g-2">
        <div v-for="p,i in products" :key="i" class="col-6 col-sm-4">
          <a :href="'/search/?show='+p.sku" @click="showProduct(p)" class="text-decoration-none">
            <div class="card h-100">
              <img :src="p.image_url" class="card-img-top" alt="image" style="aspect-ratio: 1/1;">
              <div class="card-body p-2 border-top">
                <p class="card-title mb-1 small">{{ p.name }}</p>
                <p class="card-text text-primary small fw-bold">
                  {{ Rp(p.price) }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </template>
    <button id="ProductView-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductView"></button>
    <ProductView :data="productShowing" />
  </div>
</template>