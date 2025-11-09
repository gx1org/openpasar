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
  <div class="py-5 text-center px-3 border rounded bg-white">
    <h6 class="mb-3">Login untuk melanjutkan</h6>
    <a :href="url" class="btn btn-primary">Login Sekarang</a>
  </div>
</template>