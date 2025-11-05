<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import { useAuthStore } from '../stores/auth';

const link = ref('')
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const authCode = ref('')

const authorize = () => {
  const qs = new URLSearchParams(location.search)
  authCode.value = qs.get('auth_code')
  if (!authCode.value) {
    return
  }

  apiReq('post', '/authorize', {
    code: authCode.value
  }).then(res => {
    auth.setAuth(res.data)
    qs.delete('auth_code')
    router.replace(route.path+'?'+qs.toString())
  })
  .catch(handleErrorApi)
}

const getOnboardingLink = () => {
  const redir = `?callback_url=${encodeURIComponent(location.href)}`
  apiReq('get', '/authurl').then(r => {
    link.value = r.data.url + redir
  })
  .catch(handleErrorApi)
}

onMounted(() => {
  if (!link.value) {
    getOnboardingLink()
  }
  authorize()
})
</script>

<template>
  <div>
    <h5 class="text-center mt-3">Login to continue!</h5>
    <div class="text-center p-4">
      <template v-if="!authCode">
        <p class="mb-2">
          <a :href="link" class="btn btn-outline-primary">
            <span class="ms-0">
              Login with Kunber
            </span>
          </a>
        </p>
        <p class="small text-muted"></p>
      </template>
      <template v-else>
        <span class="spinner-border text-muted" role="status" aria-hidden="true"></span>
      </template>
    </div>
  </div>
</template>