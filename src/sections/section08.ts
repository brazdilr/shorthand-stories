type RevealPanel = {
  html: string
}

type Section08Config = {
  imagePrimary: string
  imageSecondary: string
  imagePrimaryMobile: string
  imageSecondaryMobile: string
  panel: RevealPanel
}

export function renderSection08(config: Section08Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--reveal section--reveal-wipe'
  section.id = 'section-08'

  const reveal = document.createElement('div')
  reveal.className = 'reveal reveal--wipe'

  const media = document.createElement('div')
  media.className = 'reveal__media'
  media.innerHTML = `
    <picture class="reveal__image reveal__image--a">
      <source media="(max-width: 900px)" srcset="${config.imagePrimaryMobile}">
      <img src="${config.imagePrimary}" alt="">
    </picture>
    <picture class="reveal__image reveal__image--b">
      <source media="(max-width: 900px)" srcset="${config.imageSecondaryMobile}">
      <img src="${config.imageSecondary}" alt="">
    </picture>
  `

  const panels = document.createElement('div')
  panels.className = 'reveal__panels'
  panels.innerHTML = `
    <div class="reveal__panel reveal__panel--a reveal__panel--center">${config.panel.html}</div>
  `

  reveal.appendChild(media)
  reveal.appendChild(panels)
  section.appendChild(reveal)

  return section
}

export function bindRevealWipeSection(section: HTMLElement): void {
  const imageB = section.querySelector<HTMLElement>('.reveal__image--b')
  const panelA = section.querySelector<HTMLElement>('.reveal__panel--a')

  if (!imageB || !panelA) return

  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = clamp((x - edge0) / (edge1 - edge0))
    return t * t * (3 - 2 * t)
  }

  let ticking = false

  const update = () => {
    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    const total = Math.max(1, rect.height - viewH)
    const progress = clamp((viewH - rect.top) / total, 0, 1.2)

    const panelIn = smoothstep(0.45, 0.72, progress)
    const panelOut = smoothstep(0.7, 0.86, progress)
    const panelOpacity = panelIn > 0 ? 0.92 : 0
    const panelTranslate = (1 - panelIn) * 110 - panelOut * 90

    panelA.style.opacity = panelOpacity.toFixed(3)
    panelA.style.transform = `translate(-50%, ${panelTranslate}vh)`

    const wipe = smoothstep(0.78, 1.08, progress)
    const insetTop = (1 - wipe) * 100
    imageB.style.clipPath = `inset(${insetTop}% 0 0 0)`

    ticking = false
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  update()
}
