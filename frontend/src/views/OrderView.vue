<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../helpers/fns';

const isFetching = ref(true)
const orders = ref([])

const fetchData = () => {
  isFetching.value = true
  apiReq('get', '/user/transactions').then(res => {
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
      <div v-if="orders.length == 0" class="text-center p-3 border bg-white rounded">
        Yahh, belum ada pesanan :)
      </div>
      <div v-for="d,i in orders" :key="i" class="mb-3 border bg-white rounded">
        <RouterLink :to="`/orders/${d.id}`" class="text-decoration-none text-reset">
          <div class="p-3">
            <div class="d-flex gap-2">
              <div class="flex-fill">
                <div class="d-flex align-items-center">
                  <div class="flex-fill">
                    <div class="fw-bold">
                      #{{ d.id }}
                    </div>
                    <div class="text-muted small">
                      {{ formatDate(d.created_at) }}
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold">
                      {{ Rp(d.total_amount) }}
                    </div>
                    <div class="text-muted small">
                      {{ d.status }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="small">
              {{ d.description }}
            </div>
          </div>
        </RouterLink>
      </div>
    </template>
  </div>
</template>