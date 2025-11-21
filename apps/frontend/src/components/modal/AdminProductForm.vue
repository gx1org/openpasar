<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { apiReq, handleErrorApi, img } from '../../utils/fns'
import SubmitButton from '../partial/SubmitButton.vue';
import ProductImageInput from '../partial/ProductImageInput.vue';

const prop = defineProps({
  data: Object
})
const emit = defineEmits(['updated'])
const form = ref({})
const images = ref([])
const closeBtn = ref(null)
const isNew = ref(true)

const isValidForm = computed(() => {
  return form.value.sku && form.value.name && form.value.price
    && form.value.in_stock && form.value.description && form.value.image_url
})

const isSending = ref(false)
const submitBtn = () => {
  images.value = images.value.filter(Boolean)
  form.value.image_url = images.value.join(',')
  isSending.value = true
  apiReq('put', `/admin/products/${prop.data.id}`, form.value)
    .then(() => {
      emit('updated')
      closeBtn.value.click()
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const handleImageChange = (e, i) => {
  images.value[i] = e.target.value
  images.value = images.value.filter(Boolean)
}

const syncProp = () => {
  form.value = JSON.parse(JSON.stringify(prop.data))
  images.value = form.value.image_url?.split(',') || []
  form.value.visibility = form.value.visibility || 'public'
  if (prop.data?.id) {
    isNew.value = false
  }
}
watch(() => prop.data, () => {
  syncProp()
})
onMounted(() => {
  syncProp()
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="AdminProductForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ 'Edit Produk'}}</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="" class="form-label">SKU</label>
            <input type="text" class="form-control" v-model="form.sku">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Nama</label>
            <input type="text" class="form-control" v-model="form.name">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Harga</label>
            <input type="number" class="form-control" v-model="form.price" step="1000">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Stok</label>
            <select class="form-control" v-model="form.in_stock">
              <option value="one">Satu</option>
              <option value="many">Banyak</option>
              <option value="empty">Kosong</option>
            </select>
          </div>
          <ProductImageInput :images="images" @change="handleImageChange" />
          <div class="mb-3">
            <label for="" class="form-label">Deskripsi</label>
            <textarea class="form-control" v-model="form.description" rows="7"></textarea>
          </div>
          <div v-if="!isNew" class="mb-3">
            <label for="" class="form-label">Tampilkan</label>
            <select class="form-control" v-model="form.visibility">
              <option value="pending_review-private">Pending Review (Privat)</option>
              <option value="pending_review-public">Pending Review (Publik)</option>
              <option value="private">Privat</option>
              <option value="public">Publik (Muncul di pencarian)</option>
            </select>
          </div>
          <div>
            <SubmitButton :disabled="!isValidForm" :sending="isSending" @click="submitBtn" class="btn btn-primary w-100">
              {{ 'Simpan Perubahan' }}
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
