<script setup>
import { useRouter } from 'vue-router';
import { useMiscStore } from '../../stores/misc';
import { img } from '../../helpers/fns';
import { onMounted } from 'vue';

const router = useRouter()
const misc = useMiscStore()

const handleSearch = (e) => {
  const v = e.target.value
  router.push(`/search?q=${v}`)
}
onMounted(() => {
  const qs = new URLSearchParams(location.search)
  const q = qs.get('q') || ''
  if (q) {
    document.getElementById('search_top').value = q
  }
})
</script>

<template>
  <nav class="navbar navbar-light navbar-expand px-3 fixed-top container bg-white border-bottom">
    <RouterLink to="/" class="navbar-brand me-2">
      <img :src="img(misc.config.site_icon)" alt="logo" width="30" class="mb-1" />
    </RouterLink>
    <div class="input-group">
      <input class="form-control" id="search_top" :placeholder="misc.config.site_name" aria-label="Search" type="search" @change="handleSearch">
      <button class="btn btn-light border" type="button" id="basic-addon2" @click="handleSearch">
        <i class="bi bi-search"></i>
      </button>
    </div>
    <button class="btn btn-light border ms-2">
      <i class="bi bi-info-circle"></i>
    </button>
  </nav>
</template>
