<script setup>
import TransactionDetailView from '../../../views/admin/TransactionDetailView.vue';
import { useMiscStore } from '../../../stores/misc';
import { useAuthStore } from '../../../stores/auth';
import LoginView from '~/views/LoginView.vue';
import { useRoute } from 'nuxt/app';
const route = useRoute()
const auth = useAuthStore()
const misc = useMiscStore()
useHead({
  title: 'Transaksi #' + route.params.id + ' | ' + misc.config.site_name,
})
</script>
<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <TransactionDetailView v-if="auth.isAdmin" />
    <div v-else class="card text-center p-3">
      Kamu bukan admin
    </div>
  </div>
</template>