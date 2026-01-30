function setDpr() {
  const dpr = window.devicePixelRatio || 1
  document.documentElement.style.setProperty('--dpr', String(dpr))
}

setDpr()

window.addEventListener('resize', setDpr)

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setDpr)
}

