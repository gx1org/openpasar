<script setup>
import { computed, onMounted, ref } from 'vue';
import { apiReq, createPermalink, handleErrorApi } from '../../utils/fns';
import SubmitButton from '../../components/partial/SubmitButton.vue';
import { useMiscStore } from '../../stores/misc';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';

const defaultForm = {
  site_name: 'OpenPasar',
  site_description: 'Marketplace and official store platform',
  site_icon: 'https://upld.zone.id/uploads/quay/openpasar.webp',
  site_mode: 'marketplace',
  site_theme: 'default',
  smtp_host: 'smtp.example.org',
  smtp_port: '587',
  smtp_user: 'user',
  smtp_password: '123123',
  smtp_from: 'noreply@example.org',
  autzorg_app_id: '',
  pakasir_slug: '',
  pakasir_api_key: '',
  seller_fee: 5,
  content_info: '',
  content_seller_rules: '',
  cronjob_secret: ''
}

const form = ref({})
const isSending = ref(false)
const misc = useMiscStore()

const isValidForm = computed(() => {
  return Boolean(
    form.value.site_mode
    && form.value.site_name
    && form.value.site_description
    && form.value.site_icon
    && form.value.site_theme
    && form.value.smtp_host
    && form.value.smtp_port
    && form.value.smtp_user
    && form.value.smtp_password
    && form.value.smtp_from
    && form.value.autzorg_app_id
    && form.value.pakasir_slug
    && form.value.pakasir_api_key
    && form.value.admin_email
    && form.value.admin_phone
    && form.value.content_info
    && form.value.content_seller_rules
    && form.value.cronjob_secret
    && form.value.seller_fee
  )
})

const isFetching = ref(true)
const fetchData = () => {
  isFetching.value = true
  apiReq('get', '/admin/config').then(res => {
    form.value = res.data.configs
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const router = useRouter()
const saveBtn = async () => {
  normalize()
  isSending.value = true
  apiReq('post', !misc.installed ? '/config' : '/admin/config', form.value)
    .then(async res => {
      if (isThemeChanged()) {
        location.href = '/account'
      } else {
        misc.setConfig(res.data.config)
        router.push('/account')
      }
    })
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

const isThemeChanged = () => {
  if (
    form.value.site_icon != misc.config.site_icon
    || form.value.site_theme != misc.config.site_theme
  ) {
    return true
  }
  return false
}

const handleChangeSecret = () => {
  form.value.cronjob_secret = createPermalink(form.value.cronjob_secret)
}

const normalize = () => {
  form.value.admin_phone = normalizePhone(form.value.admin_phone)
}

onMounted(() => {
  if (misc.installed) {
    fetchData()
  } else {
    form.value = defaultForm
    isFetching.value = false
  }
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">
        Konfigurasi
      </h5>
      <div v-if="misc.installed" class="ms-auto">
        <RouterLink to="/account" class="small">
          &larr; Akun
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <div v-else class="">
      <div class="p-3 border card bg-white mb-4">
        <p>Admin</p>
        <div class="mb-3">
          <label for="" class="form-label">Email</label>
          <input type="text" class="form-control" v-model="form.admin_email">
          <p class="mt-1 mb-0 small text-muted">
            Email ini yang menentukan akun admin.
          </p>
        </div>
        <div class="mb-3">
          <label for="" class="form-label">No. Whatsapp</label>
          <input type="text" class="form-control" v-model="form.admin_phone" @change="normalize">
          <p class="mt-1 mb-0 small text-muted">
            Nomor ini yang akan dihubungi pengguna jika ada masalah.
          </p>
        </div>
      </div>
      <div class="p-3 border card bg-white mb-4">
        <p>Platform</p>
        <div class="mb-3">
          <label for="" class="form-label">Mode</label>
          <select class="form-control" v-model="form.site_mode">
            <option value="marketplace">Marketplace</option>
            <option value="official_store">Official store</option>
          </select>
          <p class="mt-1 mb-0 small text-muted">
            {{ form.site_mode === 'marketplace' ?
            'Semua pengguna dapat membuat toko' :
            'Hanya admin yang dapat membuat toko' }}
          </p>
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Seller Fee (%)</label>
          <input type="number" class="form-control" v-model="form.seller_fee">
        </div>
      </div>
      <div class="p-3 border card bg-white mb-4">
        <p>Website</p>
        <div class="mb-3">
          <label for="" class="form-label">Nama</label>
          <input type="text" class="form-control" v-model="form.site_name">
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Deskripsi</label>
          <input type="text" class="form-control" v-model="form.site_description">
        </div>
        <div class="mb-3">
          <div class="d-flex">
            <label for="" class="form-label">Ikon</label>
            <a href="https://upld.zone.id" target="_blank" class="small ms-auto">Upld &nearr;</a>
          </div>
          <input type="text" class="form-control" v-model="form.site_icon">
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Tema</label>
          <select class="form-control" v-model="form.site_theme">
            <option value="default">default</option>
            <option value="cerulean">cerulean</option>
            <option value="cosmo">cosmo</option>
            <option value="flatly">flatly</option>
            <option value="lumen">lumen</option>
            <option value="litera">litera</option>
            <option value="minty">minty</option>
            <option value="sandstone">sandstone</option>
            <option value="simplex">simplex</option>
            <option value="spacelab">spacelab</option>
            <option value="united">united</option>
            <option value="yeti">yeti</option>
            <option value="zephyr">zephyr</option>
          </select>
        </div>
      </div>
      <div class="p-3 border card bg-white mb-4">
        <p>Integrasi</p>
        <div class="mb-3">
          <div class="d-flex">
            <label for="" class="form-label">Autz.org App ID</label>
            <a href="https://autz.org" target="_blank" rel="noopener noreferrer" class="small ms-auto">Autz.org &nearr;</a>
          </div>
          <input type="text" class="form-control" v-model="form.autzorg_app_id">
        </div>
        <div class="mb-3">
          <div class="d-flex">
            <label for="" class="form-label">Pakasir Slug</label>
            <a href="https://app.pakasir.com" target="_blank" rel="noopener noreferrer" class="small ms-auto">Pakasir &nearr;</a>
          </div>
          <input type="text" class="form-control" v-model="form.pakasir_slug">
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Pakasir Api Key</label>
          <input type="text" class="form-control" v-model="form.pakasir_api_key">
        </div>
        <div class="mb-3">
          <div class="d-flex">
            <label for="" class="form-label">Cronjob Secret</label>
            <a href="https://console.cron-job.org" target="_blank" rel="noopener noreferrer" class="small ms-auto">Cron-job.org &nearr;</a>
          </div>
          <input type="text" class="form-control" v-model="form.cronjob_secret" @change="handleChangeSecret">
        </div>
      </div>
      <div class="p-3 border card bg-white mb-4">
        <p>Email SMTP</p>
        <div class="mb-3">
          <label for="" class="form-label">Host</label>
          <input type="text" class="form-control" v-model="form.smtp_host">
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Port</label>
          <input type="text" class="form-control" v-model="form.smtp_port">
        </div>
        <div class="mb-3">
          <label for="" class="form-label">User</label>
          <input type="text" class="form-control" v-model="form.smtp_user">
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Password</label>
          <input type="text" class="form-control" v-model="form.smtp_password">
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Email from</label>
          <input type="text" class="form-control" v-model="form.smtp_from">
        </div>
      </div>
      <div class="p-3 border card bg-white mb-4">
        <p>Konten</p>
        <div class="mb-3">
          <label for="" class="form-label">Info dan Tentang Website</label>
          <textarea class="form-control" v-model="form.content_info" rows="5"></textarea>
        </div>
        <div class="mb-3">
          <label for="" class="form-label">Peraturan Menjadi Penjual</label>
          <textarea class="form-control" v-model="form.content_seller_rules" rows="5"></textarea>
        </div>
      </div>
    </div>
    <div v-if="!isFetching" class="d-flex gap-2">
      <SubmitButton @click="saveBtn" class="btn btn-primary w-100" :sending="isSending" :disabled="!isValidForm">
        Submit
      </SubmitButton>
    </div>
  </div>
</template>