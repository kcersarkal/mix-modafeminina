import {
  fetchProdutos,
  fetchProdutoById,
  fetchCategorias,
  fetchProdutosSpotlight,
  fetchPedidos,
  inserirPedido
} from './supabase.js'

const MAX_HOURS_STALE = 12
const USE_SUPABASE = true

const $ = (sel, ctx = document) => ctx.querySelector(sel)
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)]

const DOM = {
  app: $('#app'),
  homeGrid: $('#home-product-grid'),
  spotlightSlot: $('#spotlight-slot'),
  produtoContent: $('#produto-content'),
  crumbName: $('#crumb-name'),
  filterBar: $('#filter-bar'),
  sortBar: $('#sort-bar'),
  priceRangeWrap: $('#price-range-wrap'),
  heroCarouselTrack: $('#hero-carousel-track'),
  heroDots: $('#hero-dots'),
  searchInput: $('#search-input'),
  productCount: $('#product-count'),
  emptyState: $('#empty-state'),
  mobileMenu: $('#mobile-menu'),
  mobileToggle: $('.nav-toggle'),
  mobileClose: $('.mobile-close'),
  navLinks: $$('nav ul a[data-link]'),
  pedidosGrid: $('#pedidos-grid'),
  pedidosCount: $('#pedidos-count'),
  pedidosEmpty: $('#pedidos-empty'),
  pedidoContainer: $('#pedido-container'),
  lastUpdate: $('#last-update'),
}

const state = {
  allProducts: [],
  carouselProducts: [],
  carouselIndex: 0,
  carouselTimer: null,
  heroCarouselIndex: 0,
  heroCarouselTimer: null,
  activeCategory: 'Todas',
  searchQuery: '',
  sortBy: 'relevancia',
  priceRange: 'todas',
  currentView: 'home',
  previousView: 'home',
  useSupabase: USE_SUPABASE,
}

const HOME_ANCHORS = ['categorias', 'destaques', 'sobre']

function priceNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const normalized = value.trim().replace(/R\$\s*/gi, '').replace(/\./g, '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function fmtPrice(value) {
  const price = priceNumber(value)
  return price === null ? 'Indisponível' : price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function discountPercent(p) {
  const t = p.tag || ''
  const cleaned = t.replace(/^🌎 /, '')
  if (cleaned.startsWith('-')) {
    const m = cleaned.match(/-?(\d+)/)
    return m ? parseInt(m[1], 10) : null
  }
  return null
}

function isInternational(p) {
  return (p.tag || '').includes('🌎')
}

function hoursSince(iso) {
  return (Date.now() - new Date(iso).getTime()) / 36e5
}

function sortProducts(products, sortBy) {
  const sorted = [...products]
  switch (sortBy) {
    case 'menor_preco':
      sorted.sort((a, b) => (a.price_current || Infinity) - (b.price_current || Infinity))
      break
    case 'maior_desconto':
      sorted.sort((a, b) => {
        const da = discountPercent(a) || 0
        const db = discountPercent(b) || 0
        return db - da
      })
      break
    case 'melhor_avaliacao':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    default:
      break
  }
  return sorted
}

function starRow(r) {
  const f = Math.round(r)
  return '★'.repeat(f) + '★'.repeat(5 - f)
}

function starFillWidth(r) {
  return (r / 5 * 100) + '%'
}

function getActiveProducts() {
  return state.allProducts.filter(p => hoursSince(p.last_checked_at) <= MAX_HOURS_STALE)
}

function discountBadge(pct, size) {
  if (pct > 60) return ''
  return `<div class="discount-badge ${size || ''}"><span class="pct">-${pct}%</span><span class="off">OFF</span></div>`
}

function productId(p) {
  return p.external_id || p.id
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function couponMarkup(code) {
  if (!code) return ''
  return `<button class="coupon-pill" onclick="copyCoupon(event,'${code}')">${code}</button>`
}

async function loadData() {
  if (state.useSupabase) {
    const [produtos, pedidos, categorias] = await Promise.all([
      fetchProdutos({ onlyFresh: false }),
      fetchPedidos(),
      fetchCategorias(),
    ])
    if (produtos) state.allProducts = produtos
    window.PEDIDOS = pedidos || []
    state.categorias = ['Todas', ...(categorias || [])]
  } else {
    const shopee = window.SHOPEE_PRODUCTS || []
    const ml = window.MERCADOLIVRE_PRODUCTS || []
    state.allProducts = [...shopee, ...ml]
    window.PEDIDOS = []
    state.categorias = ['Todas', ...new Set([...shopee, ...ml].map(p => p.category).filter(Boolean))]
  }
}

function detectProductType(title) {
  const t = title.toLowerCase()
  if (t.includes('vestido') || t.includes('midi')) return 'vestido'
  if (t.includes('sandália') || t.includes('salto') || t.includes('sapatilha')) return 'calcados'
  if (t.includes('bolsa') || t.includes('transversal') || t.includes('tiracolo')) return 'bolsas'
  if (t.includes('blazer') || t.includes('alfaiataria')) return 'roupas'
  if (t.includes('conjunto') || t.includes('cropped') || t.includes('tricot')) return 'conjuntos'
  if (t.includes('jeans') || t.includes('calça') || t.includes('legging')) return 'calcados'
  if (t.includes('fitness') || t.includes('top') || t.includes('bojo')) return 'fitness'
  return 'generico'
}

function analysisForType(type, p, desconto, nota, reviews) {
  const analyses = {
    vestido: [
      'Perfeito para quem busca um vestido versátil, que funciona tanto no trabalho quanto em eventos. O caimento é lisonjeiro e o tecido tem boa qualidade',
      'Ideal para montar looks elegantes sem esforço. A estampa e o corte valorizam a silhueta, e a peça é confortável para usar o dia inteiro'
    ],
    calcados: [
      'O modelo ideal para quem valoriza conforto sem abrir mão do estilo. O design é moderno e a palmilha garante bem-estar mesmo após horas de uso',
      'Um calçado que une elegância e praticidade. Combina com produções casuais e sofisticadas, sendo um curinga no guarda-roupa'
    ],
    bolsas: [
      'Prática e estilosa, essa bolsa tem o tamanho ideal para o dia a dia. Os compartimentos internos ajudam a organizar tudo sem perder a elegância',
      'O acessório que faltava para completar seus looks. Leve, funcional e com um design que chama atenção'
    ],
    roupas: [
      'Uma peça que eleva qualquer produção. O corte alfaiatado entrega um visual sofisticado, perfeito para quem precisa de estilo no dia a dia',
      'Versátil e atemporal, essa peça é daquelas que não pode faltar no guarda-roupa. Veste bem e valoriza a silhueta'
    ],
    conjuntos: [
      'A praticidade de um look pronto com a elegância de peças coordenadas. Ideal para quem quer estar bem vestida sem perder tempo montando produções',
      'Conforto e estilo andam juntos nesse conjunto. O tricot é macio e a modelagem é moderna sem ser exagerada'
    ],
    fitness: [
      'Perfeito para acompanhar seus treinos com conforto e estilo. O tecido respirável e a modelagem anatômica garantem liberdade de movimento',
      'Ideal para quem leva o treino a sério mas não abre mão do visual. A compressão suave ajuda na performance e na recuperação muscular'
    ],
    generico: [
      'Produto versátil que atende bem o que se propõe. Boa avaliação dos compradores mostra que entrega o que promete',
      'Uma escolha acertada para quem busca o melhor custo-benefício. Avaliado positivamente por quem já comprou'
    ]
  }
  const typeAnalyses = analyses[type] || analyses.generico
  return pick(typeAnalyses)
}

function generateSummary(p) {
  const desconto = discountPercent(p)
  const nota = p.rating || 0
  const reviews = p.reviews_count || 0
  const type = detectProductType(p.name)

  let txt = analysisForType(type, p, desconto, nota, reviews)

  if (desconto && desconto >= 20) {
    txt += ` com ${desconto}% de desconto —`
  } else if (desconto) {
    txt += ` com preço especial —`
  } else {
    txt += ` —`
  }

  if (nota >= 4.5 && reviews >= 500) {
    txt += ` e olha que não sou só eu que penso assim: ${nota}/5 de mais de ${(reviews / 1000).toFixed(reviews >= 1000 ? 0 : 1)} mil compradoras.`
  } else if (nota >= 4.0 && reviews >= 100) {
    txt += ` e a reputação confirma: ${nota}/5 em ${reviews} avaliações.`
  } else if (nota >= 4.5) {
    txt += ` com nota ${nota}/5 de quem já comprou.`
  } else if (reviews >= 500) {
    txt += ` já são mais de ${(reviews / 1000).toFixed(0)} mil avaliações.`
  } else {
    txt += ` vale a pena conferir.`
  }

  return txt
}



function productCard(p) {
  return `
    <article class="card" onclick="navigate('produto','${productId(p)}')" role="link" tabindex="0" aria-label="Ver oferta: ${p.name}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('produto','${productId(p)}');}">
      <div class="card-link">
        <div class="card-img">
          ${p.tag && (!discountPercent(p) || discountPercent(p) <= 60) ? `<span class="product-tag">${p.tag}</span>` : ''}
          ${isInternational(p) ? '<span class="int-badge">🌎 Internacional</span>' : ''}
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.alt='Imagem indisponível';this.style.display='none'">
        </div>
        <div class="card-body">
          <span class="card-category">${p.category}</span>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-rating">
            <span class="stars-wrap">★★★★★<span class="stars-fill" style="width:${starFillWidth(p.rating || 4.5)}">★★★★★</span></span>
            <span class="rating-num">${(p.rating || 0).toFixed(1)}</span>
            <span class="reviews-count">(${p.reviews_count || 0})</span>
          </div>
          <div class="price-row" style="flex-direction:column; align-items:flex-start; gap:2px;">
            <span class="price-current">R$ ${fmtPrice(p.price_current)}</span>
          </div>
          <div class="card-footer">
            <div class="card-cta">Ver produto
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </article>`
}

function spotlightMarkup(p) {
  return `
    <div class="spotlight-card" onclick="navigate('produto','${productId(p)}')" style="cursor:pointer;">
      <div class="spotlight-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\'padding:40px;text-align:center;color:var(--ink-muted)\'>Imagem indisponível</div>'"></div>
      <div class="spotlight-body">
        <h2 class="spotlight-title">${p.name}</h2>
        <div class="spotlight-desc">${generateSummary(p)}</div>
        <div class="price-row" style="margin-bottom:6px;gap:6px;">
          ${discountPercent(p) ? discountBadge(discountPercent(p), 'lg') : ''}
          ${isInternational(p) ? '<span class="int-badge" style="position:static;display:inline-block;margin-top:4px;">🌎 Internacional</span>' : ''}
          <div>
            <div class="price-row" style="margin-bottom:0;gap:4px;"><span class="price-current" style="font-size:24px;color:var(--rose-deep);">R$ ${fmtPrice(p.price_current)}</span></div>
          </div>
        </div>
        <span class="btn-primary" style="display:inline-block;padding:8px 18px;font-size:13px;">Ver oferta</span>
      </div>
    </div>`
}

function renderCarousel() {
  const slot = DOM.spotlightSlot
  if (!slot) return
  const products = getActiveProducts()
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
  state.carouselProducts = cats.map(cat => {
    const daCategoria = products.filter(p => p.category === cat && p.price_current != null)
    if (!daCategoria.length) return null
    return daCategoria.reduce((a, b) => (a.price_current || Infinity) < (b.price_current || Infinity) ? a : b)
  }).filter(Boolean)

  if (!state.carouselProducts.length) { slot.innerHTML = ''; return }

  const existingCard = slot.querySelector('.spotlight-card')
  if (existingCard) {
    existingCard.classList.add('slide-out-left')
    setTimeout(drawCarousel, 400)
  } else {
    drawCarousel()
  }
}

function drawCarousel() {
  const slot = DOM.spotlightSlot
  if (!slot || !state.carouselProducts.length) return
  const p = state.carouselProducts[state.carouselIndex]
  slot.innerHTML = `
    <div class="spotlight-label">Destaques da semana</div>
    ${spotlightMarkup(p)}
    ${state.carouselProducts.length > 1 ? `
    <div class="carousel-arrow prev" onclick="prevSlide()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg></div>
    <div class="carousel-arrow next" onclick="nextSlide()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></div>
    <div class="dots">${state.carouselProducts.map((_, i) => `<button class="dot-indicator ${i === state.carouselIndex ? 'active' : ''}" onclick="goToSlide(${i})"></button>`).join('')}</div>` : ''}`
  const newCard = slot.querySelector('.spotlight-card')
  if (newCard) {
    newCard.classList.add('slide-in-right')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { newCard.classList.remove('slide-in-right') })
    })
  }
  clearInterval(state.carouselTimer)
  state.carouselTimer = setInterval(nextSlide, 5000)
}

window.nextSlide = function () {
  state.carouselIndex = (state.carouselIndex + 1) % state.carouselProducts.length
  renderCarousel()
}
window.prevSlide = function () {
  state.carouselIndex = (state.carouselIndex - 1 + state.carouselProducts.length) % state.carouselProducts.length
  renderCarousel()
}
window.goToSlide = function (i) {
  state.carouselIndex = i
  renderCarousel()
}

function stopCarousel() {
  if (state.carouselTimer) {
    clearInterval(state.carouselTimer)
    state.carouselTimer = null
  }
}

function startHeroTimer() {
  clearInterval(state.heroCarouselTimer)
  state.heroCarouselTimer = setInterval(heroNext, 4500)
}

function stopHeroTimer() {
  if (state.heroCarouselTimer) {
    clearInterval(state.heroCarouselTimer)
    state.heroCarouselTimer = null
  }
}

function initHeroCarousel() {
  const products = getActiveProducts()
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
  const slides = cats.map(cat => {
    const daCategoria = products.filter(p => p.category === cat && p.price_current != null && p.image)
    if (!daCategoria.length) return null
    const best = daCategoria.reduce((a, b) => Math.max(discountPercent(a) || 0, 0) >= Math.max(discountPercent(b) || 0, 0) ? a : b)
    return best
  }).filter(Boolean)

  if (!slides.length) return

  state.heroCarouselIndex = 0
  const track = DOM.heroCarouselTrack
  if (!track) return
  track.innerHTML = slides.map(p => `
    <div class="hero-carousel-slide">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--cream);color:var(--ink-muted);font-size:12px\'>Sem imagem</div>'">
      <div class="slide-label">${p.category} • R$ ${fmtPrice(p.price_current)}</div>
    </div>
  `).join('')
  track.style.transform = 'translateX(0)'

  const dots = DOM.heroDots
  if (dots) {
    dots.innerHTML = slides.map((_, i) =>
      `<span class="${i === 0 ? 'is-active' : ''}" onclick="heroGoTo(${i})"></span>`
    ).join('')
  }

  startHeroTimer()
}

function heroNext() {
  const slides = DOM.heroCarouselTrack?.children.length || 0
  if (slides < 2) return
  const next = (state.heroCarouselIndex + 1) % slides
  heroGoTo(next)
}

window.heroGoTo = function (i) {
  const track = DOM.heroCarouselTrack
  if (!track || !track.children.length) return
  state.heroCarouselIndex = i
  track.style.transform = `translateX(-${i * 100}%)`

  const dots = DOM.heroDots
  if (dots) {
    Array.from(dots.children).forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === i)
    })
  }
}

function renderHome() {
  const grid = DOM.homeGrid
  const countEl = DOM.productCount
  const filterBar = DOM.filterBar
  const sortBar = DOM.sortBar
  const emptyState = DOM.emptyState
  const products = getActiveProducts()

  if (!products.length) {
    grid.innerHTML = ''
    filterBar.innerHTML = ''
    sortBar.innerHTML = ''
    DOM.priceRangeWrap.innerHTML = ''
    if (emptyState) emptyState.style.display = 'block'
    if (countEl) countEl.textContent = '0 ofertas'
    return
  }
  if (emptyState) emptyState.style.display = 'none'

  filterBar.innerHTML = state.categorias.map(cat =>
    `<button class="filter-chip ${cat === state.activeCategory ? 'active' : ''}" onclick="setCategory('${cat}')">${cat}</button>`
  ).join('')

  const PRICE_RANGES = [
    { value: 'todas', label: 'Todos os Preços' },
    { value: 'ate_50', label: 'Até R$50' },
    { value: '50_100', label: 'R$50 a R$100' },
    { value: '100_200', label: 'R$100 a R$200' },
    { value: '200_mais', label: 'Acima de R$200' },
  ]
  DOM.priceRangeWrap.innerHTML = PRICE_RANGES.map(r =>
    `<button class="price-range-chip ${r.value === state.priceRange ? 'active' : ''}" onclick="setPriceRange('${r.value}')">${r.label}</button>`
  ).join('')

  const SORT_OPTIONS = [
    { value: 'relevancia', label: 'Relevância' },
    { value: 'menor_preco', label: 'Menor Preço' },
    { value: 'maior_desconto', label: 'Maior Desconto' },
    { value: 'melhor_avaliacao', label: 'Melhor Avaliação' },
  ]
  sortBar.innerHTML = SORT_OPTIONS.map(opt =>
    `<button class="sort-chip ${opt.value === state.sortBy ? 'active' : ''}" onclick="setSort('${opt.value}')">${opt.label}</button>`
  ).join('')

  renderCarousel()

  let searched = state.searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
    : products
  let filtered = state.activeCategory === 'Todas' ? searched : searched.filter(p => p.category === state.activeCategory)

  if (state.priceRange === 'ate_50')
    filtered = filtered.filter(p => (p.price_current || 0) <= 50)
  else if (state.priceRange === '50_100')
    filtered = filtered.filter(p => (p.price_current || 0) > 50 && (p.price_current || 0) <= 100)
  else if (state.priceRange === '100_200')
    filtered = filtered.filter(p => (p.price_current || 0) > 100 && (p.price_current || 0) <= 200)
  else if (state.priceRange === '200_mais')
    filtered = filtered.filter(p => (p.price_current || 0) > 200)

  filtered = sortProducts(filtered, state.sortBy)

  const lastUpdate = products.reduce((latest, p) =>
    new Date(p.last_checked_at) > new Date(latest) ? p.last_checked_at : latest, products[0].last_checked_at
  )
  if (DOM.lastUpdate) DOM.lastUpdate.textContent = new Date(lastUpdate).toLocaleString('pt-BR')

  countEl.textContent = state.searchQuery
    ? `${filtered.length} de ${products.length} ofertas`
    : `${products.length} ofertas ativas`

  grid.innerHTML = filtered.length
    ? filtered.map(productCard).join('')
    : '<p style="color:var(--ink-muted); grid-column:1/-1; text-align:center; padding:40px 0;">Nenhuma oferta nesse filtro no momento.</p>'
}

window.setCategory = function (cat) {
  state.activeCategory = cat
  renderHome()
  setTimeout(() => {
    const grid = DOM.homeGrid
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

window.setSort = function (sortBy) {
  state.sortBy = sortBy
  renderHome()
}

window.setPriceRange = function (range) {
  state.priceRange = range
  renderHome()
}

window.onSearchInput = function (value) {
  state.searchQuery = value
  if (document.querySelector('[data-view="home"].active')) {
    renderHome()
  }
}

function renderProduto(id) {
  const container = DOM.produtoContent
  const crumb = DOM.crumbName
  const products = getActiveProducts()
  const p = products.find(item => item.external_id === id || String(item.id) === id || item.id === parseInt(id))

  if (!p) {
    document.title = 'Oferta não encontrada — MIXDM Moda Feminina'
    if (crumb) crumb.textContent = 'Produto não encontrado'
    container.innerHTML = `
      <div class="not-found">
        <h1>Essa oferta não está mais disponível</h1>
        <p>Ela pode ter expirado ou o estoque acabou. Volte para a home e confira outras ofertas ativas.</p>
        <a data-link="#/destaques" class="btn-primary" style="margin-top:16px;display:inline-block;">Ver todas as ofertas</a>
      </div>`
    bindLinks()
    return
  }

  const safeUrl = p.affiliate_url || '#'

  document.title = `${p.name} — MIXDM Moda Feminina`
  if (crumb) crumb.textContent = p.name

  container.innerHTML = `
    <div class="product-detail-page">
      <button class="back-button" onclick="goBack()" aria-label="Voltar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
        Voltar
      </button>
      <div class="breadcrumb"><span class="link" role="link" tabindex="0" onclick="navigate('home')" onkeydown="if(event.key==='Enter'){navigate('home')}">Início</span> / ${p.category} / ${p.name}</div>
      <div class="detail-card">
        <div class="detail-media">
          ${p.tag && (!discountPercent(p) || discountPercent(p) <= 60) ? `<span class="detail-tag">${p.tag}</span>` : ''}
          ${isInternational(p) ? '<span class="int-badge" style="position:absolute;top:50px;left:10px;">🌎 Internacional</span>' : ''}
          <img src="${p.image}" alt="${p.name}" onerror="this.alt='${p.name} — imagem indisponível'; this.style.background='var(--blush-deep)'">
        </div>
        <div class="detail-info">
          <span class="eyebrow">${p.category}</span>
          <h1 class="detail-title">${p.name}</h1>
          <div class="detail-rating">
            <span class="stars-wrap" style="font-size:16px;">★★★★★<span class="stars-fill" style="width:${starFillWidth(p.rating || 4.5)};font-size:16px;">★★★★★</span></span>
            <span style="font-weight:600;font-size:15px;color:var(--ink);">${(p.rating || 0).toFixed(1)}</span>
            <span style="color:var(--ink-muted);font-size:13px;">(${p.reviews_count || 0} avaliações)</span>
          </div>
          <div class="detail-price-block">
            <div class="price-row" style="gap:14px;">
              <span class="detail-price-now">R$ ${fmtPrice(p.price_current)}</span>
            </div>
          </div>
          <div class="detail-summary">${generateSummary(p)}</div>
          <div class="detail-actions">
            <a class="btn-primary btn-block" href="${safeUrl}" target="_blank" rel="nofollow sponsored noopener">Comprar agora</a>
            <div class="detail-actions-row">
              <button class="btn-share" onclick="shareWhatsApp(${p.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.44 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </button>
              <button class="btn-copy" onclick="copyProductLink(${p.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Copiar link
              </button>
              <button class="btn-telegram" onclick="window.open('https://t.me/MixModaFeminina', '_blank')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.127.087.669.087.669s.272 2.82.42 4.34c.054.57-.14.79-.36.833-.28.053-.544.13-.836.21-.672.18-1.575.42-2.34.147-.44-.168-.776-.5-1.11-.834l-1.012-1.02c-.264-.21-.192-.332-.045-.53l.04-.04c.272-.32 1.08-1.177 1.748-1.84.16-.17.36-.54-.06-.84-.28-.24-1.12-.72-1.66-1.08-.28-.18-.52-.36-.56-.6-.04-.24.16-.48.44-.56.32-.08 2.06-.8 2.86-1.08.28-.1.56-.16.8-.12.16.04.28.12.32.28.04.16.08.72.08.72s.04.44.08.64c.04.2.12.36.24.44.12.08.28.08.48.04.28-.04 1.68-.68 1.92-.84.14-.08.28-.12.4-.08z"/></svg>
                Telegram
              </button>
            </div>
          </div>
          <p class="detail-note">Preço e disponibilidade sujeitos a alteração pela loja parceira.</p>
          <div class="detail-disclosure">Links de afiliado Shopee — comissão sem alteração no preço.</div>
        </div>
      </div>
    </div>`

  injectProductJSONLD(p)
  bindLinks()
}

function shareWhatsApp(id) {
  const products = getActiveProducts()
  const p = products.find(item => item.id === id || item.id === parseInt(id))
  if (!p) return
  const productUrl = `${window.location.origin}${window.location.pathname}?produto=${productId(p)}`
  const pct = discountPercent(p)
  const discountTxt = pct && pct <= 60 ? ` (-${pct}%)` : ''
  const text = `*${p.name}*\n\n*R$ ${fmtPrice(p.price_current)}*${discountTxt}\n\n${productUrl}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

window.shareWhatsApp = shareWhatsApp

function copyProductLink(id) {
  const products = getActiveProducts()
  const p = products.find(item => item.id === id || item.id === parseInt(id))
  if (!p) return
  const productUrl = `${window.location.origin}${window.location.pathname}?produto=${productId(p)}`
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(productUrl).then(() => {
      const btn = event.currentTarget
      const original = btn.innerHTML
      btn.innerHTML = 'Link copiado!'
      setTimeout(() => { btn.innerHTML = original }, 1800)
    }).catch(() => {
      window.prompt('Copie o link:', productUrl)
    })
  } else {
    window.prompt('Copie o link:', productUrl)
  }
}

window.copyProductLink = copyProductLink

function injectProductJSONLD(product) {
  removeProductJSONLD()
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'product-jsonld'
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: typeof product.price_current === 'number' ? product.price_current : parseFloat(product.price_current),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: product.affiliate_url || window.location.href,
    },
  })
  document.head.appendChild(script)
}

function removeProductJSONLD() {
  const existing = document.getElementById('product-jsonld')
  if (existing) existing.remove()
}

function renderPedidos() {
  const grid = DOM.pedidosGrid
  const empty = DOM.pedidosEmpty
  const countEl = DOM.pedidosCount
  const pedidos = window.PEDIDOS || []
  if (!pedidos.length) {
    grid.innerHTML = ''
    if (empty) empty.style.display = 'block'
    if (countEl) countEl.textContent = '0 pedidos'
    return
  }
  if (empty) empty.style.display = 'none'
  if (countEl) countEl.textContent = `${pedidos.length} pedido${pedidos.length > 1 ? 's' : ''}`
  grid.innerHTML = pedidos.map(p => pedidoCard(p)).join('')
}

function pedidoCard(p) {
  return `<article class="card" onclick="navigate('pedido','${p.id}')" role="link" tabindex="0" aria-label="${p.titulo}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('pedido','${p.id}');}">
    <div class="card-link">
      <div class="card-img">
        <img src="${p.imagem || 'https://via.placeholder.com/200'}" alt="${p.titulo}" loading="lazy" onerror="this.src='https://via.placeholder.com/200'">
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.titulo}</h3>
        <div class="card-footer">
          ${p.preco ? `<div class="price-row"><span class="price-current">R$ ${fmtPrice(p.preco)}</span></div>` : ''}
          <div class="card-cta">Ver pedido <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
        </div>
      </div>
    </div>
  </article>`
}

function renderPedido(id) {
  const container = DOM.pedidoContainer
  const pedidos = window.PEDIDOS || []
  const p = pedidos.find(item => item.id === id || item.id === parseInt(id))
  if (!p) {
    container.innerHTML = `<div class="empty-state" style="margin-top:40px;"><h2>Pedido não encontrado</h2><button class="btn-primary" onclick="navigate('pedidos')" style="margin-top:16px;">Voltar</button></div>`
    return
  }
  container.innerHTML = `
    <div style="padding-top:24px;padding-bottom:60px;">
      <button class="back-button" onclick="navigate('pedidos')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Voltar
      </button>
      <div class="detail-card" style="margin-top:20px;">
        <div class="detail-media">
          <img src="${p.imagem || 'https://via.placeholder.com/400'}" alt="${p.titulo}" onerror="this.src='https://via.placeholder.com/400'">
        </div>
        <div class="detail-info">
          <h1 class="detail-title">${p.titulo}</h1>
          ${p.preco ? `<div class="detail-price-block"><div class="price-row"><span class="detail-price-now">R$ ${fmtPrice(p.preco)}</span></div></div>` : ''}
          ${p.descricao ? `<p class="detail-desc">${p.descricao}</p>` : ''}
          <div class="detail-actions">
            <a class="btn-primary btn-block" href="${p.link || '#'}" target="_blank" rel="nofollow sponsored noopener">Ver na loja</a>
            <div class="detail-actions-row">
              <button class="btn-share" onclick="sharePedidoWhatsApp('${p.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.44 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </button>
              <button class="btn-copy" onclick="copyPedidoLink('${p.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Copiar link
              </button>
            </div>
          </div>
          <p class="detail-note">Pedido personalizado - preço sujeito a alteração</p>
        </div>
      </div>
    </div>`
  bindLinks()
}

function sharePedidoWhatsApp(id) {
  const pedidos = window.PEDIDOS || []
  const p = pedidos.find(item => item.id === id || item.id === parseInt(id))
  if (!p) return
  const productUrl = p.link || `${window.location.origin}${window.location.pathname}?pedido=${p.id}`
  const text = `*${p.titulo}*${p.preco ? `\n\n*R$ ${fmtPrice(p.preco)}*` : ''}\n\n${productUrl}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

window.sharePedidoWhatsApp = sharePedidoWhatsApp

function copyPedidoLink(id) {
  const pedidos = window.PEDIDOS || []
  const p = pedidos.find(item => item.id === id || item.id === parseInt(id))
  if (!p) return
  const productUrl = p.link || `${window.location.origin}${window.location.pathname}?pedido=${p.id}`
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(productUrl).then(() => {
      const btn = event.currentTarget
      const original = btn.innerHTML
      btn.innerHTML = 'Link copiado!'
      setTimeout(() => { btn.innerHTML = original }, 1800)
    }).catch(() => {
      window.prompt('Copie o link:', productUrl)
    })
  } else {
    window.prompt('Copie o link:', productUrl)
  }
}

window.copyPedidoLink = copyPedidoLink

function router() {
  const params = new URLSearchParams(window.location.search)
  const produtoId = params.get('produto')
  const pedidoId = params.get('pedido')

  let view = 'home', route = '', parts = []

  const hash = window.location.hash || '#/'

  if (produtoId) {
    view = 'produto'
  } else if (pedidoId) {
    view = 'pedido'
  } else {
    parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
    route = parts[0] || ''

    if (route === 'privacidade') view = 'privacidade'
    else if (route === 'termos') view = 'termos'
    else if (route === 'produto') view = 'produto'
    else if (route === 'pedidos') view = 'pedidos'
    else if (route === 'pedido') view = 'pedido'
    else if (route === 'sobre') view = 'sobre'
    else if (route === 'contato') view = 'contato'
  }

  if (state.currentView === 'home' && view !== 'home') {
    stopCarousel()
    stopHeroTimer()
  }
  state.currentView = view

  $$('[data-view]').forEach(el => {
    el.classList.toggle('is-active', el.dataset.view === view)
  })

  DOM.navLinks.forEach(a => {
    const target = a.dataset.link.replace(/^#\/?/, '').split('/')[0]
    a.classList.toggle('is-current', target === route || (route === '' && target === ''))
  })

  closeMobileMenu()

  if (view === 'produto') {
    renderProduto(produtoId || parts[1] || '')
  } else if (view === 'pedidos') {
    document.title = 'Pedidos — MIXDM Moda Feminina'
    renderPedidos()
  } else if (view === 'pedido') {
    document.title = 'Pedido — MIXDM Moda Feminina'
    renderPedido(pedidoId || parts[1] || '')
  } else if (view === 'privacidade') {
    document.title = 'Política de Privacidade — MIXDM Moda Feminina'
    removeProductJSONLD()
  } else if (view === 'termos') {
    document.title = 'Termos de Uso — MIXDM Moda Feminina'
    removeProductJSONLD()
  } else if (view === 'sobre') {
    document.title = 'Sobre — MIXDM Moda Feminina'
    removeProductJSONLD()
  } else if (view === 'contato') {
    document.title = 'Contato — MIXDM Moda Feminina'
    removeProductJSONLD()
  } else {
    document.title = 'MIXDM Moda Feminina — Curadoria de Moda'
    removeProductJSONLD()
    if (HOME_ANCHORS.includes(route)) {
      setTimeout(() => {
        const el = document.getElementById(route)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (view === 'home') {
      renderHome()
      initHeroCarousel()
    }
  }

  updateCanonical(hash)
}

function bindLinks() {
  $$('[data-link]').forEach(el => {
    const handler = (e) => {
      e.preventDefault()
      const dest = el.dataset.link
      const parts = dest.replace(/^#\/?/, '').split('/').filter(Boolean)
      navigate(parts[0] || 'home', parts[1] || null)
    }
    el.removeEventListener('click', handler)
    el.addEventListener('click', handler)
  })
}

window.navigate = function (view, id) {
  if (view !== 'produto' && view !== 'pedido') {
    state.previousView = view
  }
  if (view === 'produto') {
    history.pushState({ view: 'produto', id }, '', `?produto=${id}`)
  } else if (view === 'pedido') {
    history.pushState({ view: 'pedido', id }, '', `?pedido=${id}`)
  } else if (view === 'home') {
    history.pushState({ view }, '', window.location.pathname)
  } else {
    const hash = id ? `#/${view}/${id}` : `#/${view}`
    history.pushState({ view }, '', window.location.pathname + hash)
  }
  router()
}

window.goBack = function () {
  if (window.history.length > 1) {
    history.back()
  } else {
    navigate('home')
  }
}

function openMobileMenu() {
  if (!DOM.mobileMenu) return
  DOM.mobileMenu.classList.add('is-open')
  document.body.style.overflow = 'hidden'
  if (DOM.mobileToggle) DOM.mobileToggle.setAttribute('aria-expanded', 'true')
}

function closeMobileMenu() {
  if (!DOM.mobileMenu) return
  DOM.mobileMenu.classList.remove('is-open')
  document.body.style.overflow = ''
  if (DOM.mobileToggle) DOM.mobileToggle.setAttribute('aria-expanded', 'false')
}

function initMobileMenu() {
  if (DOM.mobileToggle) DOM.mobileToggle.addEventListener('click', openMobileMenu)
  if (DOM.mobileClose) DOM.mobileClose.addEventListener('click', closeMobileMenu)
  if (DOM.mobileMenu) {
    $$('a[data-link]', DOM.mobileMenu).forEach(a => a.addEventListener('click', closeMobileMenu))
    DOM.mobileMenu.addEventListener('click', e => {
      if (e.target === DOM.mobileMenu) closeMobileMenu()
    })
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu()
    })
  }
}

function updateCanonical() {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  const base = window.location.origin + window.location.pathname
  const params = new URLSearchParams(window.location.search)
  if (params.get('produto')) {
    link.href = `${base}?produto=${params.get('produto')}`
  } else if (params.get('pedido')) {
    link.href = `${base}?pedido=${params.get('pedido')}`
  } else {
    const hash = window.location.hash
    link.href = hash && hash !== '#/' ? `${base}${hash}` : base
  }
}

function injectWebsiteJSONLD() {
  const existing = document.getElementById('website-jsonld')
  if (existing) existing.remove()
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'website-jsonld'
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MIXDM Moda Feminina',
    url: window.location.origin + window.location.pathname,
    description: 'Curadoria de moda feminina com vestidos, calçados, bolsas e acessórios. Ofertas selecionadas em um só lugar.',
  })
  document.head.appendChild(script)
}

async function init() {
  await loadData()
  const params = new URLSearchParams(window.location.search)
  if (!params.get('produto') && !params.get('pedido')) {
    renderHome()
    initHeroCarousel()
  }
  initMobileMenu()
  bindLinks()
  injectWebsiteJSONLD()
  router()
  window.addEventListener('hashchange', router)
  window.addEventListener('popstate', router)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
