<script setup>
import { useMiscStore } from '../../stores/misc';

const misc = useMiscStore()
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
      <i class="bi bi-search"></i>
      </RouterLink>
    </div>
    <div class="w-100">
      <RouterLink to="/cart">
      <i class="bi bi-cart-fill"></i>
      </RouterLink>
    </div>
    <div class="w-100">
      <RouterLink to="/account">
      <i class="bi bi-person-fill"></i>
      </RouterLink>
    </div>
  </footer>
</template>
