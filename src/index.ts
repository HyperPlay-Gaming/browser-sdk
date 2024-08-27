interface FullscreenStyleProps {
  position: string
  top: string
  right: string
  bottom: string
  left: string
  width: string
  height: string
  border: string
  overflow: string
}

// key is elementId
const elementStylePrevValues: Record<string, FullscreenStyleProps> = {}

function resetElementStyleToPrev(elementId: string) {
  const element = document.getElementById(elementId)
  if (!element) return

  for (const key of Object.keys(elementStylePrevValues[elementId])) {
    element.style.setProperty(
      key,
      elementStylePrevValues[elementId][key as keyof FullscreenStyleProps]
    )
  }
}

function cachePrevElementStyles(elementId: string) {
  const element = document.getElementById(elementId)
  if (!element) return
  elementStylePrevValues[elementId] = {
    position: element.style.getPropertyValue('position'),
    top: element.style.getPropertyValue('top'),
    right: element.style.getPropertyValue('right'),
    bottom: element.style.getPropertyValue('bottom'),
    left: element.style.getPropertyValue('left'),
    width: element.style.getPropertyValue('width'),
    height: element.style.getPropertyValue('height'),
    border: element.style.getPropertyValue('border'),
    overflow: element.style.getPropertyValue('overflow')
  }
}

function makeElementFullScreenWindow(elementId: string) {
  const element = document.getElementById(elementId)
  if (!element) return
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

function isRenderedInHyperPlayAsIframe() {
  return window.self !== window.top
}

export function requestFullscreen({
  elementId,
  setStyle
}: {
  elementId: string
  setStyle?: boolean
}) {
  if (!isRenderedInHyperPlayAsIframe()) {
    const element = document.getElementById(elementId)
    if (element === null) {
      console.error('no element with element id ', elementId, ' exists')
    }
    element?.requestFullscreen()
    return
  }

  window.parent.postMessage(
    {
      method: 'requestFullscreen'
    },
    '*'
  )

  window.addEventListener('message', (event) => {
    if (
      event.data.method === 'fullscreenchange' &&
      event.data.isFullScreen === false
    ) {
      resetElementStyleToPrev(elementId)
    }
  })

  const element = document.getElementById(elementId)
  if (setStyle && element) {
    cachePrevElementStyles(elementId)
    makeElementFullScreenWindow(elementId)
  }
}
