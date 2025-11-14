import { defineStore } from "pinia";
import { ref } from "vue";
import { apiReq, handleErrorApi, img } from "../utils/fns";

export const useMiscStore = defineStore('misc', () => {
  const installed = ref(false)
  const loaded = ref(false)
  const config = ref({})
  const getConfig = async () => {
    const ok = await apiReq('get', 'config').then(res => {
      setConfig(res.data.config)
      return true
    })
    .catch(handleErrorApi)

    return ok
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