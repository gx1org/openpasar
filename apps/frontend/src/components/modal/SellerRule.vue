<script setup>
import { useMiscStore } from '../../stores/misc';
import LinkifiedText from '../partial/LinkifiedText.vue';
const misc = useMiscStore()
</script>

<template>
  <div class="modal fade" tabindex="-1" id="SellerRule">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Aturan dan Fee Penjualan</h5>
          <button ref="btnCloseModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="">
          <h6 class="fw-bold">Aturan</h6>
          <div class="mb-4">
            <LinkifiedText :text="misc.config.content_seller_rules" />
          </div>
          <h6 class="fw-bold">Fee Penjualan</h6>
          <div class="mb-4">
            {{ misc.config.seller_fee }}% dari nominal penjualan
          </div>
          <div class="bg-light p-2 card">
            <div class="d-flex">
              <p class="mb-0">Butuh Bantuan?</p>            
              <a class="text-success small text-decoration-none ms-auto" :href="'https://wa.me/'+misc.config.admin_phone" target="_blank">
                <i class="bi bi-whatsapp"></i>
                <span class="ms-0">
                  Chat Admin
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
