<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import EyeIcon from '../icon/EyeIcon.vue';
import ImagePreview from '../modal/ProductView.vue';
import { useMiscStore } from '../../stores/misc';
import GalleryModal from '../modal/GalleryModal.vue';

const misc = useMiscStore()
const prop = defineProps({
  modelValue: String,
  label: String,
})
const emits = defineEmits(['update:modelValue'])
const value = ref(prop.modelValue)

const valueComputed = computed(() => {
  return value.value || '/noimage.png'
})

watch(() => prop.modelValue, () => {
  value.value = prop.modelValue
})

const galleryKey = ref(0)
const updateFromGallery = (url) => {
  galleryKey.value++
  emits('update:modelValue', url)
}

</script>
<template>
  <div class="d-flex">
    <label for="" class="form-label me-auto">{{ prop.label }}</label>
  </div>
  <div class="d-flex">
    <div style="width: 75px;">
      <img :src="valueComputed" alt="img" class="w-100">
    </div>
    <div class="ps-3">
      <button data-bs-toggle="modal" data-bs-target="#GalleryModal" class="btn btn-light border btn-sm w-100 mb-2">
        Browse Gallery
      </button>
      <div class="d-flex">
        <button data-bs-toggle="modal" data-bs-target="#ImagePreview" class="btn btn-light border btn-sm w-100" :disabled="!value">
          Preview
        </button>
        <button @click="value=''" class="btn btn-light border text-danger ms-2 btn-sm w-100" :disabled="!value">
          Remove
        </button>
      </div>
    </div>
    <input type="text" :value="value" class="d-none"
    @input="(event) => $emit('update:modelValue', event.target.value)"
    placeholder="https://"
    />
  </div>
  <div class="input-group">
  </div>
  <ImagePreview :data="value" />
  <GalleryModal @selected="updateFromGallery" :key="galleryKey" />
</template>