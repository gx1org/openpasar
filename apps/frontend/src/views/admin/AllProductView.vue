<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, img, Rp } from '../../utils/fns';
import ProductForm from '../../components/modal/ProductForm.vue';
import AdminProductForm from '~/components/modal/AdminProductForm.vue';

const isFetching = ref(true)
const form = ref({
  is_active: 1,
  search: '',
})
const products = ref([])

const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/admin/products?is_active=${form.value.is_active}&search=${form.value.search}`).then(res => {
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
  document.getElementById('AdminProductForm-btn').click()
}

const isSending = ref(false)

const deleteBtn = (p) => {
  isSending.value = true
  apiReq('post', `/admin/products/${p.id}/toggle`)
    .then(() => {
      fetchData()
    }) 
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const featuredBtn = (p) => {
  isSending.value = true
  apiReq('post', `/admin/products/${p.id}/featured`, { featured: 1 })
    .then(() => {
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
      <h5 class="mb-4">Semua Produk</h5>
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
      </div>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Aksi</th>
              <th>SKU</th>
              <th>Nama</th>
              <th>Tampil</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Penjual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p,i in products" :key="i">
              <td>
                <button :disabled="isSending" v-if="p.is_active" @click="editBtn(p)" class="btn btn-sm btn-primary">
                  <i class="bi bi-pencil"></i>
                </button>
                <button :disabled="isSending" v-if="p.is_active" @click="deleteBtn(p)" class="btn btn-sm btn-danger ms-1">
                  <i class="bi bi-trash"></i>
                </button>
                <button :disabled="isSending" v-else @click="deleteBtn(p)" class="btn btn-sm btn-success ms-1">
                  <i class="bi bi-box-arrow-up"></i>
                </button>
                <button :disabled="isSending" v-if="p.featured == 0" @click="featuredBtn(p)" class="btn btn-sm btn-warning ms-1">
                  <i class="bi bi-star"></i>
                </button>
              </td>
              <td class="small">
                {{ p.sku }}
                <a :href="`/p/${p.sku}`" target="_blank" rel="noopener noreferrer">&nearr;</a>
              </td>
              <td class="d-flex">
                <img :src="img(p.image_url)" alt="img" width="32">
                <p class="small mb-0 ms-2">
                  {{ p.name }}
                </p>
              </td>
              <td class="small">
                {{ p.visibility == 'private' ? 'Privat' : (p.visibility == 'public' ? 'Publik' : 'Pending') }}
              </td>
              <td class="small">
                {{ p.in_stock == 'one' ? 'Satu' : p.in_stock == 'many' ? 'Banyak' : 'Kosong' }}
              </td>
              <td class="small">
                {{ Rp(p.price) }}
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
    <button id="AdminProductForm-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#AdminProductForm"></button>
    <AdminProductForm :data="productEditing" @updated="fetchData" />
  </div>
</template>