type Section06Config = {
  title: string
  titleEmphasis: string
  subtitle: string
  subtitleEmphasis: string
  imageDesktop: string
  imageMobile: string
}

export function renderSection06(config: Section06Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--title-hook'
  section.id = 'section-06'

  const media = document.createElement('picture')
  media.className = 'title-hook__media'
  media.innerHTML = `
    <source media="(max-width: 900px)" srcset="${config.imageMobile}">
    <source media="(min-width: 901px)" srcset="${config.imageDesktop}">
    <img src="${config.imageDesktop}" alt="">
  `

  const text = document.createElement('div')
  text.className = 'title-hook__text'
  text.innerHTML = `
    <h2>${config.title} <span>${config.titleEmphasis}</span></h2>
  `

  const bottom = document.createElement('div')
  bottom.className = 'title-hook__bottom'
  bottom.innerHTML = `
    <h3>${config.subtitle} <span>${config.subtitleEmphasis}</span></h3>
  `

  section.appendChild(media)
  section.appendChild(text)
  section.appendChild(bottom)

  return section
}
