import { defineStore } from "pinia";
import { ref } from "vue";
import { apiReq, handleErrorApi, img } from "../helpers/fns";

export const useMiscStore = defineStore('misc', () => {
  const config = ref({})
  const getConfig = async () => {
    const ok = await apiReq('get', 'config').then(res => {
      config.value = res.data.config
      setIdentity()
      return true
    })
    .catch(handleErrorApi)

    return ok
  }

  const setIdentity = () => {
    document.title = config.value.site_name
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = img(config.value.site_icon);
  }

  return {
    config,
    getConfig,
  }
})