import { app, net } from 'electron'
import { LINKS } from '../../shared/config'

interface ReleaseInfo {
  tag_name: string
  html_url: string
}

export interface UpdateResult {
  version: string
  url: string
}

export async function checkForUpdate(): Promise<UpdateResult | null> {
  // In dev mode, always show the update badge for testing.
  if (!app.isPackaged) {
    return { version: '0.0.0-dev', url: LINKS.releases }
  }

  const response = await net.fetch(LINKS.latestRelease)
  if (!response.ok) return null

  const data = (await response.json()) as ReleaseInfo
  const latest = data.tag_name.replace(/^v/, '')
  const current = app.getVersion()

  if (latest === current) return null

  return { version: latest, url: data.html_url }
}
