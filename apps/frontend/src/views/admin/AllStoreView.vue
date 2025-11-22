<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../../utils/fns';
import AdminEditStore from '~/components/modal/AdminEditStore.vue';

const isFetching = ref(true)
const stores = ref([])
const form = ref({
  status: '',
  search: '',
})

const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/admin/stores?status=${form.value.status}&search=${form.value.search}`).then(res => {
    stores.value = res.data.stores
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const storeEditing = ref({})
const editBtn = (s = {}) => {
  storeEditing.value = s
  document.getElementById('AdminEditStore-btn').click()
}

onMounted(() => {
  fetchData()
})
</script>
<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Semua Toko</h5>
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
        <button class="btn btn-primary ms-auto btn-sm text-nowrap" @click="editBtn()">
          Buat Toko
        </button>
      </div>
      <div class="table-responsive mb-3">
        <table class="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Aksi</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Whatsapp</th>
              <th>Sejak</th>
              <th>Penjualan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p,i in stores" :key="i">
              <td>
                <button @click="editBtn(p)" class="btn btn-sm btn-primary">
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
              <td class="small">
                {{ p.name }}
                <a :href="`/stores/${p.id}`" target="_blank" rel="noopener noreferrer">&nearr;</a>
              </td>
              <td class="small">
                {{ p.email }}
              </td>
              <td class="small">
                {{ p.phone }}
              </td>
              <td class="small">
                {{ formatDate(p.created_at) }}
              </td>
              <td class="small">
                {{ p.sales_count }}
              </td>
            </tr>
            <tr v-if="stores.length == 0">
              <td colspan="100%" class="text-center">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <button class="d-none" id="AdminEditStore-btn" data-bs-toggle="modal" data-bs-target="#AdminEditStore"></button>
    <AdminEditStore @updated="fetchData" :data="storeEditing" />
  </div>
</template>