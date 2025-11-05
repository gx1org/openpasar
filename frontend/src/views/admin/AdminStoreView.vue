<script setup>
import { onMounted, ref, watch } from 'vue';
import { apiReq, handleErrorApi } from '../helpers/fns';
import SpinnerBox from '../components/partial/SpinnerBox.vue';
import ExLinkIcon from '../components/icon/ExLinkIcon.vue';
import { useMiscStore } from '../stores/misc';
import { RouterLink } from 'vue-router';

const isFetching = ref(true)
const misc = useMiscStore()
onMounted(() => {
  misc.getStores()
})
</script>

<template>
  <div>
    <div class="d-flex">
      <h5 class="mb-4">Toko</h5>
      <div class="ms-auto">
        <button class="btn btn-sm btn-primary">+ Buat Baru</button>
      </div>
    </div>
    <SpinnerBox v-if="isFetching" />
    <template v-else>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Nama</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s,i in misc.stores" :key="i">
              <td>{{ s.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>