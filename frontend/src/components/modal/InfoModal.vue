<script setup>
import { useMiscStore } from '../../stores/misc';
const misc = useMiscStore()
</script>

<template>
  <div class="modal fade" tabindex="-1" id="InfoModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tentang {{ misc.config.site_name }}</h5>
          <button ref="btnCloseModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="">
          <div style="white-space: pre-line;" class="mb-4">
            {{ misc.config.content_info }}
          </div>
          <div class="bg-light border p-2 d-flex rounded">
            <div>
              <h6 class="mb-0">Butuh Bantuan?</h6>            
            </div>
            <div class="ms-auto">
              <a class="text-success small text-decoration-none" :href="'https://wa.me/'+misc.config.admin_phone" target="_blank">
                <i class="bi bi-whatsapp"></i>
                <span class="ms-0">
                  Chat Admin
                </span>
              </a>
            </div>
          </div>
        </div>
        <div class="modal-footer justify-content-center">
          <p class="text-muted small text-center">
            powered by
            <a href="https://github.com/gx1org/openpasar" target="_blank" class="text-reset">
              OpenPasar
              <i class="bi bi-github"></i>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>