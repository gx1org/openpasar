<script setup>
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore()
</script>

<template>
  <footer class="fixed-bottom d-flex border-top container bg-white text-center">
    <div class="w-100">
      <RouterLink to="/">
        <i class="bi bi-house-door-fill"></i>
      </RouterLink>
    </div>
    <div class="w-100">
      <RouterLink to="/search">
        <i class="bi bi-tags-fill"></i>
      </RouterLink>
    </div>
    <div class="w-100">
      <RouterLink to="/cart">
        <i class="bi bi-cart-fill"></i>
      </RouterLink>
    </div>
    <div class="w-100">
      <RouterLink to="/orders">
        <i class="bi bi-box-seam-fill"></i>
      </RouterLink>
    </div>
    <div class="w-100">
      <RouterLink to="/account">
        <i v-if="auth.isLogin" class="bi bi-person-check-fill"></i>
        <i v-else class="bi bi-person-fill"></i>
      </RouterLink>
    </div>
  </footer>
</template>
