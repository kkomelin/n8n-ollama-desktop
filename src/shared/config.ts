export const DOCKER_PROJECT_NAME = 'lonelynathan'

export const GITHUB_REPO = 'kkomelin/n8n-ollama-desktop'

export const MESSAGES = {
  dockerNotAvailable:
    'Docker is not installed or not running. Please install and start it.',
  dockerPermissionDenied:
    'Docker is installed but your user lacks permission to use it. Run: sudo usermod -aG docker $USER, then log out and back in.',
}

export const LINKS = {
  homepage: 'https://lonelynathan.app/',
  author: 'https://komelin.com?utm_source=lonelynathan',
  source: `https://github.com/${GITHUB_REPO}`,
  modelsBrowser: 'https://ollama.com/search',
  latestRelease: `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
  releases: `https://github.com/${GITHUB_REPO}/releases`,
  dockerInstall: 'https://docs.docker.com/engine/install/',
}
