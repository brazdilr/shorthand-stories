type IntroConfig = {
  title: string
  subtitle: string
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
    <h2>${config.subtitle}</h2>
  `

  introSection.appendChild(introMedia)
  introSection.appendChild(introOverlay)
  introSection.appendChild(introText)

  return introSection
}
