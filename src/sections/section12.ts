type RevealPanel = {
  html: string
}

type Section12Config = {
  imageOne: string
  imageOneMobile: string
  imageTwo: string
  imageTwoMobile: string
  imageThree: string
  imageThreeMobile: string
  imageFour: string
  imageFourMobile: string
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
    <picture class="reveal__image reveal__image--d">
      <source media="(max-width: 900px)" srcset="${config.imageFourMobile}">
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
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  let ticking = false

  const update = () => {
    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    const isMobile = window.innerWidth <= 900
    const total = Math.max(1, rect.height - viewH)
    const progress = clamp((viewH - rect.top) / total, 0, 1)
    const panelOneStart = isMobile ? 0.08 : 0.1
    const panelOneEnd = isMobile ? 0.42 : 0.4
    const transitionsStart = panelOneEnd + 0.02
    const transitionsEnd = isMobile ? 0.72 : 0.7
    const panelTwoStart = transitionsEnd + 0.03
    const panelTwoEnd = 1
    const exitDistance = isMobile ? 175 : 150

    const panelOneProgress = clamp((progress - panelOneStart) / (panelOneEnd - panelOneStart))
    const panelOneOpacity =
      smoothstep(panelOneStart, panelOneStart + 0.1, progress) *
      (1 - smoothstep(panelOneEnd - 0.12, panelOneEnd, progress)) *
      0.92
    const panelOneTranslate = lerp(120, -exitDistance, panelOneProgress)

    const panelTwoProgress = clamp((progress - panelTwoStart) / (panelTwoEnd - panelTwoStart))
    const panelTwoOpacityIn = smoothstep(panelTwoStart, panelTwoStart + 0.12, progress) * 0.92
    const panelTwoTranslate = lerp(120, -exitDistance, panelTwoProgress)

    panelA.style.opacity = panelOneOpacity.toFixed(3)
    panelA.style.transform = `translate(-50%, ${panelOneTranslate.toFixed(2)}vh)`
    panelB.style.transform = `translate(-50%, ${panelTwoTranslate.toFixed(2)}vh)`

    const panelTwoRect = panelB.getBoundingClientRect()
    const fadeStartY = viewH * 0.5
    const fadeDistance = Math.max(viewH * 0.35, panelTwoRect.height * 0.7)
    const fadeEndY = fadeStartY - fadeDistance
    const panelTwoOutByPosition = 1 - smoothstep(fadeEndY, fadeStartY, panelTwoRect.bottom)
    const panelTwoOpacity = panelTwoOpacityIn * (1 - panelTwoOutByPosition)
    panelB.style.opacity = panelTwoOpacity.toFixed(3)

    if (progress <= transitionsStart) {
      imageA.style.opacity = '1'
      imageB.style.opacity = '0'
      imageC.style.opacity = '0'
      imageD.style.opacity = '0'
      imageC.style.clipPath = 'inset(100% 0 0 0)'
    } else if (progress >= transitionsEnd) {
      imageA.style.opacity = '0'
      imageB.style.opacity = '0'
      imageC.style.opacity = '0'
      imageD.style.opacity = '1'
      imageC.style.clipPath = 'inset(0 0 0 0)'
    } else {
      const transitionProgress = clamp(
        (progress - transitionsStart) / (transitionsEnd - transitionsStart)
      )
      const fadeAB = smoothstep(0, 0.34, transitionProgress)
      const wipeC = smoothstep(0.34, 0.72, transitionProgress)
      const fadeCD = smoothstep(0.72, 1, transitionProgress)

      imageA.style.opacity = (1 - fadeAB).toFixed(3)
      imageB.style.opacity = (fadeAB * (1 - wipeC)).toFixed(3)
      imageC.style.opacity = (1 - fadeCD).toFixed(3)
      imageD.style.opacity = fadeCD.toFixed(3)
      imageC.style.clipPath = `inset(${((1 - wipeC) * 100).toFixed(2)}% 0 0 0)`
    }

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
