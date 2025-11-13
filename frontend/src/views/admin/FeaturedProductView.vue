<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../../helpers/fns';
import ProductForm from '../../components/modal/ProductForm.vue';

const isFetching = ref(true)
const form = ref({
  is_active: 1,
  search: '',
})
const products = ref([])

const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/admin/products?sort=featured&search=${form.value.search}`).then(res => {
    products.value = res.data.products
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const productEditing = ref({})
const editBtn = (p) => {
  productEditing.value = p
  document.getElementById('ProductForm-btn').click()
}

const handlePower = (p) => {
  apiReq('post', `/admin/products/${p.id}/featured`, { featured: p.featured })
  .then(() => {
    fetchData()
  }) 
  .catch(handleErrorApi)
}

const deleteBtn = (p) => {
  apiReq('post', `/admin/products/${p.id}/featured`, { featured: 0 })
    .then(() => {
      fetchData()
    }) 
    .catch(handleErrorApi)
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
      <div class="table-responsive">
        <table class="table table-bordered">
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
                <button @click="deleteBtn(p)" class="btn btn-sm btn-danger ms-1">
                  <i class="bi bi-x"></i>
                </button>
              </td>
              <td>
                <select class="form-control form-control-sm" @change="handlePower(p)" v-model="p.featured">
                  <option value="10">10</option>
                  <option value="9">9</option>
                  <option value="8">8</option>
                  <option value="7">7</option>
                  <option value="6">6</option>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>                
              </td>
              <td class="d-flex">
                <img :src="p.image_url" alt="img" width="32">
                <p class="small mb-0 ms-2">
                  {{ p.name }}
                </p>
              </td>
              <td class="small">
                {{ p.store.name }}
              </td>
            </tr>
            <tr v-if="products.length == 0">
              <td colspan="100%" class="text-center">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <button id="ProductForm-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductForm"></button>
    <ProductForm :data="productEditing" @updated="fetchData" :key="productEditing.id" />
  </div>
</template>