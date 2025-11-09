import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import SearchView from '../views/SearchView.vue'
import CartView from '../views/CartView.vue'
import PostView from '../views/PostView.vue'
import PostEditorView from '../views/PostEditorView.vue'
import DirectoryEditorView from '../views/DirectoryEditorView.vue'
import ContentView from '../views/ContentView.vue'
import DatasetView from '../views/DatasetView.vue'
import DatasetEditorView from '../views/DatasetEditorView.vue'
import TemplateView from '../views/TemplateView.vue'
import TemplateEditorView from '../views/TemplateEditorView.vue'
import SettingView from '../views/SettingView.vue'
import AdminView from '../views/AdminView.vue'
import AccountView from '../views/AccountView.vue'
import CommentView from '../views/CommentView.vue'
import CommentDetailView from '../views/CommentDetailView.vue'
import ActivationView from '../views/ActivationView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuthStore } from '../stores/auth'
import { useMiscStore } from '../stores/misc'
import { apiReq, handleErrorApi } from '../helpers/fns'
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

    { path: '/posts/:id', name: 'PostEditor', component: PostEditorView, meta: { requireAuth: true } },
    { path: '/directories/:id', name: 'DirectoryEditor', component: DirectoryEditorView, meta: { requireAuth: true } },
    { path: '/posts/:id/contents', name: 'Content', component: ContentView, meta: { requireAuth: true } },
    { path: '/datasets', name: 'Dataset', component: DatasetView, meta: { requireAuth: true } },
    { path: '/datasets/:id', name: 'DatasetEditor', component: DatasetEditorView, meta: { requireAuth: true } },
    { path: '/templates', name: 'Template', component: TemplateView, meta: { requireAuth: true } },
    { path: '/templates/edit', name: 'TemplateEditor', component: TemplateEditorView, meta: { requireAuth: true } },
    { path: '/settings', name: 'Setting', component: SettingView, meta: { requireAuth: true } },
    { path: '/comments', name: 'Comment', component: CommentView, meta: { requireAuth: true } },
    { path: '/comments/:id', name: 'CommentDetail', component: CommentDetailView, meta: { requireAuth: true } },
    { path: '/admins', name: 'Admin', component: AdminView, meta: { requireAuth: true } },
    { path: '/activation', name: 'Activation', component: ActivationView, meta: { requireAuth: true } },
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
