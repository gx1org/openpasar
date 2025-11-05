<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ExLinkIcon from '../components/icon/ExLinkIcon.vue';
import { useMiscStore } from '../stores/misc';
import { RouterLink } from 'vue-router';
import PageBar from '../components/partial/PageBar.vue';

const datasets = ref([])
const isFetching = ref(true)
const misc = useMiscStore()
const bulkAction = ref('')
const checked = ref([])
const totalData = ref(0)
const page = ref(1)

const getData = () => {
  if (!misc.activeSite.id) {
    return
  }
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/datasets?page=${page.value}`).then(res => {
    datasets.value = res.data.datasets || []
    totalData.value = res.data.total || 0
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const isDeleting = ref(false)
const delBtn = (a) => {
  if (!confirm(`Are you sure to delete ${a.name}?`)) return;

  isDeleting.value = true
  apiReq('delete', `/sites/${misc.activeSite.id}/datasets/${a.id}`).then(() => {
    getData()
  })
  .catch(handleErrorApi)
  .finally(() => {
    isDeleting.value = false
  })
}

const navigate = (to) => {
  if (to == 'prev') {
    page.value--
  } else {
    page.value++
  }
  getData()
}

const execAction = () => {
  if (!confirm(`Are you sure to ${bulkAction.value} ${checked.value.length} items?`)) return;

  apiReq('post', '/sites/'+ misc.activeSite.id +'/datasets/actions', {
    ids: checked.value,
    action: bulkAction.value
  }).then(() => {
    checked.value = []
    bulkAction.value = ''
    getData()
  }).catch(handleErrorApi)
}

watch(() => misc.activeSite.id, () => {
  page.value = 1
  getData()
})

onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Datasets</h5>
      <div class="ms-auto">
        <RouterLink to="/datasets/new" class="btn btn-sm btn-primary">+ Create New</RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <ul class="list-group">
        <li v-for="a,i in datasets" :key="i" class="list-group-item mb-3 border-top">
          <div class="form-check mb-2">
            <input class="form-check-input" v-model="checked" type="checkbox" :value="a.id" :id="'cb_'+a.id">
            <label class="form-check-label" :for="'cb_'+a.id">
            </label>
            <RouterLink :to="'/datasets/'+a.id" class="">{{ a.name }}</RouterLink>
            <button class="float-end btn btn-sm btn-light border text-danger" @click="delBtn(a)" :disabled="isDeleting">Delete</button>
          </div>
          <div class="d-flex gap-2 small text-muted overflow-x-auto">
            <span class="text-muted">{{ a.items.map(v => v.title).join(', ').substring(0, 150) }}</span>
          </div>
        </li>
      </ul>
      <div v-if="datasets.length > 0">
        <div v-if="checked.length > 0" class="d-flex gap-2">
          <select v-model="bulkAction" class="form-control form-control-sm">
            <option value="">Bulk Action: ({{ checked.length }} selected)</option>
            <option value="delete">Delete</option>
          </select>
          <button @click="execAction" class="btn btn-light btn-sm border" :disabled="checked.length == 0">Execute</button>
        </div>
        <PageBar :page="page" :totalData="totalData" @navigate="navigate" />
      </div>
      <div v-else>
        No data
      </div>
    </template>
  </div>
</template>