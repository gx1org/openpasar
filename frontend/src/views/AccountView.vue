<script setup>
import EditProfile from '../components/modal/EditProfile.vue';
import EditStoreProfile from '../components/modal/EditStoreProfile.vue';
import { apiReq, Rp } from '../helpers/fns';
import { useAuthStore } from '../stores/auth';
import { useMiscStore } from '../stores/misc';

const auth = useAuthStore()
const misc = useMiscStore()

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
        <a class="list-group-item d-flex" href="#">
          <span>Penarikan (Saldo: {{ Rp(auth.user.balance) }})</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
      </div>
    </div>
    <div class="d-flex">
      <h5 class="mb-4">Toko Saya</h5>
      <div class="ms-auto">
      </div>
    </div>
    <div class="card mb-4">
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
        <a class="list-group-item d-flex" href="#">
          <span>Penjualan</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <a class="list-group-item d-flex" href="#">
          <span>Produk</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <a class="list-group-item d-flex" href="javascript:;" data-bs-toggle="modal" data-bs-target="#EditStoreProfile">
          <span>Pengaturan</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
      </div>
    </div>
    <template v-if="auth.user.email == misc.config.admin_email">
      <div class="d-flex">
        <h5 class="mb-4">Menu Admin</h5>
        <div class="ms-auto">
        </div>
      </div>
      <div class="list-group mb-4">
        <a class="list-group-item d-flex" href="#">
          <span>Semua Transaksi</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <a class="list-group-item d-flex" href="#">
          <span>Semua Produk</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <a class="list-group-item d-flex" href="#">
          <span>Produk Unggulan</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <a class="list-group-item d-flex" href="#">
          <span>Semua Toko</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <a class="list-group-item d-flex" href="#">
          <span>Semua Pengguna</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </a>
        <RouterLink class="list-group-item d-flex" to="/admin/config">
          <span>Konfigurasi</span>
          <div class="ms-auto">
            <i class="bi bi-chevron-right"></i>
          </div>
        </RouterLink>
      </div>
    </template>
    <EditProfile />
    <EditStoreProfile />
  </div>
</template>