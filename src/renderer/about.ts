import './shared'
import { LINKS } from '../shared/config'

const versionBadge = document.getElementById('version') as HTMLElement

window.electronAPI?.getUpdateStatus().then((update) => {
  if (update) {
    versionBadge.classList.add('has-update')
    versionBadge.addEventListener('click', () => {
      window.electronAPI?.openExternal(LINKS.releases)
    })
  }
})

const params = new URLSearchParams(location.search)

const versionText = document.getElementById('version-text') as HTMLElement
const version = params.get('version')
if (version) versionText.textContent = `v${version}`

const authorLink = document.getElementById('author-link') as HTMLAnchorElement
authorLink.addEventListener('click', (e) => {
  e.preventDefault()
  window.electronAPI?.openExternal(LINKS.author)
})

const homepage = params.get('homepage')
if (homepage) {
  const websiteLink = document.getElementById(
    'website-link'
  ) as HTMLAnchorElement
  websiteLink.addEventListener('click', (e) => {
    e.preventDefault()
    window.electronAPI?.openExternal(homepage)
  })
}

const sourceLink = document.getElementById('source-link') as HTMLAnchorElement
sourceLink.addEventListener('click', (e) => {
  e.preventDefault()
  window.electronAPI?.openExternal(LINKS.source)
})
