// GONZALITOZ · página de presentación. Sin librerías, sin cookies, sin datos del visitante.
(function () {
  'use strict';
  var d = document;
  d.documentElement.classList.add('js');

  // Menú en celular
  var boton = d.getElementById('botonMenu'), nav = d.getElementById('nav');
  if (boton && nav) {
    boton.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('abierto'); boton.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Tarjetas de sabor: tocar = ver en taco o en cemita
  d.querySelectorAll('.sabor').forEach(function (t) {
    t.addEventListener('click', function () {
      var cemita = t.classList.toggle('es-cemita');
      t.setAttribute('aria-pressed', String(cemita));
    });
  });

  // Carrusel de sabores en celular: puntitos que siguen al dedo
  var car = d.getElementById('sabores'), pista = d.getElementById('saboresPista');
  if (car && pista) {
    car.addEventListener('scroll', function () {
      var t = car.querySelector('.sabor'); if (!t) return;
      var i = Math.round(car.scrollLeft / (t.offsetWidth + 16));
      pista.querySelectorAll('i').forEach(function (p, j) { p.classList.toggle('on', j === i); });
    }, { passive: true });
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
  if ('IntersectionObserver' in window) {
    var secciones = enlaces.map(function (a) { return d.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var vista = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(function (s) { vista.observe(s); });

    // Aparecer al bajar: solo lo que todavía no está en pantalla
    var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducir) {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.remove('oculto'); obs.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      d.querySelectorAll('.seccion-cab, .sabor, .mitad, .pizarron, .nosotros-txt, .promesa, .visita-datos, .mapa, .redes > *, .foto').forEach(function (el, i) {
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
