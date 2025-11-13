<script setup>
import EditPin from '../components/modal/EditPin.vue';
import EditProfile from '../components/modal/EditProfile.vue';
import EditStoreProfile from '../components/modal/EditStoreProfile.vue';
import { apiReq, Rp } from '../helpers/fns';
import { useAuthStore } from '../stores/auth';
import { useMiscStore } from '../stores/misc';

const auth = useAuthStore()
const misc = useMiscStore()
const logoutBtn = () => {
  if(!confirm('Logout Sekarang?')) return
  auth.setLogout()
}
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Akun Saya</h5>
      <div class="ms-auto">
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-header d-flex">
        <div>
          <i class="bi bi-person-circle" style="font-size: 30px;"></i>
        </div>
        <div class="ms-3">
          <p class="mb-0 fw-bold">{{ auth.user.name }}</p>
          <p class="mb-0 small">{{ auth.user.email }}</p>
          <p class="mb-0 small">{{ auth.user.phone }}</p>
        </div>
      </div>
      <div class="list-group list-group-flush">
        <a class="list-group-item d-flex" href="javascript:;" data-bs-toggle="modal" data-bs-target="#EditProfile">
          <span>Edit Profil</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <RouterLink to="/withdrawals" class="list-group-item d-flex">
          <span>Penarikan Saldo ({{ Rp(auth.user.balance) }})</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
        <a class="list-group-item d-flex" href="javascript:;" data-bs-toggle="modal" data-bs-target="#EditPin">
          <span>Atur PIN Penarikan</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
      </div>
    </div>
    <template v-if="!(misc.config.site_mode == 'official_store' && !auth.store.id)">
      <div class="d-flex">
        <h5 class="mb-4">Toko Saya</h5>
        <div class="ms-auto">
        </div>
      </div>
      <div v-if="auth.store.id" class="card mb-4">
        <div class="card-header d-flex">
          <div>
            <i class="bi bi-shop" style="font-size: 30px;"></i>
          </div>
          <div class="ms-3">
            <p class="mb-0 fw-bold">{{ auth.store.name }}</p>
            <p class="mb-0 small">{{ auth.store.email }}</p>
            <p class="mb-0 small">{{ auth.store.phone }}</p>
          </div>
        </div>
        <div class="list-group list-group-flush">
          <RouterLink to="/sales" class="list-group-item d-flex">
            <span>Penjualan</span>
            <div class="ms-auto">
              <i class="bi bi-chevron-right"></i>
            </div>
          </RouterLink>
          <RouterLink to="/products" class="list-group-item d-flex">
            <span>Produk</span>
            <div class="ms-auto">
              <i class="bi bi-chevron-right"></i>
            </div>
          </RouterLink>
          <a class="list-group-item d-flex" href="javascript:;" data-bs-toggle="modal" data-bs-target="#EditStoreProfile">
            <span>Pengaturan</span>
            <div class="ms-auto">
              <i class="bi bi-chevron-right"></i>
            </div>
          </a>
        </div>
      </div>
      <div v-else  class="card mb-4">
        <div class="card-header text-center">
          Belum memiliki toko
        </div>
        <div class="list-group list-group-flush">
          <a class="list-group-item d-flex" href="javascript:;" data-bs-toggle="modal" data-bs-target="#EditStoreProfile">
            <span>Buat toko</span>
            <div class="ms-auto">
              <i class="bi bi-chevron-right"></i>
            </div>
          </a>
        </div>
      </div>
    </template>
    <template v-if="auth.user.email == misc.config.admin_email">
      <div class="d-flex">
        <h5 class="mb-4">Menu Admin</h5>
        <div class="ms-auto">
        </div>
      </div>
      <div class="list-group mb-4">
        <RouterLink to="/admin/all-transactions" class="list-group-item d-flex">
          <span>Semua Transaksi</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
        <RouterLink to="/admin/all-products" class="list-group-item d-flex">
          <span>Semua Produk</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
        <RouterLink to="/admin/featured-products" class="list-group-item d-flex">
          <span>Produk Unggulan</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
        <RouterLink to="/admin/all-stores" class="list-group-item d-flex">
          <span>Semua Toko</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
        <RouterLink to="/admin/all-users" class="list-group-item d-flex">
          <span>Semua Pengguna</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
        <RouterLink class="list-group-item d-flex" to="/admin/config">
          <span>Konfigurasi</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
      </div>
    </template>
    <div class="" @click="logoutBtn">
      <button class="btn btn-light border w-100 text-danger">
        Logout
      </button>
    </div>
    <EditProfile />
    <EditPin />
    <EditStoreProfile />
  </div>
</template>