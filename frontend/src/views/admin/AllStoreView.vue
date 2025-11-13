<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../../helpers/fns';

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
        <select class="form-control form-control-sm" v-model="form.status" @change="fetchData">
          <option value="">Semua status</option>
          <option value="in_process">in_process</option>
          <option value="sent">sent</option>
          <option value="completed">completed</option>
          <option value="rejected">rejected</option>
          <option value="complained">complained</option>
        </select>
        <button class="btn btn-primary ms-auto btn-sm text-nowrap" @click="addBtn">
          Buat Toko
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered">
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
                  <i class="bi bi-eye"></i>
                </button>
              </td>
              <td class="small">
                {{ p.name }}
              </td>
              <td class="small">
                {{ p.email }}
              </td>
              <td class="small">
                {{ p.phone }}
              </td>
              <td>
                {{ formatDate(p.created_at) }}
              </td>
              <td class="">
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
  </div>
</template>