<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../utils/fns';
import StatusLabel from '../components/partial/StatusLabel.vue';

const isFetching = ref(true)
const orders = ref([])
const form = ref({
  status: '',
  search: '',
})
const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/user/transactions?status=${form.value.status}&search=${form.value.search}`).then(res => {
    orders.value = res.data.transactions
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
      <h5 class="mb-4">Pesanan Saya</h5>
      <div class="ms-auto">
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="d-flex mb-4 gap-2">
        <input type="search" class="form-control form-control-sm" placeholder="Cari..." v-model="form.search" @change="fetchData">
        <select class="form-control form-control-sm" v-model="form.status" @change="fetchData">
          <option value="">Semua status</option>
          <option value="pending">pending</option>
          <option value="in_process">in_process</option>
          <option value="sent">sent</option>
          <option value="completed">completed</option>
          <option value="rejected">rejected</option>
          <option value="complained">complained</option>
        </select>
      </div>
      <div v-if="orders.length == 0" class="text-center p-3 card">
        Yahh, belum ada pesanan :)
      </div>
      <div v-for="d,i in orders" :key="i" class="mb-3 card">
        <RouterLink :to="`/orders/${d.id}`" class="text-decoration-none text-reset">
          <div class="p-3">
            <div class="d-flex gap-2">
              <div class="flex-fill">
                <div class="d-flex align-items-center">
                  <div class="flex-fill">
                    <div class="fw-bold mb-1">
                      #{{ d.id }}
                    </div>
                    <div class="text-muted small">
                      {{ formatDate(d.created_at) }}
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="mb-1">
                      <StatusLabel :status="d.status" />
                    </div>
                    <div class="text-muted small">
                      {{ Rp(d.total_amount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="small mt-1">
              {{ d.description }}
            </div>
          </div>
        </RouterLink>
      </div>
    </template>
  </div>
</template>