import axios from "axios"
import { apiURL } from './constant'
import { useAuthStore } from "../stores/auth"
const pad = (n) => n.toString().padStart(2, '0');

export const formatDate = (time) => {
  if (!time) return '';
  if (!(time instanceof Date)) {
    time = new Date(time)
  }
  const year = time.getFullYear();
  const month = pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  return `${year}-${month}-${day}`;
}

export const formatDateTime = (time) => {
  if (!time) return '';
  if (!(time instanceof Date)) {
    time = new Date(time)
  }
  const year = time.getFullYear();
  const month = pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
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
  return url ?? '/noimage.png'
}

export function processIcon(e) {
  if (!e.files[0]) return;

  window.imageLoaded = ''
  var file = e.files[0]
  var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (event) {
        // blob stuff
        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL
    
        // helper Image object
        var image = new Image();
        image.src = blobURL;
        image.onload = function() {
            // have to wait till it's loaded
            var resized = resizeIcon(image); // send it to canvas
            window.imageLoaded = resized
            const event = new Event('image:loaded');
            window.dispatchEvent(event)
        }
    };
}

function resizeIcon(img) {
  var canvas = document.createElement('canvas');
  canvas.width = 128
  canvas.height = 128
  var iw = canvas.width
  var pw = (iw / img.width)
  var ih = img.height * pw
  var ch = canvas.height
  var dy = - ((ih/2) - (ch/2))

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, dy, iw, ih)
  return canvas.toDataURL("image/png", 1)
}