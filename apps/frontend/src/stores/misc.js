import { defineStore } from "pinia";
import { ref } from "vue";

export const useMiscStore = defineStore('misc', () => {
  const installed = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const config = ref({})
  const getConfig = async () => {
    const apiUrl = useRuntimeConfig().public.apiUrl
    if (!apiUrl) {
      error.value = 'Missing ENV variable: API_URL'
      return false
    }

    const res = await fetch(apiUrl+'/api/config').then(res => {
      if (res.ok) {
        return res.json()
      }
    })
    .catch(e => {
      console.error(e)
      error.value = `Cannot fetch data from API server (${apiUrl})`
      return false
    })

    if (res) {
      setConfig(res.config)
      return true
    }

    return false
  }

  const setConfig = (c) => {
    config.value = c
    installed.value = c.installed == 'yes'
    loaded.value = true
  }

  return {
    installed,
    loaded,
    error,
    config,
    getConfig,
    setConfig,
  }
})