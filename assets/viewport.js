function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function setViewportVars() {
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight

  const baseViewportWidth = 2470.5
  const baseViewportHeight = 1516.5

  const uiScale = clamp(
    Math.min(viewportWidth / baseViewportWidth, viewportHeight / baseViewportHeight),
    0.6,
    1.6,
  )

  const rootStyle = document.documentElement.style
  rootStyle.setProperty('--ui-scale', String(uiScale))
}

setViewportVars()

window.addEventListener('resize', setViewportVars)

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setViewportVars)
}
