<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter} from 'vue-router'
import { apiReq, handleErrorApi } from '../utils/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ProductShow from '../components/modal/ProductShow.vue';
import ProductItem from '../components/partial/ProductItem.vue';

const router = useRouter()
const route = useRoute()
const page = ref(1)

const products = ref([])
const isFetching = ref(true)
const fetchData = () => {
  isFetching.value = true
  const qs = new URLSearchParams(location.search)
  const q = qs.get('q') || ''
  const sort = qs.get('sort') || 'latest'
  const show = qs.get('show')

  apiReq('get', `/catalogues?search=${q}&page=${page.value}&sort=${sort}`)
  .then(res => {
    products.value = res.data.products
    if (show) {
      const p = res.data.products.find(p => p.sku == show)
      if (!p) {
        getShowingProduct(show)
      } else {
        showProduct(p)
      }
    }
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const getShowingProduct = (sku) => {
  isFetching.value = true
  apiReq('get', `/catalogues/${sku}`)
  .then(res => {
    if (res.data.product.sku) {
      showProduct(res.data.product)    
    }
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
  const qs = new URLSearchParams(location.search)
  qs.set('show', p.sku)
  router.push(route.path+'?'+qs.toString())
  document.getElementById('ProductShow-btn').click()
}

const sorting = ref('latest')
const handleSort = () => {
  const qs = new URLSearchParams(location.search)
  qs.set('sort', sorting.value)
  router.push(route.path+'?'+qs.toString())
}

watch(() => route.query, (newValue, oldValue) => {
  if (newValue.sort != oldValue.sort || newValue.q != oldValue.q || newValue.page != oldValue.page) {
    fetchData()  
  }
})

const removeShowQuery = () => {
  const qs = new URLSearchParams(location.search)
  qs.delete('show')
  router.push(route.path+'?'+qs.toString())
}

onMounted(() => {
  fetchData()
  const myModalEl = document.getElementById('ProductShow')
  if (myModalEl) {
    myModalEl.addEventListener('hidden.bs.modal', () => {
      removeShowQuery()
    })
  }
})
onUnmounted(() => {
  const myModalEl = document.getElementById('ProductShow')
  if (myModalEl) {
    myModalEl.removeEventListener('hidden.bs.modal', () => {
      removeShowQuery()
    })
  }
})
</script>

<template>
  <div class="">
    <div class="d-flex">
      <h5 class="mb-4">Pencarian</h5>
      <div class="ms-auto">
        <div class="input-group input-group-sm">
          <div class="input-group-text">
            <i class="bi bi-filter"></i>
          </div>
          <select v-model="sorting" class="form-control form-control-sm" @change="handleSort">
            <option value="latest">Terbaru</option>
            <option value="lowest">Termurah</option>
            <option value="highest">Termahal</option>
            <option value="sell">Terlaris</option>
          </select>
        </div>
      </div>
      <div class="ms-2">
        <RouterLink to="/stores" class="btn btn-outline-primary btn-sm">
          Cari Toko &nearr;
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div v-if="products.length == 0" class="text-center p-3 card">
        Yahh, tidak ada produk yang sesuai :)
      </div>
      <div v-else class="row g-2">
        <div v-for="p,i in products" :key="i" class="col-6 col-sm-4">
          <ProductItem :data="p" @clicked="showProduct(p)" />
        </div>
      </div>
    </template>
    <button id="ProductShow-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductShow"></button>
    <ProductShow :data="productShowing" />
  </div>
</template>