const applyTheme = (t) => document.documentElement.setAttribute('data-theme', t)
window.electronAPI?.getTheme().then((t) => {
  if (t) applyTheme(t)
})
window.electronAPI?.onThemeChange(applyTheme)
