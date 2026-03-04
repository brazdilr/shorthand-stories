type Section03Config = {
  headingOne: string
  paragraphOne: string
  paragraphTwo: string
  headingTwo: string
  paragraphThree: string
  paragraphFour: string
  image: string
}

export function renderSection03(config: Section03Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--text-media'
  section.id = 'section-03'

  const content = document.createElement('div')
  content.className = 'text-media'

  const text = document.createElement('div')
  text.className = 'text-media__text'
  text.innerHTML = `
    <h2>${config.headingOne}</h2>
    <p>${config.paragraphOne}</p>
    <p>${config.paragraphTwo}</p>
    <div class="text-media__spacer" aria-hidden="true"></div>
    <h2>${config.headingTwo}</h2>
    <p>${config.paragraphThree}</p>
    <p>${config.paragraphFour}</p>
  `

  const media = document.createElement('div')
  media.className = 'text-media__media'
  media.innerHTML = `
    <img src="${config.image}" alt="">
  `

  content.appendChild(text)
  content.appendChild(media)
  section.appendChild(content)

  return section
}
