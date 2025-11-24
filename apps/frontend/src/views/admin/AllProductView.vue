<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, img, Rp } from '../../utils/fns';
import ProductForm from '../../components/modal/ProductForm.vue';
import AdminProductForm from '~/components/modal/AdminProductForm.vue';
import PageBar from '~/components/partial/PageBar.vue';

const isFetching = ref(true)
const total = ref(0)
const form = ref({
  page: 1,
  is_active: 1,
  search: '',
})
const products = ref([])

const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/admin/products?page=${form.value.page}&is_active=${form.value.is_active}&search=${form.value.search}`).then(res => {
    products.value = res.data.products
    total.value = res.data.total
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


const checked = ref([])
const action = ref('')
const actionBtn = () => {
  isSending.value = true
  apiReq('post', `/admin/products/actions`, {
    action: action.value,
    ids: checked.value
  })
    .then(() => {
      action.value = ''
      checked.value = []
      fetchData()
    }) 
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const navigate = (to) => {
  if (to == 'prev') {
    form.value.page--
  } else if (to == 'next') {
    form.value.page++
  } else {
    form.value.page = to
  }
  fetchData()
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
      <div class="table-responsive mb-3">
        <table class="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Aksi</th>
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
                <div class="d-flex">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="checked" :value="p.id" style="cursor: pointer;">
                  </div>
                  <button v-if="p.is_active" @click="editBtn(p)" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-pencil"></i>
                  </button>
                </div>
              </td>
              <td class="d-flex">
                <img :src="img(p.image_url)" alt="img" width="32">
                <p class="small mb-0 ms-2">
                  {{ p.name }}
                  <a :href="`/p/${p.sku}`" target="_blank" rel="noopener noreferrer">&nearr;</a>
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
      <div v-if="checked.length > 0" class="input-group input-group-sm">
        <select v-model="action" class="form-control border-danger">
          <option value="">Pilih Aksi:</option>
          <option v-if="form.is_active == '1'" value="delete">Hapus</option>
          <option v-else value="undelete">Batal hapus</option>
          <option value="private">Tampilkan privat</option>
          <option value="public">Tampilkan publik</option>
          <option value="pending_review">Tampilkan pending</option>
        </select>
        <button class="btn btn-outline-danger" @click="actionBtn" :disabled="isSending || action == ''">Submit</button>
      </div>
      <PageBar :page="form.page" :total-data="total" @navigate="navigate" />
    </template>
    <button id="AdminProductForm-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#AdminProductForm"></button>
    <AdminProductForm :data="productEditing" @updated="fetchData" />
  </div>
</template>