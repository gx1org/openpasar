<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../utils/fns';
import { useAuthStore } from '../stores/auth';
import WithdrawForm from '~/components/modal/WithdrawForm.vue';
import StatusLabel from '~/components/partial/StatusLabel.vue';
import PageBar from '~/components/partial/PageBar.vue';

const auth = useAuthStore()
const isFetching = ref(true)
const withdrawals = ref([])
const total = ref(0)
const form = ref({
  page: 1,
})

const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/user/withdrawals?page=${form.value.page}`).then(res => {
    auth.user = res.data.user
    withdrawals.value = res.data.withdrawals
    total.value = res.data.total
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
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
        <button class="btn btn-primary btn-sm text-nowrap" data-bs-toggle="modal" data-bs-target="#WithdrawForm">Tarik Saldo</button>
      </div>
      <div v-if="withdrawals.length == 0" class="text-center p-3 card">
        Belum ada penarikan :)
      </div>
      <div v-for="d,i in withdrawals" :key="i" class="mb-3 p-2 card">
        <div class="d-flex">
          <p class="mb-1">{{ formatDateTime(d.created_at) }}</p>
          <p class="ms-auto fw-bold mb-1">
            {{ Rp(d.amount) }}
          </p>
        </div>
        <div class="d-flex small">
          <p class="me-auto mb-0">
            {{ d.receiver }}
          </p>
          <StatusLabel :status="d.status" />
        </div>
      </div>
      <PageBar :page="form.page" :total-data="total" @navigate="navigate" />
    </template>
    <WithdrawForm :last-wd="withdrawals[0]" @updated="fetchData" :key="withdrawals[0]" />
  </div>
</template>