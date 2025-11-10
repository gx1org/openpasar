import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import SearchView from '../views/SearchView.vue'
import CartView from '../views/CartView.vue'
import AccountView from '../views/AccountView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuthStore } from '../stores/auth'
import { useMiscStore } from '../stores/misc'
import OrderView from '../views/OrderView.vue'
import ConfigView from '../views/admin/ConfigView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Index', component: IndexView, meta: {} },
    { path: '/search', name: 'Search', component: SearchView, meta: {} },
    { path: '/cart', name: 'Cart', component: CartView, meta: { requireAuth: true } },
    { path: '/orders', name: 'Order', component: OrderView, meta: { requireAuth: true } },
    { path: '/orders/:id', name: 'OrderDetail', component: OrderDetailView, meta: { requireAuth: true } },
    { path: '/account', name: 'Account', component: AccountView, meta: { requireAuth: true } },

    { path: '/admin/config', name: 'Config', component: ConfigView, meta: { requireAuth: true, requireAdmin: true } },

    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView  }
   ],
})

router.beforeEach(() => {
  const anyModalOpened = document.querySelector('.modal-backdrop.fade.show')
  if (anyModalOpened) {
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(v => v.click())
    if (event && event.type == 'popstate') {
      return false;
    }
  }
})

router.beforeResolve(async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.accessToken) {
    auth.accessToken = localStorage.getItem('token')
  }

  if (to.query.auth_code) {
    if (await auth.authorize(to.query)) {
      auth.isLoading = false
    }
    const query = new URLSearchParams(location.search)
    query.delete('auth_code')
    next(to.path+'?'+query.toString())
    return
  }

  const misc = useMiscStore()
  if (!misc.config.site_name) {
    if (!(await misc.getConfig())) {
      return
    }
  }

  if (auth.isLoading && auth.accessToken) {
    await auth.refreshAccessToken()
  }

  auth.isLoading = false
  next()
})

export default router
