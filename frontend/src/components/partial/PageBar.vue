<script setup>
import { computed, ref } from 'vue';

const limit = ref(10)
const prop = defineProps({
  page: Number,
  totalData: Number
})
const emits = defineEmits([
  'navigate',
])

const lastPage = computed(() => {
  return Math.ceil(prop.totalData / limit.value)
})
</script>

<template>
  <nav v-if="totalData > limit" class="my-3">
    <ul class="pagination justify-content-center pagination-sm">
      <li class="page-item" :class="{disabled: prop.page == 1}">
        <a class="page-link" href="javascript:;" aria-label="Previous" @click="emits('navigate', 'prev')">
          <span aria-hidden="true">Prev</span>
        </a>
      </li>
      <li class="page-item active"><a class="page-link" href="javascript:;">{{ prop.page }} of {{ lastPage }}</a></li>
      <li class="page-item" :class="{disabled: prop.page == lastPage}">
        <a class="page-link" href="javascript:;" aria-label="Next" @click="emits('navigate', 'next')">
          <span aria-hidden="true">Next</span>
        </a>
      </li>
    </ul>
  </nav>
</template>