type Section07Config = {
  title: string
  paragraphOne: string
  paragraphTwo: string
  ctaTitle: string
  ctaButtonImage: string
  gifImage: string
}

export function renderSection07(config: Section07Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--confirmshaming'
  section.id = 'section-07'

  const top = document.createElement('div')
  top.className = 'confirmshaming__top'
  top.innerHTML = `
    <h2>${config.title}</h2>
    <p>${config.paragraphOne}</p>
    <p>${config.paragraphTwo}</p>
  `

  const bottom = document.createElement('div')
  bottom.className = 'confirmshaming__bottom'
  bottom.innerHTML = `
    <div class="confirmshaming__spacer" aria-hidden="true"></div>
    <div class="confirmshaming__cta">
      <h3>${config.ctaTitle}</h3>
      <div class="confirmshaming__actions">
        <img src="${config.ctaButtonImage}" alt="ANO" class="confirmshaming__btn-img">
        <img src="${config.gifImage}" alt="Ne, chci být chudý" class="confirmshaming__gif">
      </div>
    </div>
  `

  section.appendChild(top)
  section.appendChild(bottom)

  return section
}
