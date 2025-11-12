<script setup>
import { onMounted, ref } from 'vue';
import { apiReq, formatDateTime, handleErrorApi, Rp } from '../../helpers/fns';
import SpinnerBox from '../../components/partial/SpinnerBox.vue';
import { useRoute } from 'vue-router';
import ProductView from '../../components/modal/ProductView.vue';

const route = useRoute()
const order = ref({})
const isFetching = ref(true)

const fetchData = async () => {
  apiReq('get', `/user/stores/transactions/${route.params.id}`).then(res => {
    res.data.transaction.items = res.data.transaction.items.map(i => {
      i.store_name = res.data.transaction.store_name
      i.store_phone = res.data.transaction.store_phone
      return i
    })
    order.value = res.data.transaction
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const productShowing = ref({})
const showProduct = (p) => {
  event.preventDefault()
  productShowing.value = p
  document.getElementById('ProductView-btn').click()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <div class="d-flex" v-if="!isFetching">
      <h5 class="mb-4">Penjualan #{{ order.id }}</h5>
      <div class="ms-auto">
        <RouterLink to="/sales" class="small">
          &larr; Penjualan
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="card mb-4">
        <div class="card-header h6">
          Detail Pesanan
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex">
            <div class="text-muted w-25">
              Status
            </div>
            <div class="w-75">
              {{ order.status }}
            </div>
          </li>
          <li class="list-group-item d-flex">
            <div class="text-muted w-25">
              Tanggal
            </div>
            <div class="w-75">
              {{ formatDateTime(order.created_at) }}
            </div>
          </li>
          <li class="list-group-item d-flex">
            <div class="text-muted w-25">
              Total
            </div>
            <div class="w-75">
              {{ Rp(order.total_amount) }}
            </div>
          </li>
          <li class="list-group-item d-flex">
            <div class="text-muted w-25">
              Catatan
            </div>
            <div class="w-75">
              {{ (order.checkout_note) || '-' }}
            </div>
          </li>
          <li class="list-group-item d-flex">
            <div class="text-muted w-25">
              Penjual
            </div>
            <div class="w-75">
              {{ (order.store_name) || '-' }}
            </div>
          </li>
        </ul>
      </div>
      <div class="card mb-4">
        <div class="card-header h6">
          Produk
        </div>
        <ul class="list-group list-group-flush">
          <li v-for="c in order.items" :key="c.id" class="list-group-item">
            <div class="d-flex">
              <div class="me-2">
                <a :href="'/search?show='+c.sku" @click="showProduct(c)" class="text-decoration-none small">
                  {{ c.name }} ({{ c.quantity }} pcs)
                </a>
                <br>
                <span>
                  {{ Rp(c.quantity * c.price) }}
                </span>
              </div>
              <div class="ms-auto">
                <img :src="c.image_url" alt="img" class="border" style="width: 50px;aspect-ratio: 1/1;">
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="card mb-4">
        <div class="card-header h6">
          Aksi
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex">
            <button class="btn btn-light border text-danger w-100">
              Batalkan
            </button>
            <button class="btn btn-primary w-100 ms-2">
              Bayar
            </button>
          </li>
        </ul>
        <div class="card-footer">
          <p class="mb-0">
            Pesanan akan batal otomatis jika tidak dibayar setelah {{ formatDateTime(order.created_at) }}
          </p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header h6">
          Bantuan
        </div>
        <ul class="list-group list-group-flush small">
          <li class="list-group-item">
            <a href="#" class="text-decoration-none text-success">
              <i class="bi bi-whatsapp"></i>
              Hubungi Penjual
            </a>
          </li>
          <li class="list-group-item">
            <a href="#" class="text-decoration-none text-success">
              <i class="bi bi-whatsapp"></i>
              Lapor Admin
            </a>
          </li>
        </ul>
      </div>
    </template>
    <button id="ProductView-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductView"></button>
    <ProductView :data="productShowing" />
  </div>
</template>