import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import CreateView from '../views/CreateView.vue'
import PostView from '../views/PostView.vue'
import PostEditorView from '../views/PostEditorView.vue'
import SearchView from '../views/SearchView.vue'
import DirectoryEditorView from '../views/DirectoryEditorView.vue'
import ContentView from '../views/ContentView.vue'
import DatasetView from '../views/DatasetView.vue'
import DatasetEditorView from '../views/DatasetEditorView.vue'
import TemplateView from '../views/TemplateView.vue'
import TemplateEditorView from '../views/TemplateEditorView.vue'
import SettingView from '../views/SettingView.vue'
import AdminView from '../views/AdminView.vue'
import ProfileView from '../views/ProfileView.vue'
import CommentView from '../views/CommentView.vue'
import CommentDetailView from '../views/CommentDetailView.vue'
import ActivationView from '../views/ActivationView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuthStore } from '../stores/auth'
import { useMiscStore } from '../stores/misc'
import { apiReq, handleErrorApi } from '../helpers/fns'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: IndexView,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/create',
      name: 'Create',
      component: CreateView,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/posts',
      name: 'Post',
      component: PostView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/posts/:id',
      name: 'PostEditor',
      component: PostEditorView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchView,
      meta: {
      },
    },
    {
      path: '/directories/:id',
      name: 'DirectoryEditor',
      component: DirectoryEditorView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/posts/:id/contents',
      name: 'Content',
      component: ContentView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/datasets',
      name: 'Dataset',
      component: DatasetView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/datasets/:id',
      name: 'DatasetEditor',
      component: DatasetEditorView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/templates',
      name: 'Template',
      component: TemplateView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/templates/edit',
      name: 'TemplateEditor',
      component: TemplateEditorView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/settings',
      name: 'Setting',
      component: SettingView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/comments',
      name: 'Comment',
      component: CommentView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/comments/:id',
      name: 'CommentDetail',
      component: CommentDetailView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/admins',
      name: 'Admin',
      component: AdminView,
      meta: {
        requireAuth: true,
        requireSite: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/activation',
      name: 'Activation',
      component: ActivationView,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView
    }
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

const getOnboardingLink = async () => {
  return await apiReq('get', '/authurl').then(r => {
    return r.data.url + redir
  })
  .catch(handleErrorApi)
}

router.beforeResolve(async (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.accessToken) {
    auth.accessToken = localStorage.getItem('token')
  }

  const misc = useMiscStore()
  if (!misc.config.site_name) {
    if (!(await misc.getConfig())) {
      return
    }
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

  if (auth.isLoading && auth.accessToken) {
    await auth.refreshAccessToken()
  }

  if (to.meta.requireAuth && !auth.isLogin) {
    const redir = `?callback_url=${encodeURIComponent(location.origin)}`
    const link = `https://autz.org/onboarding/${misc.config.autzorg_app_id}${redir}`
    location.href = link
    return
  } else {
    auth.isLoading = false
    next()
  }
})

export default router
