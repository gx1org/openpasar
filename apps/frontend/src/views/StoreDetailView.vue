<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter} from 'vue-router'
import { apiReq, handleErrorApi, formatDate } from '../utils/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ProductShow from '../components/modal/ProductShow.vue';
import ProductItem from '../components/partial/ProductItem.vue';
import LinkifiedText from '../components/partial/LinkifiedText.vue';
import LoadMore from '~/components/partial/LoadMore.vue';

const router = useRouter()
const route = useRoute()
const misc = useMiscStore()
const props = defineProps({
  store: Object
})

useHead({
  title: (props.store.name || 'Toko tidak ditemukan') + ' | ' + misc.config.site_name,
})

const isFetching = ref(true)
const products = ref([])
const total = ref(0)
const page = ref(1)

const fetchData = () => {
  isFetching.value = true
  const qs = new URLSearchParams(location.search)
  const spq = qs.get('spq') || ''
  const sort = qs.get('sort') || 'latest'
  const show = qs.get('show')

  apiReq('get', `/catalogues?search=${spq}&page=${page.value}&sort=${sort}&store=${route.params.id}`)
  .then(res => {
    if (page.value > 1) {
      products.value = [...products.value, ...res.data.products]
    } else {
      products.value = res.data.products
    }
    total.value = res.data.total
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
const searchInput = ref('')
const handleSort = () => {
  const qs = new URLSearchParams(location.search)
  qs.set('sort', sorting.value)
  router.push(route.path+'?'+qs.toString())
}
const handleSearch = () => {
  const qs = new URLSearchParams(location.search)
  qs.set('spq', searchInput.value)
  router.push(route.path+'?'+qs.toString())
}

const handleLoadMore = () => {
  page.value++
  fetchData()
}

watch(() => route.query, (newValue, oldValue) => {
  if (newValue.sort != oldValue.sort || newValue.spq != oldValue.spq) {
    page.value = 1
    isFetching.value = true
    products.value = []
    fetchData()
  }
})

const removeShowQuery = () => {
  const qs = new URLSearchParams(location.search)
  qs.delete('show')
  router.push(route.path+'?'+qs.toString())
}

onMounted(() => {
  if (!props.store.id) {
    return
  }
  fetchData()
  if (route.query.spq) {
    searchInput.value = route.query.spq
  }
  const myModalEl = document.getElementById('ProductShow')
  if (myModalEl) {
    myModalEl.addEventListener('hidden.bs.modal', () => {
      removeShowQuery()
    })
  }
})
onUnmounted(() => {
  if (!props.store.id) {
    return
  }
  const myModalEl = document.getElementById('ProductShow')
  if (myModalEl) {
    myModalEl.removeEventListener('hidden.bs.modal', () => {
      removeShowQuery()
    })
  }
})
</script>

<template>
  <div>
    <div v-if="!store.id" class="text-center card">
      <div class="card-header">Error!</div>
      <div class="card-body">
        <p class="mb-2">Toko Tidak Ditemukan</p>
        <RouterLink
          to="/stores"
          class="btn btn-primary"
        >
          Cari Toko
        </RouterLink>
      </div>
    </div>
    <template v-else>
      <div class="d-flex">
        <h5 class="mb-4">{{ store.name }}</h5>
        <div class="ms-auto">
          <a :href="`https://wa.me/${store.phone}`" target="_blank" class="btn btn-sm btn-outline-success">
            <i class="bi bi-whatsapp"></i>
            Chat Penjual
          </a>
        </div>
      </div>
      <div class="p-2 card mb-3">
        <div class="d-flex mb-3">
          <div>Sejak {{ formatDate(store.created_at) }}</div>
          <div class="ms-auto">{{ store.sales_count }}&times; penjualan</div>
        </div>
        <div class="small">
          <LinkifiedText :text="store.description" />
        </div>
      </div>
      <div class="d-flex">
        <h5 class="mb-4">Produk</h5>
        <div class="ms-auto">
          <input type="search" class="form-control form-control-sm" placeholder="Cari..." v-model="searchInput" @change="handleSearch" style="width: 100px;">
        </div>
        <div class="ms-2">
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
      </div>
      <div class="row g-2">
        <div v-for="p,i in products" :key="i" class="col-6 col-sm-4">
          <ProductItem :data="p" @clicked="showProduct(p)" />
        </div>
      </div>
      <SpinnerBox v-if="isFetching" />
      <LoadMore v-else :items="products.length" :total="total" @click="handleLoadMore" />
      <div v-if="!isFetching && products.length == 0" class="text-center p-3 card mt-2">
        Yahh, tidak ada produk yang sesuai :)
      </div>
      <button id="ProductShow-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductShow"></button>
      <ProductShow :data="productShowing" />
    </template>
  </div>
</template>