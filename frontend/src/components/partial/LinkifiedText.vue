<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String }
})
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkify(text) {
  // cari potensi URL (dengan http/https)
  return text.replace(/https?:\/\/[^\s]+/gi, (rawUrl) => {
    // pisahkan trailing punctuation yang umum muncul di akhir kalimat/kurung
    const m = rawUrl.match(/^(.*?)([.,!?;:)\]\}'"]*)$/);
    const url = m ? m[1] : rawUrl;
    const trail = m ? m[2] : '';

    // escape untuk menghindari injection
    const safeUrl = escapeHtml(url);
    const display = safeUrl;

    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${display}</a>${escapeHtml(trail)}`;
  });
}

const linkedText = computed(() => {
  const escaped = escapeHtml(props.text);
  return linkify(escaped)
})
</script>

<template>
  <div v-if="props.text" v-html="linkedText" style="white-space: pre-line;"></div>
</template>
