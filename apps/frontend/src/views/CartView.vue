<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiReq, handleErrorApi, img, Rp } from '../utils/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import SubmitButton from '../components/partial/SubmitButton.vue';
import ProductShow from '../components/modal/ProductShow.vue';

const route = useRoute()
const router = useRouter()

const carts = ref([])
const computedCarts = computed(() => {
  if (carts.value.length == 0) {
    return []
  }

  const groupedArray = Object.values(
    carts.value.reduce((acc, item) => {
      if (!acc[item.store_id]) acc[item.store_id] = { store_id: item.store_id, carts: [] };
      acc[item.store_id].carts.push(item);
      return acc;
    }, {})
  );

  return groupedArray
})

const isFetching = ref(true)
const fetchData = () => {
  isFetching.value = true
  apiReq('get', '/user/carts').then(res => {
    carts.value = res.data.carts
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const addToCart = (sku) => {
  if (!sku) {
    sku = route.query.add
  }
  isFetching.value = true
  apiReq('post', '/user/carts', {
    sku
  }).then(res => {
    carts.value = res.data.carts
    router.replace('/cart')
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const minusBtn = (c) => {
  isFetching.value = true
  apiReq('delete', `/user/carts/${c.id}`).then(res => {
    carts.value = res.data.carts
  })
  .catch(handleErrorApi)
  .finally(() => {
    isFetching.value = false
  })
}

const plusBtn = (c) => {
 addToCart(c.sku)
}

const productShowing = ref({})
const showProduct = (p) => {
  event.preventDefault()
  productShowing.value = p
  document.getElementById('ProductShow-btn').click()
}

const isSending = ref(false)
const checkoutBtn = (g) => {
  const payload = {
    store_id: g.store_id,
    note: g.note
  }
  isSending.value = true
  apiReq('post', '/user/checkout', payload).then(res => {
    router.push('/orders')
  })
  .catch(handleErrorApi)
  .finally(() => {
    isSending.value = false
  })
}

onMounted(() => {
  if (route.query.add) {
    addToCart()
  } else {
    fetchData()
  }
})
</script>

<template>
  <div class="">
    <h5 class="mb-4">Keranjang</h5>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div v-if="carts.length == 0" class="text-center p-3 card">
        Yahh, keranjang masih kosong :)
      </div>
      <div class="card mb-4" v-for="g,i in computedCarts" :key="i">
        <div class="card-header">
          <div class="d-flex">
            <div class="me-auto">
              {{ g.carts[0].store_name }}
            </div>
            <div class="small fw-bold">
              {{ Rp(g.carts.reduce((acc, item) => acc + item.quantity * item.price, 0)) }}
            </div>
          </div>
        </div>
        <ul class="list-group list-group-flush">
          <li v-for="c in g.carts" :key="c.id" class="list-group-item">
            <div class="d-flex">
              <div class="small me-2">
                <a :href="'/p/'+c.sku" @click="showProduct(c)" class="text-decoration-none">
                  {{ c.name }} ({{ c.sku }})
                </a>
                <br>
                <div class="d-flex">
                  <div class="btn-group">
                    <button @click="minusBtn(c)" class="btn btn-light btn-sm border text-danger fw-bold">
                      <i class="bi bi-dash-circle-fill"></i>
                    </button>
                    <button @click="plusBtn(c)" class="btn btn-light btn-sm border text-success fw-bold">
                      <i class="bi bi-plus-circle-fill"></i>
                    </button>
                  </div>
                  <div class="mt-1 ms-2">
                    {{ Rp(c.quantity * c.price) }} ({{ c.quantity }} pcs)
                  </div>
                </div>
              </div>
              <div class="ms-auto">
                <img :src="img(c.image_url)" alt="img" class="border square" width="50">
              </div>
            </div>
          </li>
        </ul>
        <div class="card-footer">
          <textarea v-model="g.note" class="form-control form-control-sm mb-2" placeholder="Tambah catatan saat checkout"></textarea>
          <SubmitButton class="btn btn-primary w-100" @click="checkoutBtn(g)" :sending="isSending">
            Checkout &rarr;
          </SubmitButton>
        </div>
      </div>
    </template>
    <button id="ProductShow-btn" type="button" class="d-none" data-bs-toggle="modal" data-bs-target="#ProductShow"></button>
    <ProductShow :data="productShowing" />
  </div>
</template>