<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import AdminPopup from '../components/modal/AdminPopup.vue';
import { useMiscStore } from '../stores/misc';

const admins = ref([])
const isFetching = ref(true)
const misc = useMiscStore()
const totalData = ref(0)
const popupBtn = ref(null)
const showAdmin = ref({})

const getData = () => {
  if (!misc.activeSite.id) {
    return
  }
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/admins`).then(res => {
    admins.value = res.data.admins || []
    totalData.value = res.data.total || 0
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const show = (p) => {
  showAdmin.value = p || {}
  popupBtn.value.click()
}

watch(() => misc.activeSite.id, () => {
  getData()
})

onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Admins</h5>
      <div class="ms-auto">
        <button @click="show" class="btn btn-sm btn-primary">+ Create New</button>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <ul class="list-group">
        <li v-for="p,i in admins" :key="i" class="list-group-item mb-3 border-top">
          <div class="mb-2">
            <a href="javascript:;" class="" @click="show(p)">
              {{ p.nickname }} ({{ p.user.email }})
            </a>
          </div>
          <div class="d-flex gap-2 small text-muted overflow-x-auto">
            <span class="text-nowrap">Role: {{ p.role }}</span>
          </div>
        </li>
      </ul>
      <div v-if="admins.length == 0">
        No data
      </div>
    </template>
    <button class="d-none" ref="popupBtn" data-bs-toggle="modal" data-bs-target="#AdminPopup"></button>
    <AdminPopup :data="showAdmin" @updated="getData" />
  </div>
</template>