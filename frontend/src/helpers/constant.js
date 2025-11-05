export const appURL = window.location.origin
export const apiURL = appURL.startsWith('http://localhost') ? 'http://localhost:7100/api' : appURL+'/api'
