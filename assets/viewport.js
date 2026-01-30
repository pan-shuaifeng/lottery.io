function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function setViewportVars() {
  const dpr = window.devicePixelRatio || 1

  const viewportWidth = window.visualViewport?.width ?? window.innerWidth
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight

  const physicalWidth = viewportWidth * dpr
  const physicalHeight = viewportHeight * dpr

  const basePhysicalWidth = 3024
  const basePhysicalHeight = 1964

  const uiScale = clamp(
    Math.min(physicalWidth / basePhysicalWidth, physicalHeight / basePhysicalHeight),
    0.75,
    1.6,
  )

  const rootStyle = document.documentElement.style
  rootStyle.setProperty('--dpr', String(dpr))
  rootStyle.setProperty('--ui-scale', String(uiScale))
}

setViewportVars()

window.addEventListener('resize', setViewportVars)

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setViewportVars)
}
