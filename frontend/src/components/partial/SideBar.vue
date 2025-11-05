<script setup>
import { ref } from 'vue';
import { useMiscStore } from '../../stores/misc';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter()
const auth = useAuthStore()
const misc = useMiscStore()
const adminRoutes = ref([
  {
    title: 'Transaksi',
    path: '/admin-transactions',
    icon: 'chat-left',
  },
  {
    title: 'Pembeli',
    path: '/admin-buyers',
    icon: 'person-check',
  },
  {
    title: 'Produk Master',
    path: '/admin-product-masters',
    icon: 'folder',
  },
  {
    title: 'Toko',
    path: '/admin-stores',
    icon: 'file-text',
  },
])

const sellerRoutes = ref([
  {
    title: 'Transaksi',
    path: '/transactions',
    icon: 'table',
  },
  {
    title: 'Pembeli',
    path: '/buyers',
    icon: 'person-check',
  },
  {
    title: 'Produk',
    path: '/products',
    icon: 'palette',
  },
  {
    title: 'Pengaturan Toko',
    path: '/stores',
    icon: 'sliders',
  },
])
const showSidebar = ref(false)
</script>

<template>
  <div class="bg-secondary" id="sidebar-blocker">&nbsp;</div>
  <div v-if="showSidebar" style="background-color: rgba(0,0,0,0.2);" id="sidebar-backdrop" class="d-lg-none container" @click="showSidebar = !showSidebar">&nbsp;</div>
  <button class="container btn btn-dark d-lg-none fixed-top" @click="showSidebar = !showSidebar" id="sidebar-btn">
    {{ showSidebar ? '&LeftAngleBracket;' : '&RightAngleBracket;' }} Menu
  </button>
  <nav class="navbar navbar-dark bg-dark" :class="{show: showSidebar}" id="sidebar">
    <ul  class="navbar-nav w-100 mt-2 mb-auto">
      <template v-if="auth.role == 'admin' || auth.role == 'owner'">
        <li class="nav-link"><b class="small">Admin Menu</b></li>
        <li class="nav-item" v-for="r,i in adminRoutes" :key="i" @click="showSidebar = !showSidebar">
          <RouterLink :to="r.path" class="nav-link" :class="{active: r.path == $route.path}">
            <i :class="`bi bi-${r.icon} me-2`"></i>
            {{ r.title }}
          </RouterLink>
        </li>
      </template>
      <li class="nav-link"><b class="small">Seller Menu</b></li>
      <li class="nav-link">
        <select class="form-control bg-dark form-control-sm">
          <option v-for="s in misc.stores" :key="s.id" :value="s.id">
            {{ s.name }}
          </option>
        </select>
      </li>
      <template v-if="misc.activeStore">
        <li class="nav-item" v-for="r,i in sellerRoutes" :key="i" @click="showSidebar = !showSidebar">
          <RouterLink :to="r.path" class="nav-link" :class="{active: r.path == $route.path}">
            <i :class="`bi bi-${r.icon} me-2`"></i>
            {{ r.title }}
          </RouterLink>
        </li>
      </template>
    </ul>
  </nav>
</template>