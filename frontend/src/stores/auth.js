import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiReq, handleErrorApi } from '../helpers/fns'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(true)
  const accessToken = ref('')
  const user = ref({})
  const store = ref({})
  const role = ref('')
  const isLogin = computed(() => user.value.id)

  const refreshAccessToken = async () => {
    if (!accessToken.value) {
      accessToken.value = localStorage.getItem('token')
    }
    await apiReq('post', '/refresh-token', { token: accessToken.value }).then(async res => {
      await setAuth(res.data)
    }).catch(() => {
      setLogout()
    })
  }

  const authorize = async (param) => {
    return await apiReq('post', '/authorize', param).then(async res => {
      setAuth(res.data)
      return true
    })
    .catch(e => {
      handleErrorApi(e)
      return false
    })
  }

  const setAuth = async (data) => {
    role.value = data.role
    user.value = data.user
    store.value = data.store || {}
    accessToken.value = data.token
    localStorage.setItem('token', data.token)
  }

  const setLogout = () => {
    user.value = {}
    accessToken.value = ''
    role.value = ''
  }


  return {
    user,
    store,
    role,
    isLogin,
    isLoading,
    accessToken,
    refreshAccessToken,
    authorize,
    setAuth,
    setLogout,
  }
})
