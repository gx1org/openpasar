<script setup>
import { useHead } from 'nuxt/app';
import IndexView from '../views/IndexView.vue';
import { useMiscStore } from '../stores/misc';
const misc = useMiscStore()
useHead({
  title: misc.config.site_name + ' | ' + misc.config.site_description,
})
</script>
<template>
  <IndexView />
</template>