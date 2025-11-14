<script setup>
import NavBar from './components/partial/NavBar.vue';
import FooterBar from './components/partial/FooterBar.vue';
import { useMiscStore } from './stores/misc';
import ConfigView from './views/admin/ConfigView.vue';
import InfoModal from './components/modal/InfoModal.vue';
import { setTheme } from './utils/utils';

const misc = useMiscStore()
setTheme()
</script>

<template>
  <div class="container">
    <main v-if="!misc.installed" class="bg-light px-3 d-flex flex-column overflow-y-auto mb-0 py-4">
      <ConfigView />
    </main>
    <template v-else>
      <NavBar />
      <main class="bg-light px-3 d-flex flex-column overflow-y-auto pb-4">
        <NuxtPage class="h-100" />
      </main>
      <FooterBar />
      <InfoModal />
    </template>
  </div>
</template>
