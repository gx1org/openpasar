<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter} from 'vue-router'
import { apiReq, handleErrorApi, formatDate } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ProductView from '../components/modal/ProductView.vue';
import ProductItem from '../components/partial/ProductItem.vue';

const router = useRouter()
const route = useRoute()
const store = ref({})
const fetchStore = () => {
  apiReq('get', `/stores/${route.params.id}`)
  .then(res => {
    store.value = res.data.store
    fetchData()
  })
  .catch(handleErrorApi)
}

const products = ref([])
const isFetching = ref(true)
const fetchData = () => {
  isFetching.value = true
  const qs = new URLSearchParams(location.search)
  const q = qs.get('q') || ''
  const page = qs.get('page') || 1
  const sort = qs.get('sort') || 'latest'
  const show = qs.get('show')

  apiReq('get', `/catalogues?q=${q}&page=${page}&sort=${sort}&store=${route.params.id}`)
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
  document.getElementById('ProductView-btn').click()
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
  fetchStore()
  const myModalEl = document.getElementById('ProductView')
  if (myModalEl) {
    myModalEl.addEventListener('hidden.bs.modal', () => {
      removeShowQuery()
    })
  }
})
onUnmounted(() => {
  const myModalEl = document.getElementById('ProductView')
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
      <h5 class="mb-4">{{ store.name }}</h5>
      <div class="ms-auto">
        <button class="btn btn-sm btn-outline-success">
          <i class="bi bi-whatsapp"></i>
          Chat Penjual
        </button>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="bg-white p-2 border rounded mb-3">
        <div class="d-flex mb-3">
          <div>Sejak {{ formatDate(store.created_at) }}</div>
          <div class="ms-auto">{{ store.sales_count }}&times; penjualan</div>
        </div>
        <div class="small" style="white-space: pre-line;">
          {{ store.description }}
        </div>
      </div>
      <div v-if="products.length == 0" class="text-center p-3 border bg-white rounded">
        Yahh, tidak ada produk :)
      </div>
      <div v-else class="row g-2">
        <div v-for="p,i in products" :key="i" class="col-6 col-sm-4">
          <ProductItem :data="p" @clicked="showProduct(p)" />
        </div>
      </div>
    </template>
    <button id="ProductView-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductView"></button>
    <ProductView :data="productShowing" />
  </div>
</template>