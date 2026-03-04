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
  const steps = config.points.length + 3
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

  const getTransforms = (): Transform[] => {
    const viewW = window.innerWidth
    const viewH = window.innerHeight

    const transforms: Transform[] = []
    transforms.push(fullTransform(viewW, viewH)) // intro full
    transforms.push(fullTransform(viewW, viewH)) // title full

    for (const p of config.points) {
      transforms.push(toTransform(p.highlight, viewW, viewH))
    }

    transforms.push(fullTransform(viewW, viewH)) // outro full

    return transforms
  }

  const update = () => {
    if (!imageReady) return

    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    const total = Math.max(1, rect.height - viewH)
    const progress = clamp((viewH - rect.top) / total)

    const transforms = getTransforms()
    const steps = transforms.length

    const stepFloat = progress * (steps - 1)
    const step = Math.min(steps - 2, Math.floor(stepFloat))
    const t = ease(stepFloat - step)

    const a = transforms[step]
    const b = transforms[step + 1]

    const scale = a.scale + (b.scale - a.scale) * t
    const x = a.x + (b.x - a.x) * t
    const y = a.y + (b.y - a.y) * t

    image.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(3)})`

    // Panels
    const titleIndex = 1
    const firstPointIndex = 2
    const lastPointIndex = 1 + config.points.length

    const panelMove = (pStart: number, pEnd: number) => {
      const local = clamp((stepFloat - pStart) / (pEnd - pStart))
      const eased = ease(local)
      const translate = (1 - eased) * 60
      const visible = local > 0 ? 0.92 : 0
      return { translate, visible }
    }

    const showTitle = stepFloat >= titleIndex && stepFloat < firstPointIndex
    const titleMotion = panelMove(titleIndex, firstPointIndex)
    titlePanel.style.opacity = showTitle ? String(titleMotion.visible) : '0'
    titlePanel.style.transform = showTitle
      ? `translate(-50%, ${titleMotion.translate}vh)`
      : 'translate(-50%, 60vh)'

    pointPanels.forEach((panel, idx) => {
      const panelStep = firstPointIndex + idx
      const nextStep = panelStep + 1
      const inRange = stepFloat >= panelStep && stepFloat < nextStep
      const motion = panelMove(panelStep, nextStep)
      panel.style.opacity = inRange ? String(motion.visible) : '0'
      panel.style.transform = inRange
        ? `translate(-50%, ${motion.translate}vh)`
        : 'translate(-50%, 60vh)'
    })

    if (stepFloat > lastPointIndex + 0.2) {
      titlePanel.style.opacity = '0'
      pointPanels.forEach((panel) => (panel.style.opacity = '0'))
    }
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
