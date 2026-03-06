type ScrollpointHighlight = {
  x: number
  y: number
  width: number
  height: number
}

type Scrollpoint = {
  title: string
  text: string
  highlight: ScrollpointHighlight
  dot?: { x: number; y: number } | null
}

type Section05Config = {
  image: string
  title: string
  points: Scrollpoint[]
}

type Transform = {
  scale: number
  x: number
  y: number
}

export function renderSection05(config: Section05Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--scrollpoints'
  section.id = 'section-05'
  const steps = config.points.length * 2 + 4
  section.style.minHeight = `${steps * 240}vh`

  const wrap = document.createElement('div')
  wrap.className = 'scrollpoints'

  const media = document.createElement('div')
  media.className = 'scrollpoints__media'
  const dots = config.points
    .map((p) => p.dot)
    .filter((d): d is { x: number; y: number } => Boolean(d))
    .map(
      (d) =>
        `<span class="scrollpoints__dot" style="left:${d.x}%; top:${d.y}%;"></span>`
    )
    .join('')
  media.innerHTML = `
    <div class="scrollpoints__image-wrap">
      <img class="scrollpoints__image" src="${config.image}" alt="">
      ${dots}
    </div>
  `

  const panels = document.createElement('div')
  panels.className = 'scrollpoints__panels'

  const titlePanel = document.createElement('div')
  titlePanel.className = 'scrollpoints__panel scrollpoints__panel--title'
  titlePanel.innerHTML = `<h3>${config.title}</h3>`
  panels.appendChild(titlePanel)

  config.points.forEach((p, idx) => {
    const panel = document.createElement('div')
    panel.className = 'scrollpoints__panel scrollpoints__panel--point'
    panel.dataset.index = String(idx)
    const lines = p.text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const listItems = lines
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        if (line.startsWith('👉')) {
          return `<li class="scrollpoints__item-hand">${line.replace(/^👉\\s*/, '')}</li>`
        }
        const cleaned = line.replace(/^[\\-–•]+\\s*/, '')
        return `<li>${cleaned}</li>`
      })
      .join('')
    panel.innerHTML = `
      <h4>${p.title}</h4>
      <ul>${listItems}</ul>
    `
    panels.appendChild(panel)
  })

  wrap.appendChild(media)
  wrap.appendChild(panels)
  section.appendChild(wrap)

  return section
}

export function bindScrollpointsSection(section: HTMLElement, config: Section05Config): void {
  const image = section.querySelector<HTMLImageElement>('.scrollpoints__image')
  const imageWrap = section.querySelector<HTMLDivElement>('.scrollpoints__image-wrap')
  const titlePanel = section.querySelector<HTMLElement>('.scrollpoints__panel--title')
  const pointPanels = Array.from(
    section.querySelectorAll<HTMLElement>('.scrollpoints__panel--point')
  )

  if (!image || !imageWrap || !titlePanel) return

  let imageReady = false
  let naturalW = 0
  let naturalH = 0

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = clamp((x - edge0) / (edge1 - edge0))
    return t * t * (3 - 2 * t)
  }
  const ease = (t: number) => t * t * (3 - 2 * t)

  const toTransform = (
    highlight: ScrollpointHighlight,
    viewW: number,
    viewH: number,
    targetY: number,
    fitWidth: boolean
  ): Transform => {
    const baseScale = fitWidth
      ? viewW / naturalW
      : Math.max(viewW / naturalW, viewH / naturalH)
    const baseX = fitWidth ? 0 : (viewW - naturalW * baseScale) / 2
    const baseY = (viewH - naturalH * baseScale) / 2

    const boxW = (highlight.width / 100) * naturalW
    const boxH = (highlight.height / 100) * naturalH
    const centerX = (highlight.x / 100) * naturalW + boxW / 2
    const centerY = (highlight.y / 100) * naturalH + boxH / 2

    const scaleX = viewW / (boxW * baseScale)
    const scaleY = viewH / (boxH * baseScale)
    const zoomBase = Math.min(scaleX, scaleY) * 0.92
    const zoom = fitWidth
      ? Math.min(3.6, Math.max(1.3, zoomBase * 1.15))
      : Math.min(3, Math.max(1.1, zoomBase))

    const totalScale = baseScale * zoom
    const x = baseX - centerX * baseScale * zoom + viewW / 2
    const y = baseY - centerY * baseScale * zoom + targetY

    return { scale: totalScale, x, y }
  }

  const fullTransform = (viewW: number, viewH: number, fitWidth: boolean): Transform => {
    const baseScale = fitWidth
      ? viewW / naturalW
      : Math.max(viewW / naturalW, viewH / naturalH)
    const baseX = fitWidth ? 0 : (viewW - naturalW * baseScale) / 2
    const baseY = (viewH - naturalH * baseScale) / 2
    return { scale: baseScale, x: baseX, y: baseY }
  }

  const getSequence = (isMobile: boolean): { transforms: Transform[]; panels: (number | 'title' | null)[] } => {
    const viewW = window.innerWidth
    const viewH = window.innerHeight
    const targetY = isMobile ? viewH * 0.38 : viewH / 2
    const fitWidth = isMobile

    const transforms: Transform[] = []
    const panels: (number | 'title' | null)[] = []

    transforms.push(fullTransform(viewW, viewH, fitWidth)) // intro full
    panels.push(null)
    transforms.push(fullTransform(viewW, viewH, fitWidth)) // title hold
    panels.push('title')
    transforms.push(fullTransform(viewW, viewH, fitWidth)) // pre-zoom full
    panels.push(null)

    config.points.forEach((p, idx) => {
      const target = toTransform(p.highlight, viewW, viewH, targetY, fitWidth)
      transforms.push(target) // zoom to point
      panels.push(null)
      transforms.push(target) // hold + panel
      panels.push(idx)
      transforms.push(target) // pre-zoom (stay) for next move
      panels.push(null)
    })

    transforms.push(fullTransform(viewW, viewH, fitWidth)) // outro full
    panels.push(null)

    return { transforms, panels }
  }

  const update = () => {
    if (!imageReady) return

    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    const viewW = window.innerWidth
    const total = Math.max(1, rect.height - viewH)
    const progress = clamp((viewH - rect.top) / total)
    const isMobile = viewW <= 900

    const { transforms, panels } = getSequence(isMobile)
    const steps = transforms.length

    const stepFloat = progress * (steps - 1)
    const step = Math.min(steps - 2, Math.floor(stepFloat))
    const t = ease(stepFloat - step)

    const a = transforms[step]
    const b = transforms[step + 1]

    // Panels
    const activePanel = panels[step]

    const scale =
      activePanel !== null ? a.scale : a.scale + (b.scale - a.scale) * t
    const x = activePanel !== null ? a.x : a.x + (b.x - a.x) * t
    const y = activePanel !== null ? a.y : a.y + (b.y - a.y) * t

    imageWrap.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(3)})`

    // Panels
    const panelIn = smoothstep(0.0, 0.08, t)
    const panelOut = smoothstep(0.6, 0.85, t)
    const translate = (1 - panelIn) * 90 - panelOut * 90
    const visible = t > 0 ? '0.92' : '0'

    titlePanel.style.opacity = activePanel === 'title' ? visible : '0'
    titlePanel.style.transform =
      activePanel === 'title' ? `translate(-50%, ${translate}vh)` : 'translate(-50%, 70vh)'

    pointPanels.forEach((panel, idx) => {
      const isActive = activePanel === idx
      panel.style.opacity = isActive ? '0.92' : '0'

      if (isMobile && isActive) {
        const highlight = config.points[idx].highlight
        const boxW = (highlight.width / 100) * naturalW
        const boxH = (highlight.height / 100) * naturalH
        const centerX = (highlight.x / 100) * naturalW + boxW / 2
        const centerY = (highlight.y / 100) * naturalH + boxH / 2
        const pointY = centerY * scale + y
        const panelRect = panel.getBoundingClientRect()
        const startTop = viewH + 10
        const midTop = pointY + 60
        const endTop = -panelRect.height * 0.2
        const inPhase = smoothstep(0.0, 0.08, t)
        const outPhase = smoothstep(0.6, 0.85, t)
        const currentTop =
          t < 0.6
            ? startTop + (midTop - startTop) * inPhase
            : midTop + (endTop - midTop) * outPhase
        const clampedTop = Math.min(Math.max(currentTop, 12), viewH - panelRect.height - 12)
        panel.style.top = `${clampedTop}px`
        panel.style.transform = 'translate(-50%, 0)'
      } else {
        panel.style.transform = isActive
          ? `translate(-50%, ${translate}vh)`
          : 'translate(-50%, 70vh)'
        if (isMobile) panel.style.top = ''
      }
    })
  }

  const onResize = () => {
    update()
  }

  const onScroll = () => {
    requestAnimationFrame(update)
  }

  const onLoad = () => {
    naturalW = image.naturalWidth
    naturalH = image.naturalHeight
    imageWrap.style.width = `${naturalW}px`
    imageWrap.style.height = `${naturalH}px`
    imageReady = true
    update()
  }

  if (image.complete) onLoad()
  else image.addEventListener('load', onLoad)

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
}
