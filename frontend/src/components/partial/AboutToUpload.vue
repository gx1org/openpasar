<script setup>
import { onMounted, ref } from 'vue';
import { apiReq, handleErrorApi } from '../../helpers/fns';
import { useMiscStore } from '../../stores/misc';
import SubmitButton from './SubmitButton.vue'

const props = defineProps({
  file: Object
})

const ratioList = ref({
  'Potrait (9:16)': 0.5625,
  'Potrait (3:4)': 0.75,
  'Square (1:1)': 1,
  'Landscape (4:3)': 1.3333,
  'Landscape (16:9)': 1.7778
})
const sizeList = ref([
  360,
  540,
  720,
  1080,
  1440,
  1920
])

const emit = defineEmits(['uploaded'])
const form = ref({
  description: '',
  max: 360,
  quality: 0.9,
  ratio: 'square',
  isSending: false,
})

const imageData = ref(null)
const canvasElement = ref(null)
const canvasThumbnailElement = ref(null)
const previewURL = ref('')
const thumbnailURL = ref('')
const importURL = ref('')
const clickPreview = ref(null)

const processFile = () => {
  const file = props.file
  if (!file) return

  const splitted = (file.name.split('.'))
  splitted.pop()
  form.value.description = splitted.join('.')
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function (event) {
    // blob stuff
    const blob = new Blob([event.target.result]); // create blob...
    window.URL = window.URL || window.webkitURL;
    const blobURL = window.URL.createObjectURL(blob); // and get it's URL
    createImageData(blobURL)
  };
}

const createImageData = (url) => {
  var image = new Image();
  image.src = url;
  image.onload = function() {
    imageData.value = image
    canvasElement.value.width = image.width
    canvasElement.value.height = image.height
    form.value.ratio = Number((image.width / image.height).toFixed(4))
    const ratioLabel = 'Original'
    ratioList.value[ratioLabel] = form.value.ratio
    drawImage()
  }
}

const drawImage = () => {
  const imgWidth = imageData.value.width
  const imgHeight = imageData.value.height

  let sX = 0
  let sY = 0
  let sWidth = imgWidth
  let sHeight = imgHeight
  let dX = 0
  let dY = 0
  let dWidth = imgWidth
  let dHeight = imgHeight

  const ratio = form.value.ratio
  sHeight = Math.round(1/ratio * imgWidth)
  if (sHeight <= imgHeight) {
    const removedHeight = imgHeight - sHeight
    sY = removedHeight / 2
  } else {      
    sHeight = imgHeight
    sWidth = Math.round(ratio * imgHeight)
    const removedWidth = imgWidth - sWidth
    sX = removedWidth / 2
  }
  dWidth = sWidth
  dHeight = sHeight

  const isResultPotrait = (dWidth < dHeight)
  const isResultLandscape = (dWidth >= dHeight)
  const max = form.value.max

  if (isResultPotrait && dHeight > max) {
    dWidth = (max / dHeight) * dWidth
    dHeight = max
  }
  if (isResultLandscape && dWidth > max) {
    dHeight = (max / dWidth) * dHeight
    dWidth = max
  }

  canvasElement.value.width = dWidth
  canvasElement.value.height = dHeight
  const ctx = canvasElement.value.getContext('2d')
  ctx.drawImage(imageData.value, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight)
  previewURL.value = canvasElement.value.toDataURL("image/webp", form.value.quality)
  canvasElement.value.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    clickPreview.value.href = url
  }, 'image/webp', form.value.quality)  
}

const drawThumbnail = async () => {
  let imgW = imageData.value.width
  let imgH = imageData.value.height
  const minSize = Math.min(imgW, imgH)
  const ctx = canvasThumbnailElement.value.getContext('2d')
  canvasThumbnailElement.value.width = 100
  canvasThumbnailElement.value.height = 100
  const sX = (imgW/2) - (minSize/2)
  const sY = (imgH/2) - (minSize/2)
  ctx.drawImage(imageData.value, sX, sY, minSize, minSize, 0, 0, 100, 100)
  thumbnailURL.value = canvasThumbnailElement.value.toDataURL("image/webp", 0.8)
}

const misc = useMiscStore()
const upload = async () => {
  form.value.isSending = true
  await drawThumbnail()
  apiReq('post', `/sites/${misc.activeSite.id}/images`, {
    data: previewURL.value,
    description: form.value.description,
    thumbnail: thumbnailURL.value,
  })
  .then(res => {
    emit('uploaded', res.data.path)
    reset()
  })
  .catch(handleErrorApi)
  .finally(() => {
    form.value.isSending = false
  })
}

const reset = () => {
  imageData.value = null
  previewURL.value = ''
  thumbnailURL.value = ''
}

const cancel = () => {
  emit('uploaded', 0)
  reset()
}

onMounted(() =>{
  processFile()
})
</script>

<template>
  <canvas ref="canvasElement" class="d-none"></canvas>
  <canvas ref="canvasThumbnailElement" class="d-none"></canvas>
  <div class="row justify-content-center">
    <div class="col-lg-6">
      <div class="bg-white border shadow p-3">
        <div class="table-responsive text-center mb-0 border bg-light mb-3" style="max-height: 40vh;">
          <table class="w-100">
            <tbody>
              <tr>
                <td>
                  <a href="#" ref="clickPreview" target="_blank" rel="noopener noreferrer">
                    <img :src="previewURL" alt="preview">
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="mb-3">
            <label class="form-label">Ratio</label>
            <select class="form-control form-control-sm" v-model="form.ratio" @change="drawImage">
              <option v-for="r,i in ratioList" :value="r" :key="i">{{ i }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Max Size</label>
            <select class="form-control form-control-sm" v-model="form.max" @change="drawImage">
              <option v-for="s,i in sizeList" :key="i" :value="s">{{ s }}px</option>
            </select>
          </div>
          <div class="d-flex gap-3">
            <button class="btn btn-sm btn-light border w-100" @click="cancel">Cancel</button>
            <SubmitButton class="btn btn-sm btn-primary w-100" @click="upload" :sending="form.isSending">Upload</SubmitButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>