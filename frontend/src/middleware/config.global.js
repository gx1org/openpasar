import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useMiscStore } from '../stores/misc'

export default defineNuxtRouteMiddleware(async (to) => {
  const misc = useMiscStore()
  if (!misc.config.site_name) {
    if (!(await misc.getConfig())) return
  }
})
