<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../../utils/fns';
import StatusLabel from '../../components/partial/StatusLabel.vue';

const isFetching = ref(true)
const transactions = ref([])
const form = ref({
  status: '',
  search: '',
})
const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/user/stores/transactions?status=${form.value.status}&search=${form.value.search}`).then(res => {
    transactions.value = res.data.transactions
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
      <h5 class="mb-4">Penjualan Saya</h5>
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
      </div>
      
      <div class="table-responsive mb-3">
        <table class="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Aksi</th>
              <th>ID</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Jumlah</th>
              <th>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p,i in transactions" :key="i">
              <td>
                <RouterLink :to="`/sales/${p.id}`" class="btn btn-sm btn-primary">
                  <i class="bi bi-eye"></i>
                </RouterLink>
              </td>
              <td class="small">
                #{{ p.id }}
              </td>
              <td class="small">
                {{ formatDate(p.created_at) }}
              </td>
              <td class="small">
                <StatusLabel :status="p.status" />
              </td>
              <td class="small">
                {{ Rp(p.total_amount) }}
              </td>
              <td class="small">
                {{ p.description }}
              </td>
            </tr>
            <tr v-if="transactions.length == 0">
              <td colspan="100%" class="text-center">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>