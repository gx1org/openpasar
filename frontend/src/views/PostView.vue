<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, formatDate, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ExLinkIcon from '../components/icon/ExLinkIcon.vue';
import { useMiscStore } from '../stores/misc';
import { RouterLink } from 'vue-router';
import PageBar from '../components/partial/PageBar.vue';
import EyeIcon from '../components/icon/EyeIcon.vue';
import CommentIcon from '../components/icon/CommentIcon.vue';
import UserIcon from '../components/icon/UserIcon.vue';
import MenuIcon from '../components/icon/MenuIcon.vue';
import CreatePost from '../components/modal/CreatePost.vue';

const posts = ref([])
const isFetching = ref(true)
const misc = useMiscStore()
const bulkAction = ref('')
const checked = ref([])
const totalData = ref(0)

const getData = async () => {
  if (!misc.activeSite.id) {
    return
  }
  if (misc.directories.length == 0) {
    await misc.getDirectories()
  }
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/posts?page=${misc.postQuery.page}&search=${misc.postQuery.search}&order=${misc.postQuery.order}&directory_id=${misc.postQuery.directory_id}`).then(res => {
    posts.value = res.data.posts || []
    totalData.value = res.data.total || 0
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const filter = () => {
  misc.postQuery.page = 1
  getData()
}

const execAction = () => {
  let action = bulkAction.value
  if (action.startsWith('cd-')) {
    action = 'change-directory'
  }
  if (!confirm(`You are about to do "${action}" on ${checked.value.length} items. Continue?`)) return;

  apiReq('post', `/sites/${misc.activeSite.id}/posts/actions`, {
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
    misc.postQuery.page--
  } else {
    misc.postQuery.page++
  }
  getData()
}

watch(() => misc.activeSite.id, () => {
  misc.postQuery = {
    order: 'latest',
    page: 1,
    search: ''
  }
  getData()
})

onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Posts</h5>
      <div class="ms-auto">
        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#CreatePost">+ Create New</button>
      </div>
    </div>
    <div class="border p-2 mb-4">
      <p class="text-center mb-2 small text-muted">Search and filter</p>
      <div class="row g-2">
        <div class="col-md-4">
          <input type="search" v-model="misc.postQuery.search" @change="filter" class="form-control form-control-sm" placeholder="Search...">
        </div>
        <div class="col-md-4">
          <select v-model="misc.postQuery.directory_id" class="form-control form-control-sm" @change="filter">
            <option value="">All directory</option>
            <option v-for="d,i in misc.directories" :key="i" :value="d.id">{{ d.permalink }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <select v-model="misc.postQuery.order" class="form-control form-control-sm" @change="filter">
            <option value="latest">Sort by latest</option>
            <option value="a_to_z">Sort by title</option>
            <option value="most_viewed">Sort by view</option>
            <option value="most_commented">Sort by comment</option>
          </select>
        </div>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <ul class="list-group">
        <li v-for="p,i in posts" :key="i" class="list-group-item border-top mb-3">
          <div class="form-check mb-2">
            <input class="form-check-input" v-model="checked" type="checkbox" :value="p.id" :id="'cb_'+p.id">
            <label class="form-check-label" :for="'cb_'+p.id">
            </label>
            <span v-if="p.is_pinned" class="text-danger me-1">*</span>
            <RouterLink :to="'/posts/'+p.id" class="">{{ p.title }}</RouterLink>
          </div>
          <div class="d-flex gap-2 small text-muted overflow-x-auto">
            <a :href="misc.activeSite.home_url+'/p/'+p.permalink" class="" target="_blank">
              <ExLinkIcon style="width: 16px;"/>
            </a>
            <span class="text-nowrap">{{ formatDate(p.published_at) }}</span>
            <span v-if="!p.is_published" class="text-danger">draft</span>
            <span class="text-nowrap text--success"><EyeIcon style="width: 16px;" /> {{ p.view_count }}</span>
            <span class="text-nowrap text--warning"><CommentIcon style="width: 16px;" /> {{ p.comment_count }}</span>
            <span class="text-nowrap text--info"><UserIcon style="width: 16px;" /> {{ p.creator_name }}</span>
            <span class="text-nowrap text--muted"><MenuIcon style="width: 16px;" /> {{ p.tag }}</span>
          </div>
        </li>
      </ul>
      <div v-if="posts.length > 0">
        <div v-if="checked.length > 0" class="d-flex gap-2">
          <select v-model="bulkAction" class="form-control form-control-sm">
            <option value="">Bulk Action: ({{ checked.length }} selected)</option>
            <option value="publish">Publish</option>
            <option value="unpublish">Un-publish</option>
            <option value="delete">Delete</option>
            <option value="pin">Pin</option>
            <option value="unpin">Unpin</option>
            <option v-for="d,i in misc.directories" :value="`cd-${d.id}`">Move to directory: {{ d.title }}</option>
          </select>
          <button @click="execAction" class="btn btn-light bg-white btn-sm border" :disabled="checked.length == 0">Execute</button>
        </div>
        <PageBar :page="misc.postQuery.page" :totalData="totalData" @navigate="navigate" />
      </div>
      <div v-else>
        No data
      </div>
    </template>
    <CreatePost />
  </div>
</template>