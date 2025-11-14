import { defineNuxtRouteMiddleware, navigateTo } from '#app'
// import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.client) {
    return
  }
  
  const auth = useAuthStore()
  if (!auth.accessToken) {
    auth.accessToken = localStorage.getItem('token')
  }

  if (to.query.auth_code) {
    if (await auth.authorize(to.query)) {
      auth.isLoading = false
    }
    const query = new URLSearchParams(window.location.search)
    query.delete('auth_code')
    return navigateTo(to.path + '?' + query.toString())
  }


  // Refresh token jika perlu
  if (auth.isLoading && auth.accessToken) {
    await auth.refreshAccessToken()
  }

  auth.isLoading = false
})
