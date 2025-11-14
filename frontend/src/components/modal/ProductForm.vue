<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { apiReq, handleErrorApi, img } from '../../helpers/fns'
import SubmitButton from '../partial/SubmitButton.vue';

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

const handleImageChange = (e, i) => {
  images.value[i] = e.target.value
  images.value = images.value.filter(Boolean)
}

const syncProp = () => {
  form.value = JSON.parse(JSON.stringify(prop.data))
  images.value = form.value.image_url?.split(',') || []
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
              <label for="" class="form-label">Foto Produk</label>
              <a href="https://upld.zone.id" target="_blank" class="small ms-auto">Upld &nearr;</a>
            </div>
            <div v-for="image,i in images" :key="img" class="d-flex mb-2">
              <a :href="image" target="_blank" rel="noopener noreferrer">
                <img :src="(image)" alt="" class="border me-2" width="50" height="50">
              </a>
              <input type="text" class="form-control" :value="image" @change="handleImageChange($event, i)">
              <button class="btn btn-light border text-danger ms-2" @click="images.splice(i, 1)">&times;</button>
            </div>
            <div>
              <button class="btn btn-outline-primary btn-sm" @click="images.push('')">Tambah Foto</button>
            </div>
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Deskripsi</label>
            <textarea class="form-control" v-model="form.description" rows="7"></textarea>
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
