<script setup>
import { onMounted, ref } from 'vue';
import { useMiscStore } from '../stores/misc';

const misc = useMiscStore()
const url = ref('')

onMounted(() => {
  const redir = `?callback_url=${encodeURIComponent(location.href)}`
  url.value = `https://autz.org/onboarding/${misc.config.autzorg_app_id}${redir}`
})
</script>

<template>
  <div class="text-center card my-4">
    <h6 class="card-header">Login untuk melanjutkan</h6>
    <div class="card-body">
      <a :href="url" class="btn btn-primary">Login Sekarang</a>
    </div>
  </div>
</template>