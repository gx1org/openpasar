<script setup>
import AllTransactionView from '../../views/admin/AllTransactionView.vue';
import { useMiscStore } from '../../stores/misc';
import { useAuthStore } from '../../stores/auth';
import LoginView from '~/views/LoginView.vue';
const auth = useAuthStore()
const misc = useMiscStore()
useHead({
  title: 'Semua Transaksi | ' + misc.config.site_name,
})
</script>
<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <AllTransactionView v-else-if="auth.isAdmin" />
    <div v-else class="card text-center p-3">
      Kamu bukan admin
    </div>
  </div>
</template>