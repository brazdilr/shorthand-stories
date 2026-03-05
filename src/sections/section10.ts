type RevealPanel = {
  html: string
}

type Section10Config = {
  imageOne: string
  imageTwo: string
  imageThree: string
  imageOneMobile: string
  imageTwoMobile: string
  imageThreeMobile: string
  panel: RevealPanel
}

export function renderSection10(config: Section10Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--reveal section--reveal-3'
  section.id = 'section-10'

  const reveal = document.createElement('div')
  reveal.className = 'reveal'

  const media = document.createElement('div')
  media.className = 'reveal__media'
  media.innerHTML = `
    <picture class="reveal__image reveal__image--a">
      <source media="(max-width: 900px)" srcset="${config.imageOneMobile}">
      <img src="${config.imageOne}" alt="">
    </picture>
    <picture class="reveal__image reveal__image--b">
      <source media="(max-width: 900px)" srcset="${config.imageTwoMobile}">
      <img src="${config.imageTwo}" alt="">
    </picture>
    <picture class="reveal__image reveal__image--c">
      <source media="(max-width: 900px)" srcset="${config.imageThreeMobile}">
      <img src="${config.imageThree}" alt="">
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

export function bindRevealTripleSection(section: HTMLElement): void {
  const imageA = section.querySelector<HTMLElement>('.reveal__image--a')
  const imageB = section.querySelector<HTMLElement>('.reveal__image--b')
  const imageC = section.querySelector<HTMLElement>('.reveal__image--c')
  const panelA = section.querySelector<HTMLElement>('.reveal__panel--a')

  if (!imageA || !imageB || !imageC || !panelA) return

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
    const progress = clamp((viewH - rect.top) / total, 0, 1.12)

    const fade1 = smoothstep(0.68, 0.88, progress)
    const fade2 = smoothstep(0.92, 1.08, progress)

    imageA.style.opacity = (1 - fade1).toFixed(3)
    imageB.style.opacity = (fade1 * (1 - fade2)).toFixed(3)
    imageC.style.opacity = fade2.toFixed(3)

    const panelIn = smoothstep(0.42, 0.72, progress)
    const panelOut = smoothstep(0.74, 0.82, progress)
    const panelOpacity = (panelIn > 0 ? 0.92 : 0) * (1 - panelOut)
    const panelTranslate = (1 - panelIn) * 100

    panelA.style.opacity = panelOpacity.toFixed(3)
    panelA.style.transform = `translate(-50%, ${panelTranslate}vh)`

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
