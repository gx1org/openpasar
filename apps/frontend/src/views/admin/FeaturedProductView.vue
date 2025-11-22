<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, handleErrorApi, img } from '../../utils/fns';

const isFetching = ref(true)
const form = ref({
  is_active: 1,
  search: '',
})
const products = ref([])

const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/admin/products?sort=featured&featured=1&search=${form.value.search}`).then(res => {
    products.value = res.data.products
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const isSending = ref(false)
const handlePower = (p) => {
  isSending.value = true
  apiReq('post', `/admin/products/${p.id}/featured`, { featured: Number(p.featured) })
  .then(() => {
    fetchData()
  }) 
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}

const deleteBtn = (p) => {
  isSending.value = true
  apiReq('post', `/admin/products/${p.id}/featured`, { featured: 0 })
    .then(() => {
      fetchData()
    }) 
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const searchResults = ref([])
const searchInput = ref('')
const isSearching = ref(false)
const searchBtn = () => {
  if (searchInput.value == '') {
    searchResults.value = []
    return
  }
  isSearching.value = true
  apiReq('get', `/admin/products?sort=name&featured=0&is_active=1&search=${searchInput.value}`).then(res => {
    searchResults.value = res.data.products
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSearching.value = false
  })
}

const addFeatured = (p) => {
  isSending.value = true
  apiReq('post', `/admin/products/${p.id}/featured`, { featured: 1 })
  .then(() => {
    searchInput.value = ''
    searchResults.value = []
    fetchData()
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}

onMounted(() => {
  fetchData()
})
</script>
<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Produk Unggulan</h5>
      <div class="ms-auto">
        <RouterLink to="/account" class="small">
          &larr; Akun
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="mb-2">
        <input :disabled="isSearching" type="search" class="form-control form-control-sm mb-1" placeholder="Cari produk untuk diunggulkan" v-model="searchInput" @change="searchBtn">
        <ul class="list-group">
          <a v-for="s,i in searchResults" :key="i" class="list-group-item small d-flex" href="javascript:;" @click="addFeatured(s)">
            <span>
             {{ s.name }} ({{ s.store.name }})
            </span>
            <span class="ms-auto">
              <i class="bi bi-chevron-right"></i>
            </span>
          </a>
        </ul>
      </div>
      <div class="table-responsive mb-3">
        <table class="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Aksi</th>
              <th>Power</th>
              <th>Nama</th>
              <th>Penjual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p,i in products" :key="i">
              <td>
                <button :disabled="isSending" @click="deleteBtn(p)" class="btn btn-sm btn-danger ms-1">
                  <i class="bi bi-x"></i>
                </button>
              </td>
              <td>
                <select :disabled="isSending" class="form-control form-control-sm" @change="handlePower(p)" v-model="p.featured">
                  <option :value="10">10</option>
                  <option :value="9">9</option>
                  <option :value="8">8</option>
                  <option :value="7">7</option>
                  <option :value="6">6</option>
                  <option :value="5">5</option>
                  <option :value="4">4</option>
                  <option :value="3">3</option>
                  <option :value="2">2</option>
                  <option :value="1">1</option>
                </select>                
              </td>
              <td class="d-flex">
                <img :src="img(p.image_url)" alt="img" width="32">
                <p class="small mb-0 ms-2">
                  {{ p.name }}
                  <a :href="`/p/${p.sku}`" target="_blank" rel="noopener noreferrer">&nearr;</a>
                </p>
              </td>
              <td class="small">
                {{ p.store.name }}
                <a :href="`/stores/${p.store.id}`" target="_blank" rel="noopener noreferrer">&nearr;</a>
              </td>
            </tr>
            <tr v-if="products.length == 0">
              <td colspan="100%" class="text-center">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>