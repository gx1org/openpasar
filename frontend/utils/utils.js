import { useMiscStore } from "../stores/misc"
import { img } from "./fns"

export const setTheme = () => {
  const misc = useMiscStore()
  let linkCss = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'
  if (misc.config.site_theme != 'default') {
    const theme = misc.config.site_theme
    linkCss = 'https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.8/'+theme+'/bootstrap.min.css'
  }

  useHead({
    link: [
      {
        rel: "stylesheet",
        href: linkCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: img(misc.config.site_icon)
      }
    ],
  })
}