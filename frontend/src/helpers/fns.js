import axios from "axios"
import { apiURL } from './constant'
import { useAuthStore } from "../stores/auth"
const pad = (n) => n.toString().padStart(2, '0');

export const formatDate = (time) => {
  if (!time) return '';
  return new Date(time).toLocaleDateString('id-ID', {
    dateStyle: 'medium'
  });
}

export const formatDateTime = (time) => {
  if (!time) return '';
  const datePart = new Date(time).toLocaleDateString('id-ID', {
    dateStyle: 'medium',
  });
  const timePart = new Date(time).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${datePart} ${timePart}`
}

export const handleErrorApi = (err) => {
  const store = useAuthStore()
  if (!err.response) {
    alert('Client error')
    console.error(err);
    return
  }

  if ([401].includes(err.response.status)) {
    store.setLogout()
    alert(err.response.data.message || err.response.data)
    return
  }

  if (!err.response.data) {
    alert('Internal server error')
    console.error(err);
  } else {
    console.log(err.response.data);
    alert(err.response.data.message || err.response.data)
  }
}

const api = axios.create({
  baseURL: apiURL,
})
api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

export const apiReq = (method, url, payload, config = {}) => {
  return api({
    method, 
    url,
    data: payload,
    config
  })
}

export function createPermalink(str) {
  if (!str) return ''
  return str.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
}

export function Rp(int) {
  if (int == null || typeof int == 'undefined') {
    return 'Rp -'
  }
  return 'Rp ' + int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function img(url) {
  if (url.toString().includes(',')) {
    url = url.split(',')[0]
  }
  return url || '/noimage.png'
}
