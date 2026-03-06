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

type Step = {
  kind: 'hold' | 'zoom' | 'panel'
  from: Transform
  to: Transform
  panel: 'title' | number | null
  weight: number
}

export function renderSection05(config: Section05Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--scrollpoints'
  section.id = 'section-05'

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
          return `<li class="scrollpoints__item-hand">${line.replace(/^👉\s*/, '')}</li>`
        }
        const cleaned = line.replace(/^[\-–•]+\s*/, '')
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
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const toTransform = (
    highlight: ScrollpointHighlight,
    viewW: number,
    viewH: number,
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
    const zoom = Math.min(3.6, Math.max(1.1, Math.min(scaleX, scaleY) * 0.92))

    const totalScale = baseScale * zoom
    const x = baseX - centerX * baseScale * zoom + viewW / 2
    const y = baseY - centerY * baseScale * zoom + viewH / 2

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

  const buildSteps = (): Step[] => {
    const viewW = window.innerWidth
    const viewH = window.innerHeight
    const isMobile = viewW <= 900
    const fitWidth = isMobile

    const steps: Step[] = []
    const full = fullTransform(viewW, viewH, fitWidth)

    steps.push({ kind: 'hold', from: full, to: full, panel: null, weight: 0.8 })
    steps.push({ kind: 'panel', from: full, to: full, panel: 'title', weight: 1.2 })

    let current = full
    config.points.forEach((p, idx) => {
      const target = toTransform(p.highlight, viewW, viewH, fitWidth)
      steps.push({ kind: 'zoom', from: current, to: target, panel: null, weight: 0.7 })
      steps.push({ kind: 'panel', from: target, to: target, panel: idx, weight: 1.6 })
      current = target
    })

    steps.push({ kind: 'zoom', from: current, to: full, panel: null, weight: 0.7 })

    return steps
  }

  const updateSectionHeight = () => {
    const viewW = window.innerWidth
    const isMobile = viewW <= 900
    const steps = config.points.length * 2 + 3
    const stepHeight = isMobile ? 220 : 200
    section.style.minHeight = `${steps * stepHeight}vh`
  }

  const update = () => {
    if (!imageReady) return

    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    const total = Math.max(1, rect.height - viewH)
    const progress = clamp((viewH - rect.top) / total)

    const steps = buildSteps()
    const totalWeight = steps.reduce((sum, s) => sum + s.weight, 0)
    const target = progress * totalWeight

    let acc = 0
    let stepIndex = 0
    while (stepIndex < steps.length && acc + steps[stepIndex].weight < target) {
      acc += steps[stepIndex].weight
      stepIndex += 1
    }
    const step = steps[Math.min(stepIndex, steps.length - 1)]
    const localT = step.weight ? (target - acc) / step.weight : 0
    const t = smoothstep(0, 1, localT)

    const from = step.from
    const to = step.to
    const scale = lerp(from.scale, to.scale, t)
    const x = lerp(from.x, to.x, t)
    const y = lerp(from.y, to.y, t)

    imageWrap.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(3)})`

    const panelTranslate = lerp(110, -90, t)
    const panelOpacity = step.panel !== null ? 0.92 : 0

    titlePanel.style.opacity = step.panel === 'title' ? String(panelOpacity) : '0'
    titlePanel.style.transform =
      step.panel === 'title' ? `translate(-50%, ${panelTranslate}vh)` : 'translate(-50%, 110vh)'

    pointPanels.forEach((panel, idx) => {
      const isActive = step.panel === idx
      panel.style.opacity = isActive ? String(panelOpacity) : '0'
      panel.style.transform = isActive
        ? `translate(-50%, ${panelTranslate}vh)`
        : 'translate(-50%, 110vh)'
    })
  }

  const onResize = () => {
    updateSectionHeight()
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
    updateSectionHeight()
    update()
  }

  if (image.complete) onLoad()
  else image.addEventListener('load', onLoad)

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
}
