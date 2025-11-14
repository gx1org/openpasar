<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../utils/fns';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore()
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
      <div class="d-flex mb-4">
        <div class="input-group input-group-sm ms-auto me-2">
          <span class="input-group-text bg-white">Saldo</span>
          <span class="input-group-text bg-white">{{ Rp(auth.user.balance) }}</span>
        </div>
        <button class="btn btn-primary btn-sm text-nowrap">Tarik Saldo</button>
      </div>
      <div v-if="withdrawals.length == 0" class="text-center p-3 card">
        Belum ada penarikan :)
      </div>
      <div v-for="d,i in withdrawals" :key="i" class="mb-3 card">

      </div>
    </template>
  </div>
</template>