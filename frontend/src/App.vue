<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth';
import SideBar from './components/partial/SideBar.vue';
import NavBar from './components/partial/NavBar.vue';
import FooterBar from './components/partial/FooterBar.vue';
import { useMiscStore } from './stores/misc';
import { watch } from 'vue';

const auth = useAuthStore()
</script>

<template>
  <div class="container">
    <NavBar />
    <main class="bg-light px-3 d-flex flex-column overflow-y-auto">
      <RouterView class="h-100" style="" />
      <p class="text-muted small mb-3 pt-5 text-center mt-auto">
        Powered by
        <a href="https://github.com/gx1org/openpasar" target="_blank" class="text-reset">
          OpenPasar
          <i class="bi bi-github"></i>
        </a>
      </p>
    </main>
    <FooterBar />
  </div>
</template>
