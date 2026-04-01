import './shared'
import { LINKS } from '../shared/config'

const versionBadge = document.getElementById('version') as HTMLElement
const versionText = document.getElementById('version-text') as HTMLElement
const version = new URLSearchParams(location.search).get('version')
if (version) versionText.textContent = `v${version}`

const statusEl = document.getElementById('status-text') as HTMLElement
const logLineEl = document.getElementById('log-line') as HTMLElement
const loaderEl = document.getElementById('loader') as HTMLElement
const retryWrap = document.getElementById('retry-wrap') as HTMLElement
const retryBtn = document.getElementById('retry-btn') as HTMLButtonElement
const closeBtn = document.getElementById('close-btn') as HTMLButtonElement
const progressArea = document.getElementById('progress-area') as HTMLElement
const gpuPrompt = document.getElementById('gpu-prompt') as HTMLElement
const gpuDetectedName = document.getElementById(
  'gpu-detected-name'
) as HTMLElement
const gpuOptHwLabel = document.getElementById('gpu-opt-hw-label') as HTMLElement
const gpuOptHardware = document.getElementById(
  'gpu-opt-hardware'
) as HTMLButtonElement
const gpuOptCpu = document.getElementById('gpu-opt-cpu') as HTMLButtonElement

let cleanupStatus: (() => void) | undefined
let cleanupLog: (() => void) | undefined
let cleanupError: (() => void) | undefined

function setStatus(text: string): void {
  statusEl.textContent = text
  statusEl.classList.remove('error')
  loaderEl.classList.remove('error')
  retryWrap.classList.remove('visible')
}

function showLog(text: string): void {
  logLineEl.textContent = text
}

function setError(text: string): void {
  statusEl.textContent = text
  statusEl.classList.add('error')
  loaderEl.classList.add('error')
  retryWrap.classList.add('visible')
}

function bindListeners(): void {
  if (!window.electronAPI) return
  cleanupStatus = window.electronAPI.onStatusUpdate(setStatus)
  cleanupLog = window.electronAPI.onLogLine(showLog)
  cleanupError = window.electronAPI.onError(setError)
}

function unbindListeners(): void {
  cleanupStatus?.()
  cleanupLog?.()
  cleanupError?.()
}

bindListeners()

async function pollUpdateStatus(): Promise<void> {
  for (let i = 0; i < 5; i++) {
    const update = await window.electronAPI?.getUpdateStatus()
    if (update) {
      versionBadge.classList.add('has-update')
      versionBadge.addEventListener('click', () => {
        window.electronAPI?.openExternal(LINKS.releases)
      })
      return
    }
    await new Promise((r) => setTimeout(r, 2000))
  }
}

pollUpdateStatus()

let detectedGpu = ''

window.electronAPI?.onGpuPrompt((gpu) => {
  detectedGpu = gpu
  const label = gpu === 'nvidia' ? 'NVIDIA GPU' : 'AMD GPU'
  gpuDetectedName.textContent = label
  gpuOptHwLabel.textContent = label
  progressArea.style.display = 'none'
  gpuPrompt.classList.add('visible')
})

function chooseGpu(choice: string): void {
  gpuPrompt.classList.remove('visible')
  progressArea.style.display = ''
  window.electronAPI?.sendGpuChoice(choice)
}

gpuOptHardware.addEventListener('click', () => chooseGpu(detectedGpu))
gpuOptCpu.addEventListener('click', () => chooseGpu('cpu'))

retryBtn.addEventListener('click', () => {
  unbindListeners()
  window.electronAPI?.retry()
  setStatus('retrying…')
  logLineEl.textContent = ''
  retryWrap.classList.remove('visible')
  bindListeners()
})

closeBtn.addEventListener('click', () => window.electronAPI?.quit())
