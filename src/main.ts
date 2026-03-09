import './style.css'
import sections from './content/sections.json'
import scrollpoints from './content/scrollpoints.json'
import { renderIntro, bindIntroScrollEffect } from './sections/intro'
import { renderSection03 } from './sections/section03'
import { renderSection04, bindRevealSection } from './sections/section04'
import { renderSection05, bindScrollpointsSection } from './sections/section05'
import { renderSection06 } from './sections/section06'
import { renderSection07 } from './sections/section07'
import { renderSection08, bindRevealWipeSection } from './sections/section08'
import { renderSection09 } from './sections/section09'
import { renderSection10, bindRevealTripleSection } from './sections/section10'
import { renderSection11, bindScrollpointsSectionRight } from './sections/section11'
import { renderSection12, bindRevealQuadSection } from './sections/section12'

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

const scrollSection = (scrollpoints as { id: string; points: any[] }[]).find(
  (s) => s.id === 'section-wb5nRYcr0e'
)

const scrollPoints = (scrollSection?.points ?? [])
  .map((p: { text: string; box: { highlights: { x: number; y: number; width: number; height: number; dotX?: number; dotY?: number }[] } }) => {
    const text = p.text?.trim?.() ?? ''
    if (!text) return null
    const [titleLine, ...rest] = text.split('\n')
    const body = rest.join('\n').trim()
    const highlight = p.box?.highlights?.[0]
    if (!highlight) return null
    if (!body) return null
    return {
      title: titleLine,
      text: body,
      highlight: {
        x: highlight.x,
        y: highlight.y,
        width: highlight.width,
        height: highlight.height
      },
      dot:
        highlight.dotX !== undefined && highlight.dotY !== undefined
          ? { x: highlight.dotX, y: highlight.dotY }
          : null
    }
  })
  .filter(Boolean) as {
    title: string
    text: string
    highlight: { x: number; y: number; width: number; height: number }
    dot: { x: number; y: number } | null
  }[]

const section05 = renderSection05({
  image: '/cdn/texty-ktere-manipuluji/assets/aRguPfGB83/0000-1.jpg',
  title: 'KDO JE V NAŠEM KLUBU:',
  points: scrollPoints
})

main.appendChild(section05)

const section06 = renderSection06({
  title: 'Jak chytáme',
  titleEmphasis: 'na háček?',
  subtitle: 'Používáme',
  subtitleEmphasis: 'manipulativní techniky:',
  imageDesktop: '/cdn/texty-ktere-manipuluji/assets/LITXJKbsSd/8-2560x1440.jpg',
  imageMobile: '/cdn/texty-ktere-manipuluji/assets/3u0hU2Mgb4/2-1080x1920.jpg'
})

main.appendChild(section06)

const section07 = renderSection07({
  title: 'I. CONFIRMSHAMING',
  paragraphOne:
    'Měl by ses <strong>stydět</strong> nebo aspoň <strong>cítit hloupě</strong>. Teda v případě, že se chystáš udělat krok, který se nám nehodí do krámu.',
  paragraphTwo:
    '<strong>Confirmshaming</strong> využíváme hlavně u odmítacích tlačítek. Volíme negativní formulace, aby tvůj mozek hledal cestu, jak se „špatnému“ rozhodnutí vyhnout.',
  ctaTitle: 'Chceš zhodnotit své úspory?',
  ctaButtonImage: '/cdn/texty-ktere-manipuluji/assets/jUgQ8qL7tf/ano-380x80.png',
  gifImage: '/cdn/texty-ktere-manipuluji/assets/confirmshaming/chces-byt-chudy.gif'
})

main.appendChild(section07)

const section08 = renderSection08({
  imagePrimary: '/cdn/texty-ktere-manipuluji/assets/KcSxn9gFC8/tohle-ude-lej-tamto-nede-lej-3-2560x1440.jpg',
  imageSecondary: '/cdn/texty-ktere-manipuluji/assets/l5FnEkivss/tohle-ude-lej-tamto-nede-lej-4-2560x1440.jpg',
  imagePrimaryMobile:
    '/cdn/texty-ktere-manipuluji/assets/JH3d1Sm5vU/tohle-ude-lej-tamto-nede-lej-1080-x-1920-px-5-1080x1920.jpg',
  imageSecondaryMobile:
    '/cdn/texty-ktere-manipuluji/assets/q6l9VC0ARK/tohle-ude-lej-tamto-nede-lej-1080-x-1920-px-3-1080x1920.jpg',
  panel: {
    html: `
      <h2>II. EMOČNÍ VYDÍRÁNÍ</h2>
      <p>Jde ruku v ruce se shamováním.</p>
      <p>Volíme slůvka, která v tobě cíleně <strong>vyvolají vinu, strach nebo stud</strong>. Zaženeme tě do kouta, abys něco <strong>udělal</strong>, nebo naopak <strong>neudělal</strong>.</p>
    `
  }
})

main.appendChild(section08)

const section09 = renderSection09({
  title: 'III. POCIT NALÉHAVOSTI',
  body: 'Nabídka tu <strong>bude i zítra</strong> ℹ️, ale my spoléháme na tvůj strach, <strong>že něco propásneš</strong>. A ty nakoupíš impulzivně a nebudeš mít čas na rozmyšlenou, jestli tuhle věc nebo službu opravdu chceš a potřebuješ.',
  gif: '/cdn/texty-ktere-manipuluji/assets/urgency/akce-konci.gif'
})

main.appendChild(section09)

const section10 = renderSection10({
  imageOne: '/cdn/texty-ktere-manipuluji/assets/pJeg5z7bfN/posledni-kus0-2560x1440.png',
  imageTwo: '/cdn/texty-ktere-manipuluji/assets/mflhL8sYqM/posledni-kus-2560x1440.jpg',
  imageThree: '/cdn/texty-ktere-manipuluji/assets/DPbp6KK8cM/posledni-kus2-2560x1440.jpg',
  imageOneMobile:
    '/cdn/texty-ktere-manipuluji/assets/JBYBFx3afQ/posledni-kus-mobile3-1080x1920.png',
  imageTwoMobile:
    '/cdn/texty-ktere-manipuluji/assets/sICq8Up1NH/posledni-kus-mobile2-1080x1920.png',
  imageThreeMobile:
    '/cdn/texty-ktere-manipuluji/assets/1v6jrcJSUE/posledni-kus-mobile1-1080x1920.png',
  panel: {
    html: `
      <h2>IV. FALEŠNÝ NEDOSTATEK</h2>
      <p>„<em>Pospěš si, než bude pozdě!</em><br><em>Zbývá jen 1 kus a další už nebudou!</em>“</p>
      <p>Haha, jasně… ve skladu <strong>jich jsou stovky</strong>. Ale to nemůžeš vědět, žejo. Moje práce? Zahrát ti na nervy. Zase využívám tvůj strach, že něco propásneš.</p>
      <p>Čím víc si věříš, že je něčeho málo, tím <strong>víc to chceš</strong>. Tak snadný to je.</p>
    `
  }
})

main.appendChild(section10)

const scrollSectionTwo = (scrollpoints as { id: string; points: any[]; title?: string }[]).find(
  (s) => s.id === 'section-xKuIz5o0hQ'
)

const parseTitleBody = (raw: string) => {
  const lines = raw
    .split('\n')
    .map((line: string) => line.trim())
    .filter(Boolean)
  if (!lines.length) return { title: '', body: '' }

  let title = lines.shift() ?? ''
  const isRomanOnly = /^[IVX]+\\.$/.test(title)
  const next = lines[0]
  const nextIsUpper = next && next === next.toUpperCase()

  if (nextIsUpper && (isRomanOnly || title.endsWith('.') || title.length <= 6)) {
    title = `${title} ${lines.shift()}`.trim()
  }

  const body = lines.join('\n').trim()
  return { title, body }
}

const scrollPointsTwo = (scrollSectionTwo?.points ?? [])
  .map((p: { text: string; box: { highlights: { x: number; y: number; width: number; height: number; dotX?: number; dotY?: number }[] } }) => {
    const text = p.text?.trim?.() ?? ''
    if (!text) return null
    const { title, body } = parseTitleBody(text)
    const highlight = p.box?.highlights?.[0]
    if (!highlight) return null
    if (!body && title === (scrollSectionTwo?.title ?? '')) return null
    return {
      title,
      text: body,
      highlight: {
        x: highlight.x,
        y: highlight.y,
        width: highlight.width,
        height: highlight.height
      },
      dot:
        highlight.dotX !== undefined && highlight.dotY !== undefined
          ? { x: highlight.dotX, y: highlight.dotY }
          : null
    }
  })
  .filter(Boolean) as {
    title: string
    text: string
    highlight: { x: number; y: number; width: number; height: number }
    dot: { x: number; y: number } | null
  }[]

const section11 = renderSection11({
  image: '/cdn/texty-ktere-manipuluji/assets/mEJc9CPbuw/na-vrh-bez-na-zvu-2.jpg',
  title: scrollSectionTwo?.title ?? 'Co ještě umíme?',
  points: scrollPointsTwo,
  showDots: false
})

main.appendChild(section11)

const section12 = renderSection12({
  imageOne: '/cdn/texty-ktere-manipuluji/assets/1baJEP2GHs/tohle-ude-lej-tamto-nede-lej-6-2560x1440.jpg',
  imageOneMobile:
    '/cdn/texty-ktere-manipuluji/assets/1baJEP2GHs/tohle-ude-lej-tamto-nede-lej-6-1650x928.jpg',
  imageTwo: '/cdn/texty-ktere-manipuluji/assets/pIziaamHKN/15-2560x1440.jpg',
  imageTwoMobile: '/cdn/texty-ktere-manipuluji/assets/pIziaamHKN/15-1580x889.jpg',
  imageThree: '/cdn/texty-ktere-manipuluji/assets/jMImon0hCF/16-2560x1440.jpg',
  imageThreeMobile: '/cdn/texty-ktere-manipuluji/assets/jMImon0hCF/16-1557x876.jpg',
  imageFour: '/cdn/texty-ktere-manipuluji/assets/3i0Tm7bcEa/11-fsi9ancgts-0.6-2560x1440.jpg',
  imageFourMobile: '/cdn/texty-ktere-manipuluji/assets/3i0Tm7bcEa/11-fsi9ancgts-0.6-1626x915.jpg',
  panelOne: {
    html: `
      <h2>Prostě nehrajeme fér.</h2>
      <p>Ale máme sourozence Persvazáky, kteří pravidla ctí.</p>
      <p>Jedno máme společné – oba umíme pracovat s kognitivním zkreslením.</p>
      <p>💡 Kognitivní zkreslení je zkratka v myšlení, která nám pomáhá rychle se rozhodovat, ale nemusí vždy vést k nejlepšímu výsledku.</p>
      <p><strong>Příklad:</strong> Vidíš dva stánky s jídlem. U jednoho stojí dlouhá fronta, u druhého jen pár lidí. „Jasně, v prvním bude lepší jídlo, jdu tam,“ říkáš si. Přitom je dost možný, že je obsluha jenom pomalá. Takhle funguje <strong>Social Proof</strong> zkreslení.</p>
    `
  },
  panelTwo: {
    html: `
      <p><strong>Rozdíl mezi manipulativním a persvazivním přístupem je ve způsobu a úmyslu.</strong></p>
      <div class=\"reveal__compare\">
        <div>
          <h3>Manipulace</h3>
          <ul>
            <li>Snaží se ovlivnit rozhodnutí skrytým nebo nečestným způsobem.</li>
            <li>Využívá strach, tlak a klamavé taktiky.</li>
            <li>Nutí čtenáře reagovat impulzivně nebo bez hlubší úvahy.</li>
            <li>Využívá zkreslené informace a emoce – bez jasných hranic.</li>
          </ul>
        </div>
        <div>
          <h3>Persvaze (přesvědčování)</h3>
          <ul>
            <li>Respektuje svobodu volby čtenáře.</li>
            <li>Používá logiku, důkazy a transparentní argumentaci.</li>
            <li>Dává čtenáři možnost informovaného rozhodnutí.</li>
            <li>Působí na racionalitu i emoce v etickém rámci.</li>
          </ul>
        </div>
      </div>
      <p><strong>Příklad:</strong> „Nechcete ušetřit na palivu? Jen blázen by dál platil víc!“</p>
      <p class=\"reveal__example\"><strong>Příklad:</strong> „Náš filtr snižuje spotřebu paliva o 10 % a nezávislý test XY to potvrzuje.“</p>
      <p>✅ Persvaze je zpravidla férovým přesvědčováním a může být součástí etického marketingu, pokud nevyužívá nátlak nebo klamavé techniky.</p>
      <p>⚠️ Mezi férovou persvazí a lehkou manipulací může být tenká hranice. Zejména pak při využívání kognitivních zkreslení.</p>
    `
  }
})

main.appendChild(section12)

const section13 = document.createElement('section')
section13.className = 'section section--tips'
section13.id = 'section-QATBjIMeyx'
section13.innerHTML = `
  <div class="tips">
    <h2>Jak bojovat s Manipuláky?</h2>
    <ul class="tips__list tips__list--ok">
      <li><span class="tips__icon tips__icon--ok">✅</span>Rozvíjej kritické myšlení</li>
      <li><span class="tips__icon tips__icon--ok">✅</span>Ověřuj fakta, nespoléhej se na jediný zdroj</li>
      <li><span class="tips__icon tips__icon--ok">✅</span>Zkus potlačit vliv emocí – dej si čas na rozmyšlenou</li>
      <li><span class="tips__icon tips__icon--ok">✅</span>Představ si opačnou argumentaci</li>
      <li><span class="tips__icon tips__icon--ok">✅</span>Uč se, jak tvůj mozek funguje</li>
    </ul>

    <div class="tips__spacer"></div>
    <h2 class="tips__title">Proti Manipulákům bojuje<br>i legislativa:</h2>
    <ul class="tips__list tips__list--warn">
      <li><span class="tips__icon tips__icon--warn">❌</span><strong>Nekalé obchodní praktiky (manipulace, klamání)</strong> – zakazuje Zákon o regulaci reklamy a ochraně spotřebitele i Občanský zákoník</li>
      <li><span class="tips__icon tips__icon--warn">❌</span><strong>Nedobrovolné/nevědomé souhlasy se zpracováním dat</strong> – zakazuje GDPR</li>
      <li><span class="tips__icon tips__icon--warn">❌</span><strong>Dark patterns</strong> – zakazuje Zákon o digitálních službách (DSA)</li>
    </ul>
  </div>
`

main.appendChild(section13)

const section14 = document.createElement('section')
section14.className = 'section section--resources'
section14.id = 'section-MmggBaqpgF'
section14.innerHTML = `
  <div class="resources">
    <div class="resources__text">
      <h2><strong>Nechej se přesvědčit,</strong><br><strong>ne zmanipulovat</strong></h2>
      <p class="resources__lead"><strong>Mrkni na další užitečné zdroje:</strong></p>
      <ul class="resources__list">
        <li>– <a href="https://www.lenkastawarczyk.com/" target="_blank" rel="noreferrer">Lenka Stawarczyk</a> – článek <a href="https://www.lenkastawarczyk.com/blog/temne-vzory-v-marketingu-stoji-nam-to-za-to" target="_blank" rel="noreferrer">Temné vzory v marketingu. Stojí nám to za to?</a></li>
        <li>– <a href="https://www.ilincev.com/" target="_blank" rel="noreferrer">Ondřej Ilinčev</a> – článek <a href="https://www.ilincev.com/dark-patterns" target="_blank" rel="noreferrer">UX sviňárny na webu (neboli dark patterns)</a></li>
        <li>– <a href="http://www.deceptive.design/" target="_blank" rel="noreferrer">Deceptive.design</a> – databáze a definice temných vzorů</li>
        <li>– <a href="https://www.petradolejsova.cz/blog" target="_blank" rel="noreferrer">Blog Petry Dolejšové</a> – expertka na právo v marketingu a e‑commerce; píše srozumitelně o <a href="https://www.petradolejsova.cz/blog/nova-pravni-regulace-slev" target="_blank" rel="noreferrer">slevách</a>, <a href="https://www.petradolejsova.cz/blog/prace-s-osobnimi-udaji-v-marketingu" target="_blank" rel="noreferrer">GDPR</a>, <a href="https://www.petradolejsova.cz/blog/cookies-saga-pokracuje-vitej-2024" target="_blank" rel="noreferrer">cookies</a> i <a href="https://www.petradolejsova.cz/blog/dsa-a-e-shopy" target="_blank" rel="noreferrer">DSA</a></li>
      </ul>
    </div>
    <div class="resources__media">
      <video autoplay loop muted playsinline>
        <source src="/cdn/texty-ktere-manipuluji/assets/dIreRubVKo/manipul-end-na-720x720.webm" type="video/webm">
        <source src="/cdn/texty-ktere-manipuluji/assets/dIreRubVKo/manipul-end-na-720x720.mp4" type="video/mp4">
      </video>
    </div>
  </div>
`

main.appendChild(section14)

const section15 = document.createElement('section')
section15.className = 'section section--credits'
section15.id = 'section-CAPQzPfiQd'
section15.innerHTML = `
  <div class="credits">
    <div class="credits__text">
      <h2>Vytvořil Radek Brázdil</h2>
      <p class="credits__role">Copywriter a tvůrce obsahu</p>
      <p><a href="https://www.linkedin.com/in/radekbrazdil" target="_blank" rel="noreferrer">www.linkedin.com/in/radekbrazdil</a></p>

      <p class="credits__note"><em>Projekt Manipuláci využívá techniku scrollytellingu. Vznikl s pomocí AI nástrojů (Midjourney, ChatGPT, Canva, Minimax).</em></p>
      <p class="credits__note"><em>Promyšleným spojením textu s grafickými prvky dokážu odvyprávět i příběh tvé značky nebo produktu. Pokud chceš vědět víc, <a href="https://navolnenoze.cz/prezentace/radek-brazdil/" target="_blank" rel="noreferrer">kontaktuj mě</a>.</em></p>
    </div>
    <div class="credits__media">
      <img src="/cdn/texty-ktere-manipuluji/assets/YthhG4OH0q/wantedd1-750x915.jpg" alt="Wanted">
      <div class="credits__thanks">
        <strong>Poděkování betačtenářům:</strong>
        <div class="credits__links">
          <a href="https://www.linkedin.com/in/kate%C5%99ina-tomanov%C3%A1-br%C3%A1zdilov%C3%A1/" target="_blank" rel="noreferrer">Kateřině Brázdilové</a>,
          <a href="https://zivainteligence.cz/" target="_blank" rel="noreferrer">Terce Kubíčkové</a>,
          <a href="https://www.lenkastawarczyk.com/" target="_blank" rel="noreferrer">Lence Stawarczyk</a>,
          <a href="https://www.petradolejsova.cz/" target="_blank" rel="noreferrer">Petře Dolejšové</a>,
          <a href="https://www.kocopywriter.cz/" target="_blank" rel="noreferrer">Vojtovi Hulinskému</a>,
          <a href="https://www.ilincev.com/" target="_blank" rel="noreferrer">Ondřeji Ilinčevovi</a>
        </div>
      </div>
    </div>
  </div>
`

main.appendChild(section15)

// Remaining sections are intentionally omitted (final content ends here)

app.appendChild(main)

bindIntroScrollEffect(introSection)
bindRevealSection(section04)
bindScrollpointsSection(section05, {
  image: '/cdn/texty-ktere-manipuluji/assets/aRguPfGB83/0000-1.jpg',
  title: 'KDO JE V NAŠEM KLUBU:',
  points: scrollPoints
})
bindRevealWipeSection(section08)
bindRevealTripleSection(section10)
bindScrollpointsSectionRight(section11, {
  image: '/cdn/texty-ktere-manipuluji/assets/mEJc9CPbuw/na-vrh-bez-na-zvu-2.jpg',
  title: scrollSectionTwo?.title ?? 'Co ještě umíme?',
  points: scrollPointsTwo,
  showDots: false
})
bindRevealQuadSection(section12)
