import './style.css'
import sections from './content/sections.json'
import { renderIntro, bindIntroScrollEffect } from './sections/intro'
import { renderSection03 } from './sections/section03'

type Section = {
  id: string
  type: string
  title?: string | null
}

const data = sections as Section[]

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Missing #app')

const main = document.createElement('main')
main.className = 'page'

const introSection = renderIntro({
  title: 'Jsme Manipuláci',
  subtitle: 'Texty, které nehrají fér',
  subtitleMobile: 'Texty, co nehrají fér',
  imageDesktop: '/cdn/texty-ktere-manipuluji/assets/7A7oV03y6P/tohle-ude-lej-tamto-nede-lej-1-2560x1440.jpg',
  imageMobile: '/cdn/texty-ktere-manipuluji/assets/HCEv8Smugo/tohle-ude-lej-tamto-nede-lej-1080-x-1920-px-1-1080x1920.jpg'
})

main.appendChild(introSection)

const section03 = renderSection03({
  headingOne: 'Víme, jak na tebe',
  paragraphOne:
    'Jsme <strong>malé textové mršky</strong> a s tvým mozkem to umíme. Dokážeme tě zmást, dojmout, vystrašit, přemluvit… Ovládáme totiž silné manipulativní techniky – často pak uděláš, co po tobě chceme.',
  paragraphTwo:
    'Víš, co je nejlepší? <strong>Budeš si myslet, že to sám chceš.</strong> Že je to pro tebe nejlepší. No, většinou není. 😈',
  headingTwo: 'Vetřeme se všude',
  paragraphThree:
    'Najdeš nás hlavně na <strong>webech</strong>, v <strong>e-mailech</strong> nebo na <strong>reklamních plochách</strong>. Občas nás někdo použije záměrně, občas nevědomky. Ale milují nás všichni, kteří nehrají férovou komunikační hru.',
  paragraphFour:
    'Objevujeme se i v <strong>běžné komunikaci</strong>. Třeba argumentační fauly? I v těch máme prsty my.',
  image: '/cdn/texty-ktere-manipuluji/assets/GuLQgPs35V/na-vrh-bez-na-zvu-2.gif'
})

main.appendChild(section03)

// Skeleton for remaining sections
for (const section of data) {
  if (section.id === 'section-AvJwMOfx9A' || section.id === 'section-PLlFDwqZ6E') continue
  if (section.id === 'section-raFgNq0Y2f') continue

  const el = document.createElement('section')
  el.className = `section section--${section.type.toLowerCase()}`
  el.id = section.id

  const label = document.createElement('div')
  label.className = 'section__label'
  label.textContent = `${section.type} · ${section.id}`

  if (section.title) {
    const h = document.createElement('h3')
    h.textContent = section.title
    label.appendChild(h)
  }

  el.appendChild(label)
  main.appendChild(el)
}

app.appendChild(main)

bindIntroScrollEffect(introSection)
