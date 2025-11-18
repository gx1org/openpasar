
export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.client) {
    return
  }
  
  const anyModalOpened = document.querySelector('.modal-backdrop.fade.show')
  if (anyModalOpened) {
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(v => v.click())
    if (event && event.type == 'popstate') {
      return false;
    }
  }
})
