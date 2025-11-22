<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../../utils/fns';
import { useAuthStore } from '../../stores/auth';
import WithdrawForm from '../../components/modal/WithdrawForm.vue';
import StatusLabel from '../../components/partial/StatusLabel.vue';

const auth = useAuthStore()
const isFetching = ref(true)
const withdrawals = ref([])

const fetchData = () => {
  isFetching.value = true
  apiReq('get', '/admin/withdrawals').then(res => {
    withdrawals.value = res.data.withdrawals
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const isSending = ref(false)
const actionBtn = (wd, status) => {
  if (!confirm('Anda yakin?')) return
  isSending.value = true
  apiReq('patch', `/admin/withdrawals/${wd.id}/status`, { status })
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
      <h5 class="mb-4">Penarikan Saldo</h5>
      <div class="ms-auto">
        <RouterLink to="/account" class="small">
          &larr; Akun
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="table-responsive mb-3">
        <table class="table table-bordered mb-0">
          <thead>
            <tr>
              <th>Aksi</th>
              <th>Tanggal</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Tujuan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p,i in withdrawals" :key="i">
              <td v-if="p.status == 'in_process'">
                <button @click="actionBtn(p, 'completed')" :disabled="isSending" class="btn btn-sm btn-primary me-1">
                  <i class="bi bi-check"></i>
                </button>
                <button @click="actionBtn(p, 'rejected')" :disabled="isSending" class="btn btn-sm btn-danger">
                  <i class="bi bi-x"></i>
                </button>
              </td>
              <td v-else>
                -
              </td>
              <td class="small">
                {{ formatDate(p.created_at) }}
              </td>
              <td class="small">
                {{ Rp(p.amount) }}
              </td>
              <td class="small">
                <StatusLabel :status="p.status" />
              </td>
              <td class="small">
                {{ p.receiver }}
              </td>
            </tr>
            <tr v-if="withdrawals.length == 0">
              <td colspan="100%" class="text-center">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <WithdrawForm :last-wd="withdrawals[0]" @updated="fetchData" />
  </div>
</template>