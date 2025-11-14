import { defineStore } from "pinia";
import { ref } from "vue";

export const useMiscStore = defineStore('misc', () => {
  const installed = ref(false)
  const loaded = ref(false)
  const config = ref({})
  const getConfig = async () => {
    const apiUrl = useRuntimeConfig().public.apiUrl
    const res = await fetch(apiUrl+'/api/config').then(res => {
      if (res.ok) {
        return res.json()
      }
    })
    .catch(e => {
      console.error(e)
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
    config,
    getConfig,
    setConfig,
  }
})