<script setup>
import { onMounted, ref } from 'vue';
import { apiReq, formatDateTime, handleErrorApi, img, Rp } from '../utils/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import { useRoute } from 'vue-router';
import ProductShow from '../components/modal/ProductShow.vue';
import { useMiscStore } from '../stores/misc';
import StatusLabel from '../components/partial/StatusLabel.vue';
import LinkifiedText from '../components/partial/LinkifiedText.vue';

const misc = useMiscStore()
const route = useRoute()
const order = ref({})
const isFetching = ref(true)

const fetchData = async () => {
  apiReq('get', `/user/transactions/${route.params.id}`).then(res => {
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
  p.store_name = order.value.store_name
  p.store_phone = order.value.store_phone
  p.store_id = order.value.store_id
  p.store_sales_count = order.value.store_sales_count
  productShowing.value = p
  document.getElementById('ProductShow-btn').click()
}

const isSending = ref(false)
const actionBtn = (status) => {
  if (!confirm('Anda yakin?')) return
  isSending.value = true
  apiReq('patch', `/user/transactions/${route.params.id}/status`, { status })
    .then(() => {
      fetchData()
    }) 
    .catch(handleErrorApi)
    .finally(() => {
      isSending.value = false
    })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <div class="d-flex" v-if="!isFetching">
      <h5 class="mb-4">Pesanan #{{ route.params.id }}</h5>
      <div class="ms-auto">
        <RouterLink to="/orders" class="small">
          &larr; Pesanan Saya
        </RouterLink>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div v-if="!order.id" class="card mb-4 text-center">
        <div class="card-body">
          <p class="mb-0">
            Pesanan tidak ditemukan
          </p>
        </div>
      </div>
      <div v-else>
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
                <StatusLabel :status="order.status" />
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
                Penjual
              </div>
              <div class="w-75">
                <RouterLink :to="'/stores/'+order.store_id">{{ order.store_name }}</RouterLink>
              </div>
            </li>
            <li class="list-group-item">
              <div class="text-muted w-100 small mb-1">
                Catatan
              </div>
              <div class="w-75">
                <LinkifiedText :text="order.checkout_note || '-'" />
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
                  <a :href="'/p/'+c.sku" @click="showProduct(c)" class="text-decoration-none small">
                    {{ c.name }} ({{ c.quantity }} pcs)
                  </a>
                  <br>
                  <span>
                    {{ Rp(c.quantity * c.price) }}
                  </span>
                </div>
                <div class="ms-auto">
                  <img :src="img(c.image_url)" alt="img" class="border square" width="50">
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="order.seller_response" class="card mb-4">
          <div class="card-header h6">
            Tanggapan Penjual
          </div>
          <div class="card-body">
            <LinkifiedText :text="order.seller_response || '-'" />
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-header h6">
            Aksi
          </div>
          <ul class="list-group list-group-flush">
            <li v-if="order.status == 'canceled'" class="list-group-item">
              <span class="text-muted">
                Pesanan telah dibatalkan.
              </span>
            </li>
            <li v-if="order.status == 'rejected'" class="list-group-item">
              <span class="text-dark">
                Pesanan telah ditolak penjual.
              </span>
            </li>
            <li v-if="order.status == 'in_process'" class="list-group-item">
              <span class="text-warning">
                Pesanan sedang diproses penjual.
              </span>
            </li>
            <li v-if="order.status == 'complained'" class="list-group-item">
              <span class="text-danger">
                Pesanan dikomplain. Hubungi admin jika diperlukan.
              </span>
            </li>
            <li v-if="order.status == 'completed'" class="list-group-item">
              <span class="text-success">
                Pesanan telah selesai
              </span>
            </li>
            <li v-if="order.status == 'pending'" class="list-group-item d-flex">
              <button @click="actionBtn('canceled')" :disabled="isSending" class="btn btn-light border text-danger w-100">
                Batalkan
              </button>
              <a :href="`https://app.pakasir.com/pay/${misc.config.pakasir_slug}/${order.total_amount}?order_id=${order.id}`" class="btn btn-primary w-100 ms-2">
                Bayar
              </a>
            </li>
            <li v-if="order.status == 'sent'" class="list-group-item d-flex">
              <button @click="actionBtn('complained')" :disabled="isSending" class="btn btn-light border text-danger w-100">
                Komplain
              </button>
              <button @click="actionBtn('completed')" :disabled="isSending" class="btn btn-primary w-100 ms-2">
                Selesai
              </button>
            </li>
            <li v-if="order.status == 'complained'" class="list-group-item d-flex">
              <button @click="actionBtn('completed')" :disabled="isSending" class="btn btn-primary w-100">
                Selesai
              </button>
            </li>
          </ul>
          <div v-if="['pending', 'sent'].includes(order.status)" class="card-footer">
            <p v-if="order.status == 'pending'" class="mb-0 small">
              Pesanan akan batal otomatis jika tidak dibayar setelah {{ formatDateTime(order.created_at) }}
            </p>
            <p v-if="order.status == 'sent'" class="mb-0 small">
              Pesanan akan selesai otomatis jika tidak dikomplain setelah {{ formatDateTime(order.created_at) }}
            </p>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-header h6">
            Bantuan
          </div>
          <ul class="list-group list-group-flush small">
            <li class="list-group-item">
              <a :href="`https://wa.me/`+order.store_phone" class="text-decoration-none text-success">
                <i class="bi bi-whatsapp"></i>
                Hubungi Penjual
              </a>
            </li>
            <li class="list-group-item">
              <a :href="`https://wa.me/`+misc.config.admin_phone" class="text-decoration-none text-success">
                <i class="bi bi-whatsapp"></i>
                Lapor Admin
              </a>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <button id="ProductShow-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductShow"></button>
    <ProductShow :data="productShowing" />
  </div>
</template>