<script setup>
import ProductDetailView from '../../views/ProductDetailView.vue';
const route = useRoute()
const { data: product, pending, error } = await useAsyncData('product', async () => {
  try {
    const res = await fetch(`${apiUrl()}/api/catalogues/${route.params.sku}`).then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json()
    })
    return res.product
  } catch (err) {
    console.error(err)
    return {}
  }
})

</script>
<template>
  <ProductDetailView :product="product"/>
</template>