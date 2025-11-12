<script setup>
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth';
import NavBar from './components/partial/NavBar.vue';
import FooterBar from './components/partial/FooterBar.vue';
import { useMiscStore } from './stores/misc';
import LoginView from './views/LoginView.vue';
import ConfigView from './views/admin/ConfigView.vue';
import InfoModal from './components/modal/InfoModal.vue';

const auth = useAuthStore()
const misc = useMiscStore()
const route = useRoute()
</script>

<template>
  <div v-if="!auth.isLoading" class="container">
    <main v-if="!misc.installed" class="bg-light px-3 d-flex flex-column overflow-y-auto mb-0 py-4">
      <ConfigView />
    </main>
    <template v-else>
      <NavBar />
      <main class="bg-light px-3 d-flex flex-column overflow-y-auto pb-4">
        <LoginView v-if="!auth.isLogin && route.meta.requireAuth"/>
        <RouterView v-else class="h-100" style="" />
      </main>
      <FooterBar />
      <InfoModal />
    </template>
  </div>
</template>
