<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter} from 'vue-router'
import { apiReq, formatDate, handleErrorApi } from '../utils/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import LoadMore from '~/components/partial/LoadMore.vue';

const router = useRouter()
const route = useRoute()
const page = ref(1)
const total = ref(0)

const stores = ref([])
const isFetching = ref(true)
const fetchData = () => {
  isFetching.value = true
  const qs = new URLSearchParams(location.search)
  const sq = qs.get('sq') || ''
  const sort = qs.get('sort') || 'latest'
  apiReq('get', `/stores?search=${sq}&page=${page.value}&sort=${sort}`)
  .then(res => {
    if (page.value > 1) {
      stores.value = [...stores.value, ...res.data.stores]
    } else {
      stores.value = res.data.stores
    }
    total.value = res.data.total
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
  qs.set('sq', searchInput.value)
  router.push(route.path+'?'+qs.toString())
}

const handleLoadMore = () => {
  page.value++
  fetchData()
}

watch(() => route.query, (newValue, oldValue) => {
  if (newValue.sort != oldValue.sort || newValue.sq != oldValue.sq) {
    page.value = 1
    isFetching.value = true
    stores.value = []
    fetchData()  
  }
})

onMounted(() => {
  fetchData()
  if (route.query.sq) {
    searchInput.value = route.query.sq
  }
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
    <div class="row g-2">
      <div v-for="p,i in stores" :key="i" class="col-sm-6">
        <RouterLink :to="`/stores/${p.id}`" class=" text-reset text-decoration-none">
          <div class="card">
            <div class="card-body p-2">
              <p class="mb-1 fw-bold">{{ p.name }}</p>
              <div class="d-flex">
                <p class="mb-0 small">Sejak {{ formatDate(p.created_at) }}</p>
                <p class="mb-0 small ms-auto">{{ p.sales_count }}&times; penjualan</p>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <LoadMore v-else :items="stores?.length" :total="total" @click="handleLoadMore" />
    <div v-if="!isFetching && stores.length == 0" class="text-center p-3 card mt-2">
      Yahh, tidak ada toko yang sesuai :)
    </div>
  </div>
</template>