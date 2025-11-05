<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ExLinkIcon from '../components/icon/ExLinkIcon.vue';
import { useMiscStore } from '../stores/misc';
import { RouterLink } from 'vue-router';

const isFetching = ref(true)
const misc = useMiscStore()

const getData = () => {
  if (!misc.activeSite.id) {
    return
  }
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/directories`).then(res => {
    misc.directories = res.data.directories || []
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const isDeleting = ref(false)
const deleteBtn = (d) => {
  if (!confirm('Are you sure?')) return

  isDeleting.value = true
  apiReq('delete', `/sites/${misc.activeSite.id}/directories/${d.id}`).then(res => {
    getData()
  })
  .catch(handleErrorApi)
  .finally(() => {
    isDeleting.value = false
  })
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Directories</h5>
      <div class="ms-auto">
        <RouterLink to="/directories/new" class="btn btn-sm btn-primary">+ Create New</RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <ul class="list-group">
        <li v-for="a,i in misc.directories" :key="i" class="list-group-item mb-3 border-top">
          <div class="d-flex mb-2">
            <div class="">
              <RouterLink :to="'/directories/'+a.id" class="">{{ a.permalink }}</RouterLink>
            </div>
            <div v-if="!a.is_default" class="ms-auto">
              <button class="btn btn-sm btn-light border text-danger py-0" @click="deleteBtn(a)">Delete</button>
            </div>
          </div>
          <div class="d-flex gap-2 small text-muted overflow-x-auto">
            <a :href="misc.activeSite.home_url+'/d/'+a.permalink" class="" target="_blank">
              <ExLinkIcon style="width: 16px;"/>
            </a>
            <span v-if="!a.is_published" class="text-danger">draft,</span>
            <span class="text-muted">{{ a.description }},</span>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>