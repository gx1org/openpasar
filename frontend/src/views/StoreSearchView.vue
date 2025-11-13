<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter} from 'vue-router'
import { apiReq, formatDate, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';

const router = useRouter()
const route = useRoute()
const page = ref(1)

const stores = ref([])
const isFetching = ref(true)
const fetchData = () => {
  isFetching.value = true
  const qs = new URLSearchParams(location.search)
  const q = qs.get('q') || ''
  const sort = qs.get('sort') || 'latest'
  apiReq('get', `/stores?q=${q}&page=${page.value}&sort=${sort}`)
  .then(res => {
    stores.value = res.data.stores
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
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
  qs.set('q', searchInput.value)
  router.push(route.path+'?'+qs.toString())
}

watch(() => route.query, (newValue, oldValue) => {
  if (newValue.sort != oldValue.sort || newValue.q != oldValue.q) {
    fetchData()  
  }
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="">
    <div class="d-flex">
      <h5 class="mb-4 text-nowrap">Cari Toko</h5>
      <div class="ms-auto">
        <input type="search" class="form-control form-control-sm" placeholder="Cari..." v-model="searchInput" @change="handleSearch" style="width: 100px;">
      </div>
      <div class="ms-2">
        <div class="input-group input-group-sm">
          <div class="input-group-text">
            <i class="bi bi-sort-down"></i>
          </div>
          <select v-model="sorting" class="form-control form-control-sm" @change="handleSort">
            <option value="latest">Terbaru</option>
            <option value="sales">Terlaris</option>
          </select>
        </div>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div v-if="stores.length == 0" class="text-center p-3 border bg-white rounded">
        Yahh, tidak ada produk yang sesuai :)
      </div>
      <div v-else class="row g-2">
        <RouterLink :to="`/stores/${p.id}`" v-for="p,i in stores" :key="i" class="col-sm-6 text-reset text-decoration-none">
          <div class="card">
            <div class="card-body">
              <p class="mb-1 fw-bold">{{ p.name }}</p>
              <p class="mb-0 small">Sejak {{ formatDate(p.created_at) }}</p>
              <p class="mb-0 small">{{ p.sales_count }}&times; penjualan</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </template>
  </div>
</template>