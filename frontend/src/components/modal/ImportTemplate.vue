<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { useMiscStore } from '../../stores/misc';
import { apiReq, handleErrorApi } from '../../helpers/fns'
import SubmitButton from '../partial/SubmitButton.vue';

const emit = defineEmits(['imported'])
const misc = useMiscStore()
const inputFile = ref(null)
const file = ref(null)
const closeBtn = ref(null)
const approve = ref(false)

const isSending = ref(false)
const submit = () => {
  isSending.value = true
  const form = new FormData()
  form.append('file', file.value)
  form.append('approve', approve.value)

  apiReq('post', `/sites/${misc.activeSite.id}/templates/import`, form)
    .then(res => {
      if (res.data.dataset_need_approval) {
        const msg = 'The following dataset will be replaced: ('+res.data.dataset_need_approval+'). Continue?'
        if (confirm(msg)) {
          approve.value = true
          submit()
        }
      } else {
        emit('imported')
        inputFile.value.files = null
        closeBtn.value.click()
      }
    })
    .catch(e => {
      handleErrorApi(e)
    })
    .finally(() => {
      isSending.value = false
    })
}

const handleSelect = () => {
  file.value = inputFile.value.files[0];
}

</script>
<template>
  <div class="modal fade" tabindex="-1" id="ImportTemplate">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Import Template</h5>
          <button ref="closeBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="max-height: calc(100vh - 85px);overflow-y: auto;">
          <div class="mb-3">
            <label for="" class="form-label">Select .xml file</label>
            <input type="file" class="form-control" ref="inputFile" @change="handleSelect">
          </div>
          <div>
            <SubmitButton @click="submit" :sending="isSending" :disabled="!file" class="btn btn-primary w-100">
              Upload
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
