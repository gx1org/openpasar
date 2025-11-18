<script setup>
import InfoModal from './components/modal/InfoModal.vue'
import FooterBar from './components/partial/FooterBar.vue'
import NavBar from './components/partial/NavBar.vue'
import { useMiscStore } from './stores/misc'
import { setTheme } from './utils/fns'

const props = defineProps({
  error: Object
})
const misc = useMiscStore()
if (!misc.config.site_name) {
  await misc.getConfig()
}
setTheme()
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="container">
    <NavBar />
    <main class="bg-light px-3 d-flex flex-column overflow-y-auto pb-4">
      <div class="text-center card">
        <div class="card-header">Error!</div>
        <div class="card-body">
          <p class="mb-2">Halaman Tidak Ditemukan</p>
          <button
            class="btn btn-primary"
            @click="handleError"
          >
            Ke Beranda
          </button>
        </div>
      </div>
    </main>
    <FooterBar />
    <InfoModal />
  </div>
</template>
