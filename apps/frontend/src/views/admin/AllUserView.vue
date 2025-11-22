<script setup>
import { onMounted, ref } from 'vue';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { apiReq, formatDate, handleErrorApi, Rp } from '../../utils/fns';
import PageBar from '~/components/partial/PageBar.vue';

const isFetching = ref(true)
const users = ref([])
const total = ref(0)
const form = ref({
  page: 1,
  status: '',
  search: '',
})

const fetchData = () => {
  isFetching.value = true
  apiReq('get', `/admin/users?page=${form.value.page}&status=${form.value.status}&search=${form.value.search}`).then(res => {
    users.value = res.data.users
    total.value = res.data.total
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const isSending = ref(false)
const suspendBtn = (u) => {
  if (!u.is_suspended) {
    if (!confirm(`Anda yakin ingin menonaktifkan akun ${u.name}?`)) return
  }
  isSending.value = true
  apiReq('post', `/admin/users/${u.id}/suspend`).then(() => {
    fetchData()
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}

const pinBtn = (u) => {
  if (!confirm(`Reset PIN akun ${u.name}?`)) return
  isSending.value = true
  apiReq('patch', `/admin/users/${u.id}/pin`).then(() => {
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
      <h5 class="mb-4">Semua Pengguna</h5>
      <div class="ms-auto">
        <RouterLink to="/account" class="small">
          &larr; Akun
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="d-flex mb-4 gap-2">
        <input type="search" class="form-control form-control-sm" placeholder="Cari..." v-model="form.search" @change="fetchData" />
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
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p,i in users" :key="i">
              <td>
                <button :disabled="isSending" v-if="!p.is_suspended" @click="suspendBtn(p)" class="btn btn-sm btn-danger">
                  <i class="bi bi-ban"></i>
                </button>
                <button :disabled="isSending" v-else @click="suspendBtn(p)" class="btn btn-sm btn-success">
                  <i class="bi bi-check-circle"></i>
                </button>
                <button :disabled="isSending" @click="pinBtn(p)" class="btn btn-sm btn-warning ms-1">
                  <i class="bi bi-arrow-counterclockwise"></i>
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
              <td class="small">
                {{ formatDate(p.created_at) }}
              </td>
              <td class="small">
                {{ Rp(p.balance) }}
              </td>
            </tr>
            <tr v-if="users.length == 0">
              <td colspan="100%" class="text-center">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <PageBar :page="form.page" :total-data="total" @navigate="navigate" />
    </template>
  </div>
</template>
