import './style.css'
import sections from './content/sections.json'
import { renderIntro, bindIntroScrollEffect } from './sections/intro'
import { renderSection03 } from './sections/section03'
import { renderSection04, bindRevealSection } from './sections/section04'

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

const section04 = renderSection04({
  imagePrimary: '/cdn/texty-ktere-manipuluji/assets/ienKvNGI8G/tohle-ude-lej-tamto-nede-lej-2-2560x1440.jpg',
  imageSecondary:
    '/cdn/texty-ktere-manipuluji/assets/vqEbCHpy1T/tohle-ude-lej-tamto-nede-lej-2-bw-0.9-2560x1440.jpg',
  imagePrimaryMobile:
    '/cdn/texty-ktere-manipuluji/assets/9h5PyNAwHM/tohle-ude-lej-tamto-nede-lej-1080-x-1920-px-4-1080x1920.jpg',
  imageSecondaryMobile:
    '/cdn/texty-ktere-manipuluji/assets/p9jyvKtbLZ/tohle-ude-lej-tamto-nede-lej-1080-x-1920-px-4-bw-0.8-1080x1920.jpg',
  panelOne: {
    html: `
      <p>S partou zlounů se scházíme v klubu <strong>„Dark Patterns“</strong>.</p>
      <p>Společně tvoříme tým temných vzorců. Vzájemně si pomáháme a hledáme cesty, jak tě <strong>zmást</strong> a <strong>nachytat</strong>.</p>
    `
  },
  panelTwo: {
    html: `
      <div class=\"reveal__icon\" aria-hidden=\"true\">💡</div>
      <p><em>Dark pattern</em> neboli <em>„temný vzorec“</em> je záměrně navržený prvek na webových stránkách nebo v aplikacích, který má uživatele <strong>zmást</strong> nebo <strong>přimět k rozhodnutí</strong>, které by jinak neudělal.</p>
      <p>Cílem je často získat více peněz, osobních údajů nebo udržet uživatele na platformě déle, než by chtěl.</p>
    `
  }
})

main.appendChild(section04)

// Skeleton for remaining sections
for (const section of data) {
  if (section.id === 'section-AvJwMOfx9A' || section.id === 'section-PLlFDwqZ6E') continue
  if (section.id === 'section-raFgNq0Y2f') continue
  if (section.id === 'section-sj4CQ5AJy9') continue

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
bindRevealSection(section04)
