type Section09Config = {
  title: string
  body: string
  gif: string
}

export function renderSection09(config: Section09Config): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section section--urgency'
  section.id = 'section-09'

  const wrap = document.createElement('div')
  wrap.className = 'urgency'
  wrap.innerHTML = `
    <h2>${config.title}</h2>
    <p>${config.body}</p>
    <hr>
    <img src="${config.gif}" alt="">
    <hr>
  `

  section.appendChild(wrap)
  return section
}
