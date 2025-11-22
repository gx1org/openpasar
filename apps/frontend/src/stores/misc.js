import { defineStore } from "pinia";
import { ref } from "vue";

export const useMiscStore = defineStore('misc', () => {
  const installed = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const config = ref({})
  const getConfig = async () => {
    const url = apiUrl()
    if (!url) {
      error.value = 'Missing ENV variable: API_URL'
      return false
    }

    const res = await fetch(url+'/api/config').then(res => {
      if (res.ok) {
        return res.json()
      }
    })
    .catch(e => {
      console.error(e)
      error.value = `Cannot fetch data from API server (${url})`
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