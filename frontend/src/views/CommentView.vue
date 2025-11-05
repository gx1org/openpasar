<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, formatDateTime, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ExLinkIcon from '../components/icon/ExLinkIcon.vue';
import { useMiscStore } from '../stores/misc';
import PageBar from '../components/partial/PageBar.vue';

const misc = useMiscStore()
const comments = ref([])
const isFetching = ref(true)
const bulkAction = ref('')
const checked = ref([])
const page = ref(1)
const totalData = ref(0)

const getData = () => {
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/comments?page=${misc.commentQuery.page}&search=${misc.commentQuery.search}&status=${misc.commentQuery.status}`).then(res => {
    comments.value = res.data.comments || []
    totalData.value = res.data.total || 0
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const execAction = () => {
  if (!confirm(`Are you sure to ${bulkAction.value} ${checked.value.length} items?`)) return;

  apiReq('post', '/sites/'+ misc.activeSite.id +'/comments/actions', {
    ids: checked.value,
    action: bulkAction.value
  }).then(() => {
    checked.value = []
    bulkAction.value = ''
    getData()
  }).catch(handleErrorApi)
}

const filter = () => {
  misc.commentQuery.page = 1
  getData()
}

const navigate = (to) => {
  if (to == 'prev') {
    misc.commentQuery.page--
  } else {
    misc.commentQuery.page++
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
      <h5 class="mb-4">Comments</h5>
      <div class="ms-auto">
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="border p-2 mb-4">
        <p class="text-center mb-2 small text-muted">Search and filter</p>
        <div class="row g-2">
          <div class="col-md-6">
            <input type="search" v-model="misc.commentQuery.search" @change="filter" class="form-control form-control-sm" placeholder="Search...">
          </div>
          <div class="col-md-6">
            <select v-model="misc.commentQuery.status" class="form-control form-control-sm" @change="filter">
              <option value="">All status</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
              <option value="replied">Replied</option>
              <option value="unreplied">Unreplied</option>
            </select>
          </div>
        </div>
      </div>
      <ul class="list-group">
        <li v-for="c,i in comments" :key="i" class="list-group-item mb-3 border-top">
          <div class="form-check mb-1">
            <input class="form-check-input" v-model="checked" type="checkbox" :value="c.id" :id="'cb_'+c.id">
            <label class="form-check-label" :for="'cb_'+c.id">
            </label>
            <span>{{ c.name }}: </span>
            <RouterLink :to="'/comments/'+c.id">
              {{ c.comment.substring(0, 30) + (c.comment.length > 30 ? '...' : '') }}
            </RouterLink>
            <p class="text-muted small mb-0 mt-1">
               <span class="text-dark">in</span> {{ c.post.title.substring(0, 30) + (c.post.title.length > 30 ? '...' : '') }}
            </p>
          </div>
          <div class="d-flex gap-2 small text-muted overflow-x-auto">
            <a :href="misc.activeSite.home_url+'/comment?u='+c.post.permalink" class="" target="_blank">
              <ExLinkIcon style="width: 16px;"/>
            </a>
            <span class="text-nowrap">{{ formatDateTime(c.created_at) }},</span>
            <span v-if="!c.is_published" class="text-danger">hidden,</span>
            <span v-if="!c.is_replied" class="text-danger">unreplied,</span>
          </div>
        </li>
      </ul>
      <div v-if="comments.length > 0">
        <div v-if="checked.length > 0" class="d-flex gap-2">
          <select v-model="bulkAction" class="form-control form-control-sm">
            <option value="">Bulk Action: ({{ checked.length }} selected)</option>
            <option value="publish">Publish</option>
            <option value="unpublish">Un-publish</option>
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