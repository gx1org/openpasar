<script setup>
const props = defineProps({
  images: { type: Array }
})
const emit = defineEmits(['change'])

function swipeUp(index) {
  const arr = props.images
  if (index <= 0) return; // tidak bisa ke atas
  [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
}

function swipeDown(index) {
  const arr = props.images
  if (index >= arr.length - 1) return; // tidak bisa ke bawah
  [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
}

function removeItem(index) {
  const arr = props.images
  arr.splice(index, 1);
}

</script>
<template>
  <div class="mb-3">
    <div class="d-flex">
      <label for="" class="form-label">Foto Produk</label>
      <a href="https://upld.zone.id" target="_blank" class="small ms-auto">Upld &nearr;</a>
    </div>
    <div v-for="image,i in images" :key="img" class="d-flex mb-2">
      <a :href="image" target="_blank" rel="noopener noreferrer">
        <img :src="(image)" alt="" class="border me-2" width="70" height="70">
      </a>
      <div class="w-100">
        <input type="text" class="form-control form-control-sm mb-2" :value="image" @change="emit('change', $event, i)">
        <button class="btn btn-light border text-primary fw-bold btn-sm me-1" @click="swipeUp(i)">&uarr;</button>
        <button class="btn btn-light border text-primary fw-bold btn-sm me-1" @click="swipeDown(i)">&darr;</button>
        <button class="btn btn-light border text-danger fw-bold btn-sm" @click="removeItem(i)">&times;</button>
      </div>
    </div>
    <div>
      <button class="btn btn-outline-primary btn-sm" @click="images.push('')">Tambah Foto</button>
    </div>
  </div>
</template>