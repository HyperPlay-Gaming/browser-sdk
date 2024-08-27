export function requestFullscreen({
  elementId,
  setStyle
}: {
  elementId?: string
  setStyle?: boolean
}) {
  window.parent.postMessage(
    {
      method: 'requestFullscreen'
    },
    '*'
  )

  if (elementId) {
    const element = document.getElementById(elementId)
    element?.requestFullscreen()
    if (setStyle && element) {
      element.style.setProperty('position', 'fixed')
      element.style.setProperty('top', '0px')
      element.style.setProperty('right', '0px')
      element.style.setProperty('bottom', '0px')
      element.style.setProperty('left', '0px')
      element.style.setProperty('width', '100%')
      element.style.setProperty('height', '100%')
      element.style.setProperty('border', 'none')
      element.style.setProperty('overflow', 'hidden')
    }
  }
}
