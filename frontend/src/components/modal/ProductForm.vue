<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { apiReq, handleErrorApi } from '../../helpers/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const auth = useAuthStore()
const prop = defineProps({
  data: Object
})
const emit = defineEmits(['updated'])
const form = ref({})
const closeBtn = ref(null)
const isNew = ref(true)

const isValidForm = computed(() => {
  return form.value.sku && form.value.name && form.value.price
    && form.value.in_stock && form.value.description && form.value.image_url
})

const isSending = ref(false)
const submitBtn = () => {
  isSending.value = true
  apiReq(isNew.value ? 'post' : 'put', `/user/stores/products${isNew.value ? '' : `/${prop.data.id}`}`, form.value)
    .then(() => {
      emit('updated')
      closeBtn.value.click()
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

onMounted(() => {
  if (prop.data?.id) {
    isNew.value = false
  }
  form.value = {...prop.data}
})
</script>
<template>
  <div class="modal fade" tabindex="-1" id="ProductForm">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isNew ? 'Produk Baru' : 'Edit Produk'}}</h5>
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
            <input type="number" class="form-control" v-model="form.price">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Stok</label>
            <select class="form-control" v-model="form.in_stock">
              <option value="one">Satu</option>
              <option value="many">Banyak</option>
              <option value="empty">Kosong</option>
            </select>
          </div>
          <div class="mb-3">
            <div class="d-flex">
              <label for="" class="form-label">Gambar</label>
              <a href="https://upld.zone.id" target="_blank" class="small ms-auto">Upld &nearr;</a>
            </div>
            <input type="text" class="form-control" v-model="form.image_url">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Deskripsi</label>
            <textarea class="form-control" v-model="form.description"></textarea>
          </div>
          <div>
            <SubmitButton :disabled="!isValidForm" :sending="isSending" @click="submitBtn" class="btn btn-primary w-100">
              {{ isNew ? 'Tambah Produk' : 'Simpan Perubahan' }}
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
