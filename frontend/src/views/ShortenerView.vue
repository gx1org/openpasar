<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ExLinkIcon from '../components/icon/ExLinkIcon.vue';
import { useMiscStore } from '../stores/misc';
import PageBar from '../components/partial/PageBar.vue';
import ShortenerForm from '../components/modal/ShortenerForm.vue';

const shorteners = ref([])
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
  apiReq('get', `/sites/${misc.activeSite.id}/shorteners?page=${page.value}`).then(res => {
    shorteners.value = res.data.shorteners || []
    totalData.value = res.data.total || 0
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const execAction = () => {
  if (!confirm(`Are you sure to ${bulkAction.value} ${checked.value.length} items?`)) return;

  apiReq('post', `/sites/${misc.activeSite.id}/shorteners/actions`, {
    ids: checked.value,
    action: bulkAction.value
  }).then(() => {
    checked.value = []
    bulkAction.value = ''
    getData()
  }).catch(handleErrorApi)
}

const navigate = (to) => {
  if (to == 'prev') {
    page.value--
  } else {
    page.value++
  }
  getData()
}

const shortenerEditing = ref({})
const editBtn = (s) => {
  shortenerEditing.value = JSON.parse(JSON.stringify(s))
  document.getElementById('ShortenerFormButton').click()
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
      <h5 class="mb-4">Shorteners</h5>
      <div class="ms-auto">
        <button data-bs-toggle="modal" data-bs-target="#ShortenerForm" class="btn btn-sm btn-primary" id="ShortenerFormButton">
          + Create New
        </button>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <ul class="list-group">
        <li v-for="a,i in shorteners" :key="i" class="list-group-item mb-3 border-top">
          <div class="form-check mb-2">
            <input class="form-check-input" v-model="checked" type="checkbox" :value="a.id" :id="'cb_'+a.id">
            <label class="form-check-label" :for="'cb_'+a.id">
            </label>
            <a href="jsvascript:;" @click="editBtn(a)" class="">/{{ a.short }}</a>
          </div>
          <div class="d-flex gap-2 small text-muted overflow-x-auto">
            <a :href="misc.activeSite.home_url+'/l/'+a.short" class="" target="_blank">
              <ExLinkIcon style="width: 16px;"/>
            </a>
            <span class="text-muted">{{ a.long }},</span>
            <span v-if="!a.is_active" class="text-danger">inactive,</span>
          </div>
        </li>
      </ul>
      <div v-if="shorteners.length > 0">
        <div class="d-flex gap-2">
          <select v-model="bulkAction" class="form-control form-control-sm">
            <option value="">Bulk Action: ({{ checked.length }} selected)</option>
            <option value="publish">Activate</option>
            <option value="unpublish">Deactivate</option>
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
    <ShortenerForm :data="shortenerEditing" @updated="getData" />
  </div>
</template>