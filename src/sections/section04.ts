type RevealPanel = {
  html: string
  variant?: 'light'
}

type Section04Config = {
  imagePrimary: string
  imageSecondary: string
  imagePrimaryMobile: string
  imageSecondaryMobile: string
  panelOne: RevealPanel
  panelTwo: RevealPanel
}

export function renderSection04(config: Section04Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--reveal'
  section.id = 'section-04'

  const reveal = document.createElement('div')
  reveal.className = 'reveal'

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
    <div class="reveal__panel reveal__panel--a">${config.panelOne.html}</div>
    <div class="reveal__panel reveal__panel--b">${config.panelTwo.html}</div>
  `

  reveal.appendChild(media)
  reveal.appendChild(panels)
  section.appendChild(reveal)

  return section
}

export function bindRevealSection(section: HTMLElement): void {
  const imageA = section.querySelector<HTMLElement>('.reveal__image--a')
  const imageB = section.querySelector<HTMLElement>('.reveal__image--b')
  const panelA = section.querySelector<HTMLElement>('.reveal__panel--a')
  const panelB = section.querySelector<HTMLElement>('.reveal__panel--b')

  if (!imageA || !imageB || !panelA || !panelB) return

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

    const fade = smoothstep(0.75, 0.95, progress)
    imageA.style.opacity = (1 - fade).toFixed(3)
    imageB.style.opacity = fade.toFixed(3)

    const panelAIn = smoothstep(0.55, 0.88, progress)
    const panelAOut = smoothstep(0.78, 0.9, progress)
    const panelAOpacity = (panelAIn > 0 ? 0.92 : 0) * (1 - panelAOut)
    const panelATranslate = (1 - panelAIn) * 100

    panelA.style.opacity = panelAOpacity.toFixed(3)
    panelA.style.transform = `translate(-50%, ${panelATranslate}vh)`

    const panelBIn = smoothstep(0.9, 1.2, progress)
    const panelBOpacity = panelBIn > 0 ? 0.92 : 0
    const panelBTranslate = (1 - panelBIn) * 100

    panelB.style.opacity = panelBOpacity.toFixed(3)
    panelB.style.transform = `translate(-50%, ${panelBTranslate}vh)`

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
