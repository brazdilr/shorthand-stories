type RevealPanel = {
  html: string
}

type Section12Config = {
  imageOne: string
  imageTwo: string
  imageThree: string
  imageFour: string
  panelOne: RevealPanel
  panelTwo: RevealPanel
}

export function renderSection12(config: Section12Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--reveal section--reveal-4'
  section.id = 'section-plPovg4FLR'

  const reveal = document.createElement('div')
  reveal.className = 'reveal'

  const media = document.createElement('div')
  media.className = 'reveal__media'
  media.innerHTML = `
    <picture class="reveal__image reveal__image--a">
      <img src="${config.imageOne}" alt="">
    </picture>
    <picture class="reveal__image reveal__image--b">
      <img src="${config.imageTwo}" alt="">
    </picture>
    <picture class="reveal__image reveal__image--c">
      <img src="${config.imageThree}" alt="">
    </picture>
    <picture class="reveal__image reveal__image--d">
      <img src="${config.imageFour}" alt="">
    </picture>
  `

  const panels = document.createElement('div')
  panels.className = 'reveal__panels'
  panels.innerHTML = `
    <div class="reveal__panel reveal__panel--a reveal__panel--center reveal__panel--dark">
      ${config.panelOne.html}
    </div>
    <div class="reveal__panel reveal__panel--b reveal__panel--center reveal__panel--dark">
      ${config.panelTwo.html}
    </div>
  `

  reveal.appendChild(media)
  reveal.appendChild(panels)
  section.appendChild(reveal)

  return section
}

export function bindRevealQuadSection(section: HTMLElement): void {
  const imageA = section.querySelector<HTMLElement>('.reveal__image--a')
  const imageB = section.querySelector<HTMLElement>('.reveal__image--b')
  const imageC = section.querySelector<HTMLElement>('.reveal__image--c')
  const imageD = section.querySelector<HTMLElement>('.reveal__image--d')
  const panelA = section.querySelector<HTMLElement>('.reveal__panel--a')
  const panelB = section.querySelector<HTMLElement>('.reveal__panel--b')

  if (!imageA || !imageB || !imageC || !imageD || !panelA || !panelB) return

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
    const progress = clamp((viewH - rect.top) / total, 0, 1)

    const fade1 = smoothstep(0.2, 0.4, progress)
    const wipe2 = smoothstep(0.45, 0.65, progress)
    const fade3 = smoothstep(0.75, 0.9, progress)

    imageA.style.opacity = (1 - fade1).toFixed(3)
    imageB.style.opacity = fade1.toFixed(3)
    imageC.style.opacity = (1 - fade3).toFixed(3)
    imageC.style.clipPath = `inset(${(1 - wipe2) * 100}% 0 0 0)`
    imageD.style.opacity = fade3.toFixed(3)

    const panelOneIn = smoothstep(0.15, 0.32, progress)
    const panelOneOut = smoothstep(0.34, 0.48, progress)
    const panelTwoIn = smoothstep(0.82, 0.98, progress)

    const panelOneOpacity = panelOneIn > 0 ? 0.92 : 0
    const panelTwoOpacity = panelTwoIn > 0 ? 0.92 : 0

    const panelOneTranslate = (1 - panelOneIn) * 110 - panelOneOut * 130
    const panelTwoTranslate = (1 - panelTwoIn) * 110 - smoothstep(0.98, 1.0, progress) * 130

    panelA.style.opacity = panelOneOpacity.toFixed(3)
    panelA.style.transform = `translate(-50%, ${panelOneTranslate}vh)`

    panelB.style.opacity = panelTwoOpacity.toFixed(3)
    panelB.style.transform = `translate(-50%, ${panelTwoTranslate}vh)`

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
