<script setup>
import WithdrawalView from '../views/WithdrawalView.vue'
import { useMiscStore } from '../stores/misc';
import LoginView from '~/views/LoginView.vue';
const misc = useMiscStore()
const auth = useAuthStore()

useHead({
  title: 'Penarikan Saldo | ' + misc.config.site_name,
})
</script>

<template>
  <div v-if="!auth.isLoading">
    <LoginView v-if="!auth.isLogin"/>
    <WithdrawalView v-else />
  </div>
</template>