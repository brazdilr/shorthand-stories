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

type Section11Config = {
  image: string
  title: string
  points: Scrollpoint[]
  showDots?: boolean
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

const buildParagraphs = (text: string): string[] => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const paragraphs: string[] = []
  let current = ''

  const flush = () => {
    if (current.trim()) paragraphs.push(current.trim())
    current = ''
  }

  lines.forEach((line) => {
    if (!current) {
      current = line
      return
    }

    const prev = current.trim()
    const prevEnds = /[.!?…“”"]$/.test(prev)
    const startsWithQuote = line.startsWith('„')
    const startsWithPunct = /^[,.;:]/.test(line)
    const startsWithLower = /^[a-zá-ž]/.test(line)

    if (startsWithQuote) {
      flush()
      current = line
      return
    }

    if (!prevEnds || startsWithLower || startsWithPunct) {
      current += `${startsWithPunct ? '' : ' '}${line}`
      return
    }

    flush()
    current = line
  })

  flush()
  return paragraphs
}

export function renderSection11(config: Section11Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--scrollpoints section--scrollpoints-light'
  section.id = 'section-xKuIz5o0hQ'

  const wrap = document.createElement('div')
  wrap.className = 'scrollpoints scrollpoints--right scrollpoints--light'

  const media = document.createElement('div')
  media.className = 'scrollpoints__media'

  const dots = config.showDots
    ? config.points
        .map((p) => p.dot)
        .filter((d): d is { x: number; y: number } => Boolean(d))
        .map(
          (d) =>
            `<span class="scrollpoints__dot" style="left:${d.x}%; top:${d.y}%;"></span>`
        )
        .join('')
    : ''

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

    if (!p.text.trim()) {
      panel.classList.add('scrollpoints__panel--note')
      panel.innerHTML = `<p>${p.title}</p>`
      panels.appendChild(panel)
      return
    }

    const paragraphs = buildParagraphs(p.text)
      .map((line) => `<p>${line}</p>`)
      .join('')

    panel.innerHTML = `
      <h4>${p.title}</h4>
      ${paragraphs}
    `
    panels.appendChild(panel)
  })

  wrap.appendChild(media)
  wrap.appendChild(panels)
  section.appendChild(wrap)

  return section
}

export function bindScrollpointsSectionRight(
  section: HTMLElement,
  config: Section11Config
): void {
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
    fitWidth: boolean,
    boost: number,
    focusX: number
  ): Transform => {
    const baseScaleRaw = fitWidth
      ? viewW / naturalW
      : Math.max(viewW / naturalW, viewH / naturalH)
    const baseScale = baseScaleRaw * boost
    const baseX = fitWidth ? 0 : (viewW - naturalW * baseScale) / 2
    const baseY = (viewH - naturalH * baseScale) / 2

    const boxW = (highlight.width / 100) * naturalW
    const boxH = (highlight.height / 100) * naturalH
    const centerX = (highlight.x / 100) * naturalW + boxW / 2
    const centerY = (highlight.y / 100) * naturalH + boxH / 2

    const scaleX = viewW / (boxW * baseScale)
    const scaleY = viewH / (boxH * baseScale)
    const zoom = Math.min(4.5, Math.max(1.1, Math.min(scaleX, scaleY) * 1.15))

    const totalScale = baseScale * zoom
    const x = baseX - centerX * baseScale * zoom + viewW * focusX
    const y = baseY - centerY * baseScale * zoom + viewH / 2

    return { scale: totalScale, x, y }
  }

  const fullTransform = (
    viewW: number,
    viewH: number,
    fitWidth: boolean,
    boost: number
  ): Transform => {
    const baseScaleRaw = fitWidth
      ? viewW / naturalW
      : Math.max(viewW / naturalW, viewH / naturalH)
    const baseScale = baseScaleRaw * boost
    const baseX = fitWidth ? 0 : (viewW - naturalW * baseScale) / 2
    const baseY = (viewH - naturalH * baseScale) / 2
    return { scale: baseScale, x: baseX, y: baseY }
  }

  const buildSteps = (): Step[] => {
    const viewW = window.innerWidth
    const viewH = window.innerHeight
    const isMobile = viewW <= 900
    const fitWidth = isMobile
    const boost = isMobile ? 1.2 : 1.0
    const focusX = isMobile ? 0.5 : 0.25

    const steps: Step[] = []
    const full = fullTransform(viewW, viewH, fitWidth, boost)

    steps.push({ kind: 'hold', from: full, to: full, panel: null, weight: 0.8 })
    steps.push({ kind: 'panel', from: full, to: full, panel: 'title', weight: 1.2 })

    let current = full
    config.points.forEach((p, idx) => {
      const target = toTransform(p.highlight, viewW, viewH, fitWidth, 1, focusX)
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
      step.panel === 'title' ? `translate(0, ${panelTranslate}vh)` : 'translate(0, 110vh)'

    pointPanels.forEach((panel, idx) => {
      const isActive = step.panel === idx
      panel.style.opacity = isActive ? String(panelOpacity) : '0'
      panel.style.transform = isActive
        ? `translate(0, ${panelTranslate}vh)`
        : 'translate(0, 110vh)'
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
