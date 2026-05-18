/* ================================================================
   ACADEMIA DE FÍSICA — CECYT 1
   main.js  |  Vanilla JS, sin dependencias externas
   ================================================================ */

'use strict';

/* ── Estado global ──────────────────────────────────────────────── */
const APP = {
  data:        null,   // contenido.json cargado
  currentPage: null    // id de la página activa
};

/* ── Refs al DOM (se asignan en init) ───────────────────────────── */
const $ = {};

/* ================================================================
   INICIALIZACIÓN
   ================================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  $.navList        = document.getElementById('navList');
  $.main           = document.getElementById('mainContent');
  $.nav            = document.getElementById('sidebarNav');
  $.widgets        = document.getElementById('sidebarWidgets');
  $.hamburger      = document.getElementById('menuToggle');
  $.overlay        = document.getElementById('overlay');
  $.siteTitle      = document.getElementById('site-title');
  $.siteSub        = document.getElementById('site-subtitle');
  $.footerTitle    = document.getElementById('site-footer-title');
  $.year           = document.getElementById('currentYear');

  if ($.year) $.year.textContent = new Date().getFullYear();

  $.hamburger.addEventListener('click', toggleMenu);
  $.overlay.addEventListener('click', closeMenu);

  /* Cerrar con Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $.nav.classList.contains('open')) closeMenu();
  });

  await cargarContenido();

  /* Ruta inicial desde hash o "inicio" por defecto */
  const paginaInicial = window.location.hash.slice(1) || 'inicio';
  navegarA(paginaInicial, false);

  /* Escuchar cambios de hash para navegación con botones Atrás/Adelante */
  window.addEventListener('hashchange', () => {
    const pagina = window.location.hash.slice(1) || 'inicio';
    navegarA(pagina, false);
  });
});

/* ================================================================
   CARGA DE CONTENIDO JSON
   ================================================================ */
async function cargarContenido() {
  try {
    const res = await fetch('data/contenido.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    APP.data = await res.json();
    aplicarInfoGlobal();
    renderizarNav();
    renderizarWidgets();
  } catch (err) {
    console.error('No se pudo cargar contenido.json:', err);
    $.main.innerHTML = `
      <div class="alert alert-warning">
        <div class="alert-title">Error al cargar el contenido</div>
        <p>No se encontró <code>data/contenido.json</code>.<br>
        Asegúrate de abrir el sitio desde un servidor local (no directamente con <code>file://</code>).<br>
        Puedes usar <code>npm run dev</code> desde la carpeta del proyecto.</p>
      </div>`;
  }
}

/* ── Aplica título y subtítulo del sitio ──────────────────────── */
function aplicarInfoGlobal() {
  const s = APP.data.sitio || {};
  if ($.siteTitle    && s.titulo)    $.siteTitle.textContent    = s.titulo;
  if ($.siteSub      && s.subtitulo) $.siteSub.textContent      = s.subtitulo;
  if ($.footerTitle  && s.titulo)    $.footerTitle.textContent  = s.titulo;
  if (s.titulo)      document.title = `${s.titulo} – ${s.subtitulo || 'CECYT 1'}`;
}

/* ================================================================
   NAVEGACIÓN
   ================================================================ */
function renderizarNav() {
  const menu = APP.data.menu || [];
  $.navList.innerHTML = menu.map(item => `
    <li>
      <a href="#${item.id}" data-pagina="${item.id}" role="menuitem"
         aria-label="Ir a ${item.label.replace(/\p{Emoji}/gu, '').trim()}">
        ${item.label}
      </a>
    </li>`).join('');

  $.navList.addEventListener('click', e => {
    const enlace = e.target.closest('a[data-pagina]');
    if (!enlace) return;
    e.preventDefault();
    const id = enlace.dataset.pagina;
    window.location.hash = id;
    navegarA(id);
    closeMenu();
  });
}

function navegarA(idPagina, hacerScroll = true) {
  if (!APP.data) return;
  const paginas = APP.data.paginas || {};

  if (!paginas[idPagina]) idPagina = 'inicio';
  if (APP.currentPage === idPagina) return;
  APP.currentPage = idPagina;

  /* Marcar enlace activo */
  document.querySelectorAll('#navList a').forEach(a => {
    a.classList.toggle('active', a.dataset.pagina === idPagina);
    a.setAttribute('aria-current', a.dataset.pagina === idPagina ? 'page' : 'false');
  });

  renderizarPagina(idPagina);

  if (hacerScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $.main.focus({ preventScroll: true });
}

/* ================================================================
   RENDERIZADO DE PÁGINAS
   ================================================================ */
function renderizarPagina(id) {
  const datos = APP.data.paginas[id];
  if (!datos) return;

  const mapa = {
    inicio:   () => paginaInicio(datos),
    fisica1:  () => paginaFisica(datos, '1'),
    fisica2:  () => paginaFisica(datos, '2'),
    fisica3:  () => paginaFisica(datos, '3'),
    fisica4:  () => paginaFisica(datos, '4'),
    horarios: () => paginaHorarios(datos),
  };

  $.main.innerHTML = (mapa[id] || (() => '<p>Sección no encontrada.</p>'))();
  configurarInteracciones(id);
}

/* ── INICIO ───────────────────────────────────────────────────── */
function paginaInicio(d) {
  const accesos = (d.accesos_rapidos || []).map(a => `
    <a href="#${esc(a.seccion)}" class="btn btn-outline" data-pagina="${esc(a.seccion)}">${esc(a.label)}</a>
  `).join('');

  return `
    <div class="page-header">
      <h2>${esc(d.titulo || 'Inicio')}</h2>
    </div>

    ${d.aviso ? `
    <div class="alert alert-warning">
      <div class="alert-title">${esc(d.aviso.titulo)}</div>
      <p>${esc(d.aviso.texto)}</p>
    </div>` : ''}

    <div class="welcome-banner">
      <h3>Bienvenido a la Academia de Física</h3>
      <p>${esc(d.bienvenida || '')}</p>
      ${accesos ? `<div class="quick-grid">${accesos}</div>` : ''}
    </div>`;
}

/* ── FÍSICA I, II, III y IV ───────────────────────────────────── */
function paginaFisica(d, num) {
  const unidades = (d.unidades || []).map((u, i) => {
    const bodyId = `u${num}-${i}`;
    return `
      <div class="unidad-card">
        <div class="unidad-header"
             data-body="${bodyId}"
             role="button"
             tabindex="0"
             aria-expanded="true"
             aria-controls="${bodyId}">
          ${esc(u.nombre)}
          <span class="unidad-chevron" aria-hidden="true">▼</span>
        </div>
        <div class="unidad-body" id="${bodyId}">
          <p class="unidad-desc">${esc(u.descripcion || '')}</p>
          ${u.materiales && u.materiales.length
            ? `<div class="mat-label">📁 Materiales</div>
               <div class="mat-list">${u.materiales.map(m => htmlMaterial(m)).join('')}</div>`
            : '<p style="font-size:.84rem;color:var(--c-muted)">Sin materiales disponibles aún.</p>'
          }
        </div>
      </div>`;
  }).join('');

  return `
    <div class="page-header">
      <h2>${esc(d.titulo || `Física ${num}`)}</h2>
      <p class="desc">${esc(d.descripcion || '')}</p>
    </div>
    ${unidades || '<p>Sin unidades disponibles.</p>'}`;
}

/* ── HORARIOS ─────────────────────────────────────────────────── */
function paginaHorarios(d) {
  const filasClases = (d.clases || []).map(c => {
    const badge = c.materia.includes('II') ? 'badge-fii'
                : c.materia.includes('I')  ? 'badge-fi'
                : 'badge-lab';
    return `<tr>
      <td>${esc(c.dia)}</td>
      <td>${esc(c.hora)}</td>
      <td><span class="badge ${badge}">${esc(c.materia)}</span></td>
      <td>${esc(c.grupo)}</td>
      <td>${esc(c.salon)}</td>
    </tr>`;
  }).join('');

  const filasAsesorias = (d.asesorias || []).map(a => `
    <tr>
      <td>${esc(a.dia)}</td>
      <td>${esc(a.hora)}</td>
      <td>${esc(a.lugar)}</td>
    </tr>`).join('');

  return `
    <div class="page-header">
      <h2>${esc(d.titulo || 'Horarios')}</h2>
      <p class="desc">${esc(d.descripcion || '')} · ${esc(d.semestre || '')}</p>
    </div>

    <div class="section-title">📚 Clases</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Día</th><th>Horario</th><th>Materia</th><th>Grupo</th><th>Salón</th></tr>
        </thead>
        <tbody>${filasClases}</tbody>
      </table>
    </div>

    <div class="section-title">💬 Asesorías</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Día</th><th>Horario</th><th>Lugar</th></tr>
        </thead>
        <tbody>${filasAsesorias}</tbody>
      </table>
    </div>

    ${d.nota ? `<div class="nota-box"><strong>📌 Nota:</strong> ${esc(d.nota)}</div>` : ''}`;
}

/* ================================================================
   WIDGETS (sidebar derecho)
   ================================================================ */
function renderizarWidgets() {
  const w = APP.data.widgets || {};
  let html = '';

  /* Avisos */
  if (w.avisos) {
    const items = (w.avisos.items || []).map(a => `
      <div class="w-aviso ${a.urgente ? 'urgente' : ''}">
        ${esc(a.texto)}
        <div class="w-date">${fmtFecha(a.fecha)}</div>
      </div>`).join('') || '<p style="padding:.6rem 1rem;font-size:.8rem;color:var(--c-muted)">Sin avisos.</p>';
    html += widget(w.avisos.titulo, items);
  }

  /* Noticias */
  if (w.noticias) {
    const items = (w.noticias.items || []).map(n => `
      <div class="w-noticia">
        <strong>${esc(n.titulo)}</strong>
        ${esc(n.texto)}
        <div class="w-date">${fmtFecha(n.fecha)}</div>
      </div>`).join('');
    html += widget(w.noticias.titulo, items);
  }

  /* Eventos */
  if (w.eventos) {
    const items = (w.eventos.items || []).map(ev => `
      <div class="w-evento">
        <div class="ev-dot ${esc(ev.tipo)}" aria-hidden="true"></div>
        <div class="ev-name">${esc(ev.nombre)}</div>
        <div class="ev-date">${fmtFecha(ev.fecha)}</div>
      </div>`).join('');
    html += widget(w.eventos.titulo, items);
  }

  /* Contacto rápido */
  if (w.contacto_rapido) {
    const c = w.contacto_rapido;
    const body = `<div class="w-cq-body">
      <div class="w-cq-row">✉️ <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>
      <div class="w-cq-row">🕐 ${esc(c.horario)}</div>
    </div>`;
    html += `<div class="widget">
      <div class="widget-hd">${c.titulo}</div>
      ${body}
    </div>`;
  }

  $.widgets.innerHTML = html;
}

function widget(titulo, contenido) {
  return `<div class="widget">
    <div class="widget-hd">${titulo}</div>
    <div class="widget-bd">${contenido}</div>
  </div>`;
}

/* ================================================================
   INTERACCIONES POST-RENDER
   ================================================================ */
function configurarInteracciones(id) {
  /* Acordeón para unidades de Física */
  if (['fisica1','fisica2','fisica3','fisica4'].includes(id)) {
    document.querySelectorAll('.unidad-header').forEach(hdr => {
      hdr.addEventListener('click', toggleAcordeon);
      hdr.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAcordeon.call(hdr); }
      });
    });
  }

  /* Navegación de accesos rápidos (Inicio) */
  if (id === 'inicio') {
    document.querySelectorAll('.quick-grid a[data-pagina]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const pagina = a.dataset.pagina;
        window.location.hash = pagina;
        navegarA(pagina);
      });
    });
  }

}

/* ── Acordeón de unidades ─────────────────────────────────────── */
function toggleAcordeon() {
  const body = document.getElementById(this.dataset.body);
  if (!body) return;
  const abierto = this.getAttribute('aria-expanded') === 'true';

  if (abierto) {
    body.style.display = 'none';
    this.setAttribute('aria-expanded', 'false');
  } else {
    body.style.display = '';
    this.setAttribute('aria-expanded', 'true');
  }
}

/* ================================================================
   MENÚ MÓVIL
   ================================================================ */
function toggleMenu() {
  $.nav.classList.contains('open') ? closeMenu() : openMenu();
}
function openMenu() {
  $.nav.classList.add('open');
  $.overlay.classList.add('visible');
  $.hamburger.classList.add('active');
  $.hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  $.nav.classList.remove('open');
  $.overlay.classList.remove('visible');
  $.hamburger.classList.remove('active');
  $.hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ================================================================
   UTILIDADES
   ================================================================ */

/* Escapar HTML para prevenir XSS */
function esc(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

/* Formatear fecha "YYYY-MM-DD" → "10 mar 2025" */
function fmtFecha(str) {
  if (!str) return '';
  try {
    const d = new Date(str + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return str; }
}

/* HTML para un enlace de material descargable */
function htmlMaterial(m) {
  const iconos = { pdf: '📄', video: '▶️', docx: '📝', xlsx: '📊', pptx: '📊', zip: '🗜️' };
  const icono  = iconos[m.tipo] || '📎';
  const externo = m.url && (m.url.startsWith('http://') || m.url.startsWith('https://'));
  const target  = externo ? ' target="_blank" rel="noopener noreferrer"' : '';

  return `<a href="${esc(m.url || '#')}" class="mat-item"${target}
             aria-label="${esc(m.titulo)} (${esc(m.tipo)})">
    <span class="mat-icon" aria-hidden="true">${icono}</span>
    <span class="mat-name">${esc(m.titulo)}</span>
    <span class="mat-tipo ${esc(m.tipo)}">${esc(m.tipo.toUpperCase())}</span>
  </a>`;
}
