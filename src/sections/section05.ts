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
  section.style.minHeight = `${steps * 100}vh`

  const wrap = document.createElement('div')
  wrap.className = 'scrollpoints'

  const media = document.createElement('div')
  media.className = 'scrollpoints__media'
  media.innerHTML = `
    <img class="scrollpoints__image" src="${config.image}" alt="">
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
  const titlePanel = section.querySelector<HTMLElement>('.scrollpoints__panel--title')
  const pointPanels = Array.from(
    section.querySelectorAll<HTMLElement>('.scrollpoints__panel--point')
  )

  if (!image || !titlePanel) return

  let imageReady = false
  let naturalW = 0
  let naturalH = 0

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
  const ease = (t: number) => t * t * (3 - 2 * t)

  const toTransform = (highlight: ScrollpointHighlight, viewW: number, viewH: number): Transform => {
    const baseScale = Math.max(viewW / naturalW, viewH / naturalH)
    const baseX = (viewW - naturalW * baseScale) / 2
    const baseY = (viewH - naturalH * baseScale) / 2

    const boxW = (highlight.width / 100) * naturalW
    const boxH = (highlight.height / 100) * naturalH
    const centerX = (highlight.x / 100) * naturalW + boxW / 2
    const centerY = (highlight.y / 100) * naturalH + boxH / 2

    const scaleX = viewW / (boxW * baseScale)
    const scaleY = viewH / (boxH * baseScale)
    const zoom = Math.min(3, Math.max(1.1, Math.min(scaleX, scaleY) * 0.92))

    const totalScale = baseScale * zoom
    const x = baseX - centerX * baseScale * zoom + viewW / 2
    const y = baseY - centerY * baseScale * zoom + viewH / 2

    return { scale: totalScale, x, y }
  }

  const fullTransform = (viewW: number, viewH: number): Transform => {
    const baseScale = Math.max(viewW / naturalW, viewH / naturalH)
    const baseX = (viewW - naturalW * baseScale) / 2
    const baseY = (viewH - naturalH * baseScale) / 2
    return { scale: baseScale, x: baseX, y: baseY }
  }

  const getSequence = (): { transforms: Transform[]; panels: (number | 'title' | null)[] } => {
    const viewW = window.innerWidth
    const viewH = window.innerHeight

    const transforms: Transform[] = []
    const panels: (number | 'title' | null)[] = []

    transforms.push(fullTransform(viewW, viewH)) // intro full
    panels.push(null)
    transforms.push(fullTransform(viewW, viewH)) // title hold
    panels.push('title')
    transforms.push(fullTransform(viewW, viewH)) // pre-zoom full
    panels.push(null)

    config.points.forEach((p, idx) => {
      const target = toTransform(p.highlight, viewW, viewH)
      transforms.push(target) // zoom to point
      panels.push(null)
      transforms.push(target) // hold + panel
      panels.push(idx)
      transforms.push(target) // pre-zoom (stay) for next move
      panels.push(null)
    })

    transforms.push(fullTransform(viewW, viewH)) // outro full
    panels.push(null)

    return { transforms, panels }
  }

  const update = () => {
    if (!imageReady) return

    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    const total = Math.max(1, rect.height - viewH)
    const progress = clamp((viewH - rect.top) / total)

    const { transforms, panels } = getSequence()
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

    image.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(3)})`

    // Panels
    const translate = (1 - t) * 60
    const visible = t > 0 ? '0.92' : '0'

    titlePanel.style.opacity = activePanel === 'title' ? visible : '0'
    titlePanel.style.transform =
      activePanel === 'title' ? `translate(-50%, ${translate}vh)` : 'translate(-50%, 60vh)'

    pointPanels.forEach((panel, idx) => {
      const isActive = activePanel === idx
      panel.style.opacity = isActive ? visible : '0'
      panel.style.transform = isActive
        ? `translate(-50%, ${translate}vh)`
        : 'translate(-50%, 60vh)'
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
    image.style.width = `${naturalW}px`
    image.style.height = `${naturalH}px`
    imageReady = true
    update()
  }

  if (image.complete) onLoad()
  else image.addEventListener('load', onLoad)

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
}
