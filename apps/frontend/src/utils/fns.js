import axios from "axios"
import { useAuthStore } from "../stores/auth"
import { useRuntimeConfig } from "nuxt/app";

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
  const isClient = process.client
  const store = useAuthStore()
  if (!err.response) {
    isClient && alert('Client error')
    console.error(err);
    return
  }

  if ([401].includes(err.response.status)) {
    store.setLogout()
    isClient && alert(err.response.data.message || err.response.data)
    return
  }

  if (!err.response.data) {
    isClient && alert('Internal server error')
    console.error(err);
  } else {
    console.error(err.response.data);
    isClient && alert(err.response.data.message || err.response.data)
  }
}


export const apiReq = (method, url, payload, config = {}) => {
  const apiUrl = useRuntimeConfig().public.apiUrl
  const api = axios.create({
    baseURL: apiUrl+'/api',
  })
  api.interceptors.request.use(config => {
    const auth = useAuthStore()
    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    return config
  })
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
  if (url?.toString().includes(',')) {
    url = url.split(',')[0]
  }
  return url || '/noimage.png'
}

export const setTheme = () => {
  const misc = useMiscStore()
  let linkCss = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css'
  
  if (misc.config?.site_theme && misc.config?.site_theme != 'default') {
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

export function normalizePhone(number) {
  if (!number) return "";

  // Hapus spasi, dash, dan tanda baca lain
  let cleaned = number.replace(/[^0-9+]/g, "");
  // Jika diawali +62 → langsung oke
  if (cleaned.startsWith("+62")) {
    return cleaned;
  }
  // Jika diawali 62 → tambahkan +
  if (cleaned.startsWith("62")) {
    return "+" + cleaned;
  }
  // Jika diawali 08 → ubah 08... menjadi +628...
  if (cleaned.startsWith("08")) {
    return "+62" + cleaned.substring(1);
  }
  // Jika diawali 8 (tanpa 0) → +628...
  if (cleaned.startsWith("8")) {
    return "+62" + cleaned;
  }

  return cleaned;
}

export function normalizePin(input) {
  return input.replace(/\D/g, '').slice(0, 6);
}