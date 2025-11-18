<script setup>
import { onMounted, ref } from 'vue';
import { useMiscStore } from '../stores/misc';
import { apiReq, handleErrorApi } from '../utils/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ProductShow from '../components/modal/ProductShow.vue';
import ProductItem from '../components/partial/ProductItem.vue';

const misc = useMiscStore()

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
  document.getElementById('ProductShow-btn').click()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="">
    <div class="card mb-4">
      <div class="card-body text-center py-4">
        <h1>{{ misc.config.site_name }}</h1>
        <p class="mb-0">{{ misc.config.site_description }}</p>
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
          <ProductItem :data="p" @clicked="showProduct(p)" />
        </div>
      </div>
      <div v-if="products.length == 0" class="text-center p-3 border bg-white card">
        Tidak ada Produk Unggulan
      </div>
    </template>
    <button id="ProductShow-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductShow"></button>
    <ProductShow :data="productShowing" />
  </div>
</template>