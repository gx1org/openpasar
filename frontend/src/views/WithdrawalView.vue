<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../helpers/fns';

const isFetching = ref(true)
const withdrawals = ref([])

const fetchData = () => {
  isFetching.value = true
  apiReq('get', '/user/withdrawals').then(res => {
    withdrawals.value = res.data.withdrawals
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
      <h5 class="mb-4">Penarikan Saldo</h5>
      <div class="ms-auto">
        <RouterLink to="/account" class="small">
          &larr; Akun
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div v-if="withdrawals.length == 0" class="text-center p-3 border bg-white rounded">
        Belum ada penarikan :)
      </div>
      <div v-for="d,i in withdrawals" :key="i" class="mb-3 border bg-white rounded">
        <RouterLink :to="`/withdrawals/${d.id}`" class="text-decoration-none text-reset">
          <div class="p-3">
            <div class="d-flex gap-2">
              <div class="flex-fill">
                <div class="d-flex align-items-center">
                  <div class="flex-fill">
                    <div class="fw-bold mb-2">
                      #{{ d.id }}
                    </div>
                    <div class="text-muted small">
                      {{ formatDate(d.created_at) }}
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="mb-2">
                      {{ d.status }}
                    </div>
                    <div class="text-muted small">
                      {{ Rp(d.amount) }}
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