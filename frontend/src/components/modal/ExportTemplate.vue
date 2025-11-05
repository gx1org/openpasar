<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { useMiscStore } from '../../stores/misc';
import { apiReq, createPermalink, handleErrorApi } from '../../helpers/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const prop = defineProps({
  data: Object
})

const emit = defineEmits(['exported'])
const misc = useMiscStore()
const form = ref({
  name: '',
  version: '',
  url: '',
  author: '',
})
const closeBtn = ref(null)

const validForm = computed(() => {
  return form.name && form.version && form.url && form.author
})

const isSending = ref(false)
const submit = () => {
  isSending.value = true
  apiReq('post', `/sites/${misc.activeSite.id}/templates/export`, form.value, {
    responseType: 'blob'
  })
    .then(res => {
      download(res)
    })
    .catch(e => {
      handleErrorApi(e)
    })
    .finally(() => {
      isSending.value = false
    })
}

const download = (res) => {
  // Ambil header Content-Disposition
  const filename = createPermalink(`${form.value.name}-${form.value.version}`)+".xml"
  const blob = new Blob([res.data], { type: res.data.type || "application/octet-stream" });

  // Bikin link untuk download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  success()
}

const success = () => {
  emit('exported')
  closeBtn.value.click()
}

onMounted(() => {
  form.value = JSON.parse(JSON.stringify(prop.data))
})

</script>
<template>
  <div class="modal fade" tabindex="-1" id="ExportTemplate">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Export Template</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="max-height: calc(100vh - 85px);overflow-y: auto;">
          <div class="mb-3">
            <label for="" class="form-label">Name</label>
            <input type="email" class="form-control" v-model="form.name">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Version</label>
            <input type="email" class="form-control" v-model="form.version">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">URL</label>
            <input type="email" class="form-control" v-model="form.url">
          </div>
          <div class="mb-3">
            <label for="" class="form-label">Author</label>
            <input type="email" class="form-control" v-model="form.author">
          </div>
          <div>
            <SubmitButton @click="submit" :sending="isSending" :disabled="validForm" class="btn btn-primary w-100">
              Download
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
