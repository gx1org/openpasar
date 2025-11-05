<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import SubmitButton from '../components/partial/SubmitButton.vue';
import { useMiscStore } from '../stores/misc';
import ExportTemplate from '../components/modal/ExportTemplate.vue';
import ImportTemplate from '../components/modal/ImportTemplate.vue';

const misc = useMiscStore()
const template = ref({
  metadata: {}
})

const isFetching = ref(true)
const fetchData = () =>{
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/templates`).then(res => {
    template.value = res.data.template || {}
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
      <h5 class="mb-4">Templates</h5>
    </div>
    <SpinnerBox v-if="isFetching" />
    <div v-else>
      <div class="table-responsive">
        <table class="table">
          <tbody>
            <tr>
              <td class="text-muted">Name</td>
              <td class="w-100 ps-0"><span class="text-muted">:</span> {{ template.metadata.name }}</td>
            </tr>
            <tr>
              <td class="text-muted">Version</td>
              <td class="w-100 ps-0"><span class="text-muted">:</span> {{ template.metadata.version }}</td>
            </tr>
            <tr>
              <td class="text-muted">URL</td>
              <td class="w-100 ps-0"><span class="text-muted">:</span> {{ template.metadata.url }}</td>
            </tr>
            <tr>
              <td class="text-muted">Author</td>
              <td class="w-100 ps-0"><span class="text-muted">:</span> {{ template.metadata.author }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <RouterLink to="/templates/edit" class="btn btn-primary w-100 mb-2">
        Template Editor &rarr;
      </RouterLink>
      <div class="d-flex mb-4">
        <button class="btn btn-secondary w-100 me-2" data-bs-toggle="modal" data-bs-target="#ExportTemplate">
          Export
        </button>
        <button class="btn btn-secondary w-100" data-bs-toggle="modal" data-bs-target="#ImportTemplate">
          Import
        </button>
      </div>
      <div>
        <h5 class="mb-2">Need more template?</h5>
        <p>
        </p>
      </div>
    </div>
    <ExportTemplate @exported="fetchData" :data="template.metadata" :key="template.metadata"/>
    <ImportTemplate @imported="fetchData" />
  </div>
</template>
