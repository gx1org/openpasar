<script setup>
import { computed, onMounted, ref } from 'vue';
import { apiReq, handleErrorApi } from '../../helpers/fns';
import { useMiscStore } from '../../stores/misc';
import AboutToUpload from '../partial/AboutToUpload.vue';
import SpinnerBox from '../partial/SpinnerBox.vue';

const misc = useMiscStore()
const emits = defineEmits(['selected', 'canceled'])
const images = ref([])
const isFetching = ref(true)
const page = ref(1)
const search = ref('')
const inputFile = ref(null)

const isContributor = computed(() => {
  return misc.activeSite.my_role == 'contributor'
})

const isAboutToUpload = ref(null)
const handleInputFileChange = () => {
  if (inputFile.value.files && inputFile.value.files.length > 0) {
    const file = inputFile.value.files[0]
    if (!(/image/i).test(file.type)){
        alert( "File "+ file.name +" is not an image." );
        return false;
    }

    isAboutToUpload.value = file
  }
}

const handleUploaded = (path) => {
  isAboutToUpload.value = null
  inputFile.value.value = null
  if (path) {
    handleClose(path)
  }
}

const handleClose = (path) => {
  if (typeof path == 'string') {
    emits('selected', path)
  }
  document.getElementById('GalleryModal-close').click()
}

const getImages = () => {
  isFetching.value = true
  apiReq('get', `/sites/${misc.activeSite.id}/images?page=${page.value}&search=${search.value}`)
    .then(res => {
      images.value = res.data.images
    })
    .catch(handleErrorApi)
    .finally(() => {
      isFetching.value = false
    })
}

const filter = () => {
  page.value = 1
  getImages()
}

const isUpdating = ref(-1)
const updateDescription = (i) => {
  isUpdating.value = i
  const id = images.value[i].id
  const description = images.value[i].description
  apiReq('patch', `/sites/${misc.activeSite.id}/images/${id}`, { description })
    .catch(handleErrorApi)
    .finally(() => {
      isUpdating.value = -1
    })
}

const handleDelete = (i) => {
  isUpdating.value = i
  const id = images.value[i].id
  apiReq('delete', `/sites/${misc.activeSite.id}/images/${id}`)
    .then(() => {
      images.value.splice(i, 1)
    })
    .catch(handleErrorApi)
    .finally(() => {
      isUpdating.value = -1
    })
}

onMounted(() => {
  document.getElementById('GalleryModal').addEventListener('shown.bs.modal', () => {
    getImages()
  })
})

</script>
<template>
  <div class="modal fade" tabindex="-1" id="GalleryModal" data-bs-backdrop="static">
    <div class="modal-dialog my-2 modal-lg">
      <div class="modal-content">
        <div class="modal-header gap-2">
          <label class="btn btn-primary btn-sm" for="inputFile" :class="{disabled: !!isAboutToUpload}">Upload</label>
          <input type="file" ref="inputFile" class="d-none" id="inputFile" @change="handleInputFileChange" accept="image/*">
          <input type="search" class="form-control form-control-sm" placeholder="Search..." :disabled="!!isAboutToUpload" v-model="search" @change="filter">
          <button class="btn-close" @click="handleClose" aria-label="Close"  :disabled="!!isAboutToUpload"></button>
          <button id="GalleryModal-close" type="button" class="d-none" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body bg-light">
          <SpinnerBox v-if="isFetching" />
          <template v-else>
            <AboutToUpload v-if="isAboutToUpload" :file="isAboutToUpload" @uploaded="handleUploaded" />
            <div v-else class="row g-3">
              <div v-for="img,i in images" :key="i" class="col-lg-6">
                <div class="d-flex shadow border w-100 bg-white">
                  <div class="p-2">
                    <img :src="img.thumbnail_path" alt="" width="64" height="64">
                  </div>
                  <div class="px-2 py-2 w-100">
                    <input :class="{'d-none': isUpdating != i}" type="text" class="form-control form-control-sm mb-1" value="..." disabled>
                    <input :class="{'d-none': isUpdating == i}" type="search" class="form-control form-control-sm mb-1" v-model="img.description" @change="updateDescription(i)" :disabled="isContributor">
                    <div class="btn-group w-100">
                      <button class="btn btn-sm btn-light border text-danger" :class="{disabled: isContributor || isUpdating >= 0}" @click="handleDelete(i)">
                        <i class="bi bi-trash"></i>
                      </button>
                      <a class="btn btn-sm btn-light border" target="_blank" :href="img.path" :class="{disabled: isUpdating >= 0}">
                        <i class="bi bi-eye"></i>
                      </a>
                      <button class="btn btn-sm btn-light border text-primary" @click="handleClose(img.path)" :class="{disabled: isUpdating >= 0}">Choose image</button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="images.length == 0" class="col-12">
                <div class="text-center border bg-white shadow p-2 text-muted small">No result</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
