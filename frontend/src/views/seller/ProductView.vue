<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, img, Rp } from '../../utils/fns';
import ProductForm from '../../components/modal/ProductForm.vue';

const isFetching = ref(true)
const form = ref({
  is_active: 1,
  search: '',
})
const products = ref([])

const fetchData = () => {
  productEditing.value = {}
  isFetching.value = true
  apiReq('get', `/user/stores/products?is_active=${form.value.is_active}&search=${form.value.search}`).then(res => {
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
  productEditing.value.key = Math.random()
  document.getElementById('ProductForm-btn').click()
}

const deleteBtn = (p) => {
  apiReq('post', `/user/stores/products/${p.id}/toggle`)
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
      <h5 class="mb-4">Produk Saya</h5>
      <div class="ms-auto">
        <RouterLink to="/account" class="small">
          &larr; Akun
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="d-flex mb-4 gap-2">
        <input type="search" class="form-control form-control-sm" placeholder="Cari..." v-model="form.search" @change="fetchData">
        <select class="form-control form-control-sm" v-model="form.is_active" @change="fetchData">
          <option value="1">Produk aktif</option>
          <option value="0">Produk dihapus</option>
        </select>
        <button @click="editBtn({})" class="btn btn-sm btn-primary text-nowrap">
          Produk Baru
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Aksi</th>
              <th>SKU</th>
              <th>Nama</th>
              <th>Stok</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p,i in products" :key="i">
              <td>
                <button @click="editBtn(p)" class="btn btn-sm btn-primary">
                  <i class="bi bi-pencil"></i>
                </button>
                <button v-if="p.is_active" @click="deleteBtn(p)" class="btn btn-sm btn-danger ms-1">
                  <i class="bi bi-eye-slash"></i>
                </button>
                <button v-else @click="deleteBtn(p)" class="btn btn-sm btn-success ms-1">
                  <i class="bi bi-eye"></i>
                </button>
              </td>
              <td class="small">
                {{ p.sku }}
              </td>
              <td class="d-flex">
                <img :src="img(p.image_url)" alt="img" width="32" class="square">
                <p class="small mb-0 ms-2">
                  {{ p.name }}
                </p>
              </td>
              <td>
                {{ p.in_stock == 'one' ? 'Satu' : p.in_stock == 'many' ? 'Banyak' : 'Kosong' }}
              </td>
              <td>
                {{ Rp(p.price) }}
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
    <ProductForm :data="productEditing" @updated="fetchData" />
  </div>
</template>