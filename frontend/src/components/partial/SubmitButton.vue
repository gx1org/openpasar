<script setup>
const emit = defineEmits(['click'])
const prop = defineProps({
  sending: Boolean,
  disabled: Boolean,
  class: String,
})
</script>

<template>
  <button @click="emit('click')" type="button"
    :class="prop.class" 
    :disabled="prop.disabled || prop.sending"
  >
    <span v-if="prop.sending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span v-else><slot></slot></span>
  </button>
</template>
