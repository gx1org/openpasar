<script setup>
import AccountView from '../views/AccountView.vue'
import { useMiscStore } from '../stores/misc';
import { useAuthStore } from '../stores/auth';
const misc = useMiscStore()
useHead({
  title: 'Akun | ' + misc.config.site_name,
})
const auth = useAuthStore()
definePageMeta({
  requireAuth: true
})
</script>
<template>
  <AccountView v-if="!auth.isLoading"/>
</template>