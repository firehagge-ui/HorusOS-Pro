// Amparo Flores — catálogo de produtos + carrinho + favoritos (demo, sem gateway)
// Catálogo REAL do cliente (nomes, preços e FOTOS reais enviados pelo Marcelo, 02/09/2026).
// Fotos em img/prod/pNN.jpg, numeradas conforme a lista de preços do cliente.

var PRODUTOS = [
  // ---- Buquês: rosas ----
  { id:'rosas-6',        nome:'Buquê com meia dúzia de rosas e gipsofila', cat:'Buquês',    preco:120, img:'img/prod/p14.jpg', desc:'Seis rosas com gipsofila e folhagem, montado à mão para presente.' },
  { id:'rosas-12',       nome:'Buquê com 12 rosas',                        cat:'Buquês',    preco:190, img:'img/prod/p05.jpg', desc:'Uma dúzia de rosas vermelhas com gipsofila e verde, o clássico da casa.' },
  { id:'rosas-12-rosa',  nome:'Buquê com 12 rosas na cor rosa',            cat:'Buquês',    preco:240, img:'img/prod/p17.jpg', desc:'Doze rosas cor de rosa, delicadas, com folhagem e acabamento em kraft.' },
  { id:'rosas-brancas',  nome:'Buquê com uma dúzia de rosas brancas na tela',cat:'Buquês',  preco:190, img:'img/prod/p16.jpg', desc:'Doze rosas brancas montadas na tela, sóbrio e elegante.' },
  { id:'rosas-15anos',   nome:'Buquê 15 anos (15 rosas)',                  cat:'Buquês',    preco:270, img:'img/prod/p09.jpg', desc:'Quinze rosas montadas para a data, com gipsofila e laço.' },
  { id:'rosas-18v',      nome:'Buquê com 18 rosas vermelhas',              cat:'Buquês',    preco:290, img:'img/prod/p07.jpg', desc:'Dezoito rosas vermelhas, volumoso e clássico, para um grande gesto.' },
  { id:'rosas-24',       nome:'Buquê com 24 rosas e gipsofila importado',  cat:'Buquês',    preco:360, img:'img/prod/p04.jpg', desc:'Duas dúzias de rosas contornadas por gipsofila importada.' },
  { id:'rosas-36',       nome:'Buquê com 36 rosas na tela',                cat:'Buquês',    preco:490, img:'img/prod/p13.jpg', desc:'Trinta e seis rosas montadas na tela, peça de grande impacto.' },
  { id:'rosas-50',       nome:'Buquê com 50 rosas na tela',                cat:'Buquês',    preco:750, img:'img/prod/p11.jpg', desc:'Cinquenta rosas na tela, uma das maiores peças da casa.' },
  { id:'rosas-copo',     nome:'Buquê com 30 rosas e 20 copos de leite',    cat:'Buquês',    preco:950, img:'img/prod/p24.jpg', desc:'Trinta rosas com vinte copos de leite, a peça de maior gesto da banca.' },
  { id:'rosas-kraft',    nome:'Buquê com 7 rosas no kraft',                cat:'Buquês',    preco:155, img:'img/prod/p21.jpg', desc:'Sete rosas no papel kraft, simples e bonito, para presente rápido.' },
  { id:'rosas-azuis',    nome:'Buquê com 7 rosas azuis',                   cat:'Buquês',    preco:155, img:'img/prod/p26.jpg', desc:'Sete rosas tingidas de azul, diferente e marcante.' },

  // ---- Buquês: girassóis ----
  { id:'girassois-6',    nome:'Buquê com 6 girassóis e tango',             cat:'Buquês',    preco:180, img:'img/prod/p22.jpg', desc:'Seis girassóis com tango e verde, o buquê mais alegre da banca.' },
  { id:'girassois-6r',   nome:'Buquê com 6 girassóis e 6 rosas',           cat:'Buquês',    preco:330, img:'img/prod/p45.jpg', desc:'Girassóis e rosas juntos, contraste de cores quentes.' },
  { id:'girassois-12',   nome:'Buquê com 12 girassóis',                    cat:'Buquês',    preco:350, img:'img/prod/p40.jpg', desc:'Uma dúzia de girassóis abertos, volumoso e luminoso.' },

  // ---- Buquês: campo e mistos ----
  { id:'campo-lirios',   nome:'Buquê com flores do campo e lírios',        cat:'Buquês',    preco:220, img:'img/prod/p29.jpg', desc:'Flores do campo com lírios, natural e delicado.' },
  { id:'campo',          nome:'Buquê com flores do campo',                 cat:'Buquês',    preco:120, img:'img/prod/p47.jpg', desc:'Mix de flores do campo, colorido e despojado.' },
  { id:'mistas-kraft',   nome:'Buquê com flores mistas no kraft',          cat:'Buquês',    preco:270, img:'img/prod/p53.jpg', desc:'Mix da estação montado no kraft, cores variadas conforme o dia.' },
  { id:'alstromelias',   nome:'Buquê com uma dúzia de alstromélias',       cat:'Buquês',    preco:190, img:'img/prod/p28.jpg', desc:'Doze alstromélias coloridas e duradouras, com folhagem.' },

  // ---- Arranjos ----
  { id:'cachepot',       nome:'Arranjo no cachepot de madeira',            cat:'Arranjos',  preco:250, img:'img/prod/p32.jpg', desc:'Mix da estação composto em cachepot de madeira, para mesa e balcão.' },
  { id:'cachepot-g',     nome:'Arranjo no cachepot de madeira (grande)',   cat:'Arranjos',  preco:350, img:'img/prod/p39.jpg', desc:'Versão maior do cachepot de madeira, com mais volume de flores.' },
  { id:'arranjo-nobres', nome:'Flores nobres no vaso de vidro',            cat:'Arranjos',  preco:450, img:'img/prod/p57.jpg', desc:'Flores nobres compostas em vaso de vidro, arranjo sofisticado.' },
  { id:'arranjo-24-lirios',nome:'Arranjo de 24 rosas e lírios (base com água)',cat:'Arranjos',preco:530,img:'img/prod/p38.jpg',desc:'Vinte e quatro rosas com lírios em base com água, kraft e eucalipto.' },

  // ---- Orquídeas ----
  { id:'mini-orquidea',  nome:'Mini orquídeas',                            cat:'Orquídeas', preco:99,  img:'img/prod/p54.jpg', desc:'Mini orquídeas plantadas, a especialidade da casa, para presente ou para durar.' },
  { id:'orquidea-cascata',nome:'Orquídea cascata',                         cat:'Orquídeas', preco:220, img:'img/prod/p30.jpg', desc:'Orquídea cascata de duas hastes, plantada e embrulhada.' },
  { id:'orquidea-vidro', nome:'Orquídea cascata de duas hastes no vaso de vidro',cat:'Orquídeas',preco:350,img:'img/prod/p31.jpg',desc:'Cascata de duas hastes apresentada em vaso de vidro, peça sofisticada.' },

  // ---- Plantas ----
  { id:'begonia',        nome:'Vaso de begônia',                           cat:'Plantas',   preco:118, img:'img/prod/p33.jpg', desc:'Begônia florida em vaso, cor e verde para qualquer canto.' },
  { id:'lirios-plantado',nome:'Lírios plantado',                           cat:'Plantas',   preco:118, img:'img/prod/p51.jpg', desc:'Lírios plantados em vaso, verde vivo e flor para a casa e o escritório.' },
  { id:'vaso-lirios',    nome:'Vaso de lírios',                            cat:'Plantas',   preco:118, img:'img/prod/p52.jpg', desc:'Vaso de lírios, delicado e duradouro.' },

  // ---- Cestas ----
  { id:'cesta-chocolate',nome:'Cesta com rosas e chocolate',               cat:'Cestas',    preco:195, img:'img/prod/p48.jpg', desc:'Rosas e chocolate montados em cesta, o presente que agrada na hora.' },
  { id:'rosas-ferrero',  nome:'Buquê com 9 rosas e caixa de Ferrero Rocher',cat:'Cestas',   preco:220, img:'img/prod/p12.jpg', desc:'Nove rosas com uma caixa de Ferrero Rocher, para presentear com um mimo.' },
  { id:'cesta-ferrero',  nome:'Cesta com 9 rosas e chocolate Ferrero Rocher',cat:'Cestas',  preco:298, img:'img/prod/p19.jpg', desc:'Cesta com nove rosas e Ferrero Rocher, para uma data especial.' },
  { id:'ferrero',        nome:'Caixa de Ferrero Rocher',                   cat:'Cestas',    preco:49,  img:'img/prod/p49.jpg', desc:'Caixa de Ferrero Rocher para somar ao arranjo ou enviar junto.' },

  // ---- Eventos ----
  { id:'evento-mesa',    nome:'Arranjo para eventos',                      cat:'Eventos',   preco:250, img:'img/prod/p50.jpg', desc:'Arranjo e decoração para batizado, aniversário e comemoração. Valor de partida, orçado conforme o espaço.' }
];

var CATEGORIAS = ['Buquês','Arranjos','Orquídeas','Plantas','Cestas','Eventos'];

var PRODUTOS_MAP = {};
PRODUTOS.forEach(function (p) { PRODUTOS_MAP[p.id] = p; });

var WPP = '557191188740';

function moeda(n){ return 'R$ ' + n.toFixed(2).replace('.', ','); }

// ---------- carrinho (localStorage) ----------
var CART_KEY = 'amparo_cart_v1';
function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { return {}; } }
function saveCart(c){ try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} updateBadges(); }
function addToCart(id, q){ var c = getCart(); c[id] = (c[id] || 0) + (q || 1); saveCart(c); }
function setQty(id, q){ var c = getCart(); if (q <= 0) delete c[id]; else c[id] = q; saveCart(c); }
function removeFromCart(id){ var c = getCart(); delete c[id]; saveCart(c); }
function cartCount(){ var c = getCart(), n = 0; for (var k in c) n += c[k]; return n; }
function cartItems(){ var c = getCart(), out = []; for (var id in c){ if (PRODUTOS_MAP[id]) out.push({ p: PRODUTOS_MAP[id], q: c[id] }); } return out; }
function cartTotal(){ return cartItems().reduce(function (s, it){ return s + it.p.preco * it.q; }, 0); }
function updateBadges(){
  var n = cartCount();
  document.querySelectorAll('[data-cart-badge]').forEach(function (b){ b.textContent = n; b.hidden = n === 0; });
}
function checkoutWhatsApp(){
  var items = cartItems();
  if (!items.length) return 'https://wa.me/' + WPP;
  var linhas = items.map(function (it){ return '• ' + it.q + 'x ' + it.p.nome + ' — ' + moeda(it.p.preco * it.q); });
  var texto = 'Olá! Quero fechar este pedido pelo site da Amparo Flores:\n\n'
    + linhas.join('\n') + '\n\nTotal: ' + moeda(cartTotal())
    + '\n\nMe diz a forma de entrega e como pago, por favor.';
  return 'https://wa.me/' + WPP + '?text=' + encodeURIComponent(texto);
}

// ---------- favoritos (localStorage) ----------
var FAV_KEY = 'amparo_favs_v1';
function getFavs(){ try { return JSON.parse(localStorage.getItem(FAV_KEY)) || {}; } catch (e) { return {}; } }
function isFav(id){ return !!getFavs()[id]; }
function toggleFav(id){ var f = getFavs(); if (f[id]) delete f[id]; else f[id] = 1; try { localStorage.setItem(FAV_KEY, JSON.stringify(f)); } catch (e) {} return !!f[id]; }

// ---------- toast ----------
function toast(msg){
  var t = document.getElementById('toast');
  if (!t){ t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._to); t._to = setTimeout(function (){ t.classList.remove('show'); }, 1900);
}

// ---------- handlers delegados ----------
document.addEventListener('DOMContentLoaded', function (){
  updateBadges();
  document.addEventListener('click', function (e){
    var add = e.target.closest ? e.target.closest('[data-add]') : null;
    if (add){ e.preventDefault(); var id = add.getAttribute('data-add'); if (PRODUTOS_MAP[id]){ addToCart(id, 1); toast('Adicionado ao carrinho: ' + PRODUTOS_MAP[id].nome); } return; }
    var fav = e.target.closest ? e.target.closest('[data-fav]') : null;
    if (fav){ e.preventDefault(); var fid = fav.getAttribute('data-fav'); var on = toggleFav(fid); fav.classList.toggle('on', on); fav.setAttribute('aria-pressed', on); }
  });
});

// ---------- render de card ----------
function cardHTML(p){
  var foto = p.img
    ? '<img src="' + p.img + '" alt="' + p.nome + '" loading="lazy" decoding="async">'
    : '<span class="falta"><b>' + p.cat + '</b>foto real entra aqui</span>';
  var fav = isFav(p.id) ? ' on' : '';
  return '<article class="prod">'
    + '<div class="prod-ph' + (p.img ? '' : ' falta') + '">'
    + '<a class="prod-ph-link" href="produto.html?id=' + p.id + '" aria-label="' + p.nome + '">' + foto + '</a>'
    + '<button class="fav' + fav + '" data-fav="' + p.id + '" aria-label="Favoritar ' + p.nome + '" aria-pressed="' + (fav ? 'true' : 'false') + '">'
    + '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.65 12 20 12 20z"/></svg></button>'
    + '</div>'
    + '<div class="prod-body">'
    + '<span class="prod-cat">' + p.cat + '</span>'
    + '<h3><a href="produto.html?id=' + p.id + '">' + p.nome + '</a></h3>'
    + '<div class="prod-foot">'
    + '<span class="prod-price">' + moeda(p.preco) + '</span>'
    + '<button class="add" data-add="' + p.id + '" aria-label="Adicionar ' + p.nome + ' ao carrinho">'
    + '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.7L7 20.5A10 10 0 1 0 12 2z"/></svg>Adicionar</button>'
    + '</div></div></article>';
}
