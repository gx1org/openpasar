import Markdown from 'markdown-it'

const md = new Markdown({
  html: false,
  linkify: true
})
.disable(['lheading'])
const disabledHeading = ['#', '####', '#####', '######']

md.renderer.rules.heading_open = function(tokens, idx) {
  return disabledHeading.includes(tokens[idx].markup) ? tokens[idx].markup : `<${tokens[idx].tag}>`
}
md.renderer.rules.heading_close = function(tokens, idx) {
  return disabledHeading.includes(tokens[idx].markup) ? tokens[idx].markup : `</${tokens[idx].tag}>`
}
md.renderer.rules.table_open = function(tokens, idx) {
  return `<${tokens[idx].tag} class="table table-bordered">`
}

export function render(str) {
  return md.render(str || '')
}

export function preview(str) {
  const el = document.createElement('div')
  el.innerHTML = render(str || '')
  return el.textContent.substring(0, 160) + (el.textContent.length > 160 ? '...' : '')
}