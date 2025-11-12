import { defineStore } from "pinia";
import { ref } from "vue";
import { apiReq, handleErrorApi, img } from "../helpers/fns";

export const useMiscStore = defineStore('misc', () => {
  const installed = ref(false)
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
    document.title = config.value.site_name
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = img(config.value.site_icon);
    let linkCss = document.getElementById('main-css')
    if (linkCss) {
      if (config.value.site_theme == 'default') {
        linkCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'
      } else {
        const theme = config.value.site_theme
        linkCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/'+theme+'/bootstrap.min.css'
      }
    }
  }

  return {
    installed,
    config,
    getConfig,
    setConfig,
  }
})