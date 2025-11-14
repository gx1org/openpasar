<script setup>
import StoreDetailView from '../../views/StoreDetailView.vue';
const route = useRoute()
const { data: store, pending, error } = await useAsyncData('store', async () => {
  try {
    const apiUrl = useRuntimeConfig().public.apiUrl
    const res = await fetch(`${apiUrl}/api/stores/${route.params.id}`).then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json()
    })
    return res.store
  } catch (err) {
    console.error(err)
    return {}
  }
})
</script>
<template>
  <StoreDetailView :store="store"/>
</template>