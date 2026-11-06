// GONZALITOZ · página de presentación. Sin librerías, sin cookies, sin datos del visitante.
(function () {
  'use strict';
  var d = document;
  d.documentElement.classList.add('js');

  // Barra flotante: se compacta al bajar un poco, se esconde al seguir bajando y vuelve en cuanto subes
  var barra = d.getElementById('barra'), boton = d.getElementById('botonMenu'), nav = d.getElementById('nav');
  var ultimoY = window.scrollY, abierto = false;
  function alDesplazar() {
    var y = window.scrollY;
    barra.classList.toggle('compacta', y > 40);
    if (!abierto) barra.classList.toggle('escondida', y > 320 && y > ultimoY + 4);
    if (y < ultimoY - 4 || y < 320) barra.classList.remove('escondida');
    ultimoY = y;
  }
  window.addEventListener('scroll', alDesplazar, { passive: true });
  barra.addEventListener('focusin', function () { barra.classList.remove('escondida'); });

  // Menú en celular: pantalla completa
  function menu(abrir) {
    abierto = abrir;
    nav.classList.toggle('abierto', abrir);
    boton.setAttribute('aria-expanded', String(abrir));
    boton.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    d.body.style.overflow = abrir ? 'hidden' : '';
  }
  boton.addEventListener('click', function () { menu(!abierto); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a') && abierto) menu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && abierto) { menu(false); boton.focus(); } });

  // Indicador dorado que se desliza a la sección activa
  var marca = d.getElementById('barraMarca');
  function moverMarca(a) {
    if (!marca || !a) { if (marca) marca.style.opacity = '0'; return; }
    marca.style.left = a.offsetLeft + 'px';
    marca.style.width = a.offsetWidth + 'px';
    marca.style.opacity = '1';
  }

  // Tarjetas de sabor: tocar = ver en taco o en cemita
  d.querySelectorAll('.sabor').forEach(function (t) {
    t.addEventListener('click', function () {
      var cemita = t.classList.toggle('es-cemita');
      t.setAttribute('aria-pressed', String(cemita));
    });
  });

  // QR del menú digital (en computadora: para abrirlo en el celular)
  var qr = d.getElementById('qrMenu');
  if (qr && window.qrcode && getComputedStyle(qr.parentNode).display !== 'none') {
    try { var q = window.qrcode(0, 'M'); q.addData(qr.getAttribute('data-url')); q.make(); qr.innerHTML = q.createSvgTag({ cellSize: 6, margin: 0, scalable: true }); } catch (_) {}
  }

  // Mapa de Google: solo si el visitante lo pide (no carga nada de terceros antes)
  var cargar = d.getElementById('cargarMapa');
  if (cargar) {
    cargar.addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Calle 9 Sur 707, Local 4, Centro, 72000 Heroica Puebla de Zaragoza, Pue.') + '&z=17&output=embed';
      f.title = 'Mapa: Calle 9 Sur 707, Local 4, Centro, Puebla';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      d.getElementById('mapa').appendChild(f);
    });
  }

  // Sección activa en la barra
  var enlaces = Array.prototype.slice.call(d.querySelectorAll('.barra-nav a'));
  var inicio = d.getElementById('inicio');
  if ('IntersectionObserver' in window) {
    var secciones = enlaces.map(function (a) { return d.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var vista = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var activo = null;
        enlaces.forEach(function (a) { var es = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('activo', es); if (es) activo = a; });
        moverMarca(activo);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(function (s) { vista.observe(s); });
    if (inicio) new IntersectionObserver(function (es) { if (es[0].isIntersecting) { enlaces.forEach(function (a) { a.classList.remove('activo'); }); moverMarca(null); } }, { rootMargin: '-45% 0px -50% 0px' }).observe(inicio);

    // Aparecer al bajar: solo lo que todavía no está en pantalla
    var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducir) {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.remove('oculto'); obs.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      d.querySelectorAll('.seccion-cab, .sabor, .mitad, .nosotros-txt, .promesa, .visita-datos, .mapa, .redes > *, .foto, .abrir-menu').forEach(function (el, i) {
        el.classList.add('revelar');
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add('oculto');
          if (el.classList.contains('sabor') || el.classList.contains('promesa')) el.style.transitionDelay = (i % 5) * 70 + 'ms';
          obs.observe(el);
        }
      });
    }
  }

  var anio = d.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
