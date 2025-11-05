<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import GalleryModal from '../modal/GalleryModal.vue';
import { onBeforeRouteLeave } from 'vue-router';

const props = defineProps({
  savingKey: Number
})

const model = defineModel()
const simpleMDE = ref(null)
const isDirty = ref(false);
const savingKey = ref(0)

const cmForImage = ref(null)
const galleryKey = ref(0)
const updateFromGallery = (url) => {
  galleryKey.value++
  const doc = cmForImage.value.getDoc();
  const cursor = doc.getCursor();
  const str = `\n![image](${url})\n\n`
  doc.replaceRange(str, cursor);
}

const customImageLoader = {
  name: 'image',
  action: async (editor) => {
    cmForImage.value = editor.codemirror;
    document.getElementById('galleryBtn').click()
  },
  className: "fa fa-picture-o",
  title: "Insert Custom Image"
}

const handleBeforeUnload = (e) => {
  if (isDirty.value) {
    e.preventDefault();
    e.returnValue = "";
  }
};

const initSimpleMDE = () => {
  simpleMDE.value = new window.SimpleMDE({
    element: document.getElementById("simplemde"),
    spellChecker: false,
    hideIcons: ["guide", "side-by-side", "fullscreen"],
    blockStyles: {
      bold: "**",
      italic: "_"
    },
    status: false,
    promptURLs: true,
    toolbar: [
      'bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', customImageLoader, 'table', '|', 'preview', 'guide'
    ],
    indentWithTabs: false,
  });
  
  simpleMDE.value.codemirror.on('change', () => {
    const v = simpleMDE.value.value()
    model.value = v
    isDirty.value = true
  })
}

const handleSavingKey = () => {
  if (savingKey.value != props.key) {
    isDirty.value = false
  }
  savingKey.value = props.savingKey
}

watch(() => props.savingKey, () => {
  handleSavingKey()
})

onMounted(() => {
  initSimpleMDE()
  handleSavingKey()
  window.addEventListener("beforeunload", handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.addEventListener("beforeunload", handleBeforeUnload)
})

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    if (confirm("Changes you made may not be saved. Discard it?")) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});
</script>

<template>
  <div class="article">
    <textarea id="simplemde" @input="textt" :value="model"></textarea>
  </div>
  <button data-bs-toggle="modal" data-bs-target="#GalleryModal" class="d-none" id="galleryBtn"></button>
  <GalleryModal @selected="updateFromGallery" :key="galleryKey" />
</template>