type IntroConfig = {
  title: string
  subtitle: string
  subtitleMobile?: string
  imageDesktop: string
  imageMobile: string
}

export function renderIntro(config: IntroConfig): HTMLElement {
  const introSection = document.createElement('section')
  introSection.className = 'section section--intro'
  introSection.id = 'intro'

  const introMedia = document.createElement('picture')
  introMedia.className = 'intro__media'
  introMedia.innerHTML = `
    <source media="(max-width: 900px)" srcset="${config.imageMobile}">
    <source media="(min-width: 901px)" srcset="${config.imageDesktop}">
    <img src="${config.imageDesktop}" alt="">
  `

  const introOverlay = document.createElement('div')
  introOverlay.className = 'intro__overlay'

  const introText = document.createElement('div')
  introText.className = 'intro__text'
  introText.innerHTML = `
    <h1>${config.title}</h1>
    <h2 class="intro__subtitle intro__subtitle--desktop">${config.subtitle}</h2>
    <h2 class="intro__subtitle intro__subtitle--mobile">${config.subtitleMobile ?? config.subtitle}</h2>
  `

  introSection.appendChild(introMedia)
  introSection.appendChild(introOverlay)
  introSection.appendChild(introText)

  return introSection
}

export function bindIntroScrollEffect(section: HTMLElement): void {
  const text = section.querySelector<HTMLElement>('.intro__text')
  if (!text) return

  let ticking = false

  const update = () => {
    const viewport = window.innerHeight
    const scrolled = Math.max(0, Math.min(viewport, window.scrollY))
    const t = scrolled / Math.max(1, viewport * 0.75)

    const blur = Math.min(10, t * 10)
    const opacity = Math.max(0, 1 - t * 0.5)

    text.style.filter = `blur(${blur.toFixed(2)}px)`
    text.style.opacity = opacity.toFixed(3)
    ticking = false
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  update()
}
