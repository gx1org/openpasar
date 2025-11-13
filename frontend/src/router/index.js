import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import SearchView from '../views/SearchView.vue'
import StoreSearchView from '../views/StoreSearchView.vue'
import StoreDetailView from '../views/StoreDetailView.vue'
import CartView from '../views/CartView.vue'
import AccountView from '../views/AccountView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuthStore } from '../stores/auth'
import { useMiscStore } from '../stores/misc'
import OrderView from '../views/OrderView.vue'
import ConfigView from '../views/admin/ConfigView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import WithdrawalView from '../views/WithdrawalView.vue'
import SaleView from '../views/seller/SaleView.vue'
import SaleDetailView from '../views/seller/SaleDetailView.vue'
import ProductView from '../views/seller/ProductView.vue'
import AllTransactionView from '../views/admin/AllTransactionView.vue'
import AllProductView from '../views/admin/AllProductView.vue'
import AllStoreView from '../views/admin/AllStoreView.vue'
import AllUserView from '../views/admin/AllUserView.vue'
import FeaturedProductView from '../views/admin/FeaturedProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Index', component: IndexView, meta: {} },
    { path: '/search', name: 'Search', component: SearchView, meta: {} },
    { path: '/stores', name: 'StoreSearch', component: StoreSearchView, meta: { } },
    { path: '/stores/:id', name: 'StoreDetail', component: StoreDetailView, meta: { } },
    { path: '/cart', name: 'Cart', component: CartView, meta: { requireAuth: true } },
    { path: '/orders', name: 'Order', component: OrderView, meta: { requireAuth: true } },
    { path: '/orders/:id', name: 'OrderDetail', component: OrderDetailView, meta: { requireAuth: true } },
    { path: '/account', name: 'Account', component: AccountView, meta: { requireAuth: true } },
    { path: '/withdrawals', name: 'Withdrawal', component: WithdrawalView, meta: { requireAuth: true } },

    { path: '/sales', name: 'Sale', component: SaleView, meta: { requireAuth: true } },
    { path: '/sales/:id', name: 'SaleDetail', component: SaleDetailView, meta: { requireAuth: true } },
    { path: '/products', name: 'Product', component: ProductView, meta: { requireAuth: true } },

    { path: '/admin/all-transactions', name: 'AllTransaction', component: AllTransactionView, meta: { requireAuth: true, requireAdmin: true } },
    { path: '/admin/all-products', name: 'AllProduct', component: AllProductView, meta: { requireAuth: true, requireAdmin: true } },
    { path: '/admin/all-stores', name: 'AllStore', component: AllStoreView, meta: { requireAuth: true, requireAdmin: true } },
    { path: '/admin/all-users', name: 'AllUser', component: AllUserView, meta: { requireAuth: true, requireAdmin: true } },
    { path: '/admin/featured-products', name: 'FeaturedProduct', component: FeaturedProductView, meta: { requireAuth: true, requireAdmin: true } },
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
