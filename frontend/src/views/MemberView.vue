<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, formatDate, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { useMiscStore } from '../stores/misc';
import PageBar from '../components/partial/PageBar.vue';

const misc = useMiscStore()
const members = ref([])
const isFetching = ref(true)
const bulkAction = ref('')
const checked = ref([])
const page = ref(1)
const totalData = ref(0)

const getData = () => {
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/members?page=${page.value}`).then(res => {
    members.value = res.data.members || []
    totalData.value = res.data.total || 0
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const execAction = () => {
  if (!confirm(`Are you sure to ${bulkAction.value} ${checked.value.length} items?`)) return;

  apiReq('post', '/sites/'+ misc.activeSite.id +'/members/actions', {
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

watch(() => misc.activeSite.id, () => {
  getData()
})

onMounted(() => {
  if (misc.activeSite.id) {
    getData()
  }
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Members</h5>
      <div class="ms-auto">
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <ul class="list-group">
        <li v-for="m,i in members" :key="i" class="list-group-item mb-3 border-top">
          <div class="form-check mb-1">
            <input class="form-check-input" v-model="checked" type="checkbox" :value="m.id" :id="'cb_'+m.id">
            <label class="form-check-label" :for="'cb_'+m.id">
            </label>
            <a :href="`mailto:${m.email}`">{{ m.email }} </a>
            <span v-if="m.name"> | {{ m.name }}</span>
            <span v-if="m.website" class="text-muted">
              | <a :href="(m.website.startsWith('http') ? '' : 'http://') + m.website"
               target="_blank" rel="noopener noreferrer">
                {{ m.website }} &nearr;
              </a>
            </span>
          </div>
        </li>
      </ul>
      <div v-if="members.length > 0">
        <div class="d-flex gap-2">
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