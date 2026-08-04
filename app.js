/* ================================================================
   IPM STUDY HUB — APP LOGIC (v2.1 - Robust & Bug-Free)
   ================================================================ */

// Catch global errors for debugging
window.onerror = function (message, source, lineno, colno, error) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'fixed';
  errDiv.style.bottom = '10px';
  errDiv.style.right = '10px';
  errDiv.style.background = '#f43f5e';
  errDiv.style.color = '#fff';
  errDiv.style.padding = '12px 18px';
  errDiv.style.borderRadius = '8px';
  errDiv.style.zIndex = '9999';
  errDiv.style.fontSize = '12px';
  errDiv.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
  errDiv.innerHTML = `<strong>Error JS:</strong> ${message} <br><small>Línea ${lineno}:${colno}</small>`;
  document.body.appendChild(errDiv);
  return false;
};

// ----------------------------------------------------------------
// NAVIGATION: Main Modules (IPM, Riesgos, Manual)
// ----------------------------------------------------------------
document.querySelectorAll('.mod-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const mod = tab.dataset.module;
    
    // Switch tabs
    document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Switch modules
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    const targetModule = document.getElementById(`module-${mod}`);
    if (targetModule) {
      targetModule.classList.add('active');
    }
  });
});

// ----------------------------------------------------------------
// NAVIGATION: IPM Sub-sections (Fundamentos, Nuevos, etc.)
// ----------------------------------------------------------------
document.querySelectorAll('.sub-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const subId = tab.dataset.sub;
    
    // Switch sub-tabs
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Switch sub-sections
    document.querySelectorAll('.sub-section').forEach(s => s.classList.remove('active'));
    const targetSub = document.getElementById(`sub-${subId}`);
    if (targetSub) {
      targetSub.classList.add('active');
      
      // Reset TOC links to top one
      const firstTOCLink = targetSub.querySelector('.toc-link');
      if (firstTOCLink) {
        targetSub.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
        firstTOCLink.classList.add('active');
      }
    }
  });
});

// ----------------------------------------------------------------
// INTERACTION: Accordion Toggle
// ----------------------------------------------------------------
function toggleAcc(headerBtn) {
  const item = headerBtn.closest('.acc-item');
  const body = item.querySelector('.acc-body');
  
  if (headerBtn.classList.contains('open')) {
    headerBtn.classList.remove('open');
    body.style.display = 'none';
  } else {
    headerBtn.classList.add('open');
    body.style.display = 'block';
  }
}

// ----------------------------------------------------------------
// INTERACTION: Table of Contents Link Highlighting on Scroll
// ----------------------------------------------------------------
function initScrollSpy() {
  const sections = document.querySelectorAll('.content-section');
  const tocLinks = document.querySelectorAll('.toc-link');

  // Smooth scroll logic for TOC links
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update active class immediately
        tocLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Scroll spy to highlight current section
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPos >= (sectionTop - 160)) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Safe initialisation (handling race conditions for readyState)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollSpy);
} else {
  initScrollSpy();
}

// ----------------------------------------------------------------
// CALCULATOR LIBRARIES & FORMULAS
// ----------------------------------------------------------------

// Table Art. 33 (Nuevos Afiliados — Personal Auxiliar)
const tablaRetiro33 = {
  58: { 25:65, 26:68, 27:71, 28:74, 29:77, 30:80, 31:83, 32:86, 33:89, 34:92, 35:95 },
  59: { 25:68, 26:71, 27:74, 28:77, 29:80, 30:83, 31:86, 32:89, 33:92, 34:95, 35:95 },
  60: { 25:71, 26:74, 27:77, 28:80, 29:83, 30:86, 31:89, 32:92, 33:95, 34:95, 35:95 },
  61: { 25:74, 26:77, 27:80, 28:83, 29:86, 30:89, 31:92, 32:95, 33:95, 34:95, 35:95 },
  62: { 25:77, 26:80, 27:83, 28:86, 29:89, 30:92, 31:95, 32:95, 33:95, 34:95, 35:95 },
  63: { 25:80, 26:83, 27:86, 28:89, 29:92, 30:95, 31:95, 32:95, 33:95, 34:95, 35:95 },
  64: { 25:83, 26:86, 27:89, 28:92, 29:95, 30:95, 31:95, 32:95, 33:95, 34:95, 35:95 },
  65: { 25:86, 26:89, 27:92, 28:95, 29:95, 30:95, 31:95, 32:95, 33:95, 34:95, 35:95 },
  66: { 25:89, 26:92, 27:95, 28:95, 29:95, 30:95, 31:95, 32:95, 33:95, 34:95, 35:95 },
  67: { 25:92, 26:95, 27:95, 28:95, 29:95, 30:95, 31:95, 32:95, 33:95, 34:95, 35:95 },
  68: { 25:95, 26:95, 27:95, 28:95, 29:95, 30:95, 31:95, 32:95, 33:95, 34:95, 35:95 }
};

function getRetiroPct(edad, anos) {
  const edadKey = Math.min(Math.max(Math.floor(edad), 58), 68);
  const anosKey = Math.min(Math.max(Math.floor(anos), 25), 35);
  const row = tablaRetiro33[edadKey] || tablaRetiro33[68];
  return row[anosKey] || 95;
}

// Calculadora 1: Pensión por Retiro (Nuevos Afiliados - Art. 33)
function calcRetiro() {
  const sbm = parseFloat(document.getElementById('sbmRetiro').value);
  const anos = parseInt(document.getElementById('anosRetiro').value);
  const edad = parseInt(document.getElementById('edadRetiro').value);

  if (!sbm || sbm <= 0 || !anos || anos < 25 || !edad) {
    alert('Por favor ingresa valores válidos (SBM > 0, años ≥ 25, edad ≥ 50).');
    return;
  }

  let pct = 0;
  let calculationType = "";

  if (edad < 58) {
    // Si tiene menos de 58 años, se asume Riesgo Especial (25 años, edad 50)
    pct = Math.min(95, 65 + (Math.max(0, anos - 25) * 3));
    calculationType = `Riesgo Especial: 65% base + 3% por año adicional (tope 95%)`;
  } else {
    // Personal Auxiliar (edad >= 58)
    pct = getRetiroPct(edad, anos);
    calculationType = `Personal Auxiliar: Porcentaje de la tabla oficial del Art. 33`;
  }

  const pension = sbm * (pct / 100);
  const anual = pension * 14;

  const resultPanel = document.getElementById('resultRetiro');
  resultPanel.classList.add('show');
  document.getElementById('retiroMonto').textContent = `L. ${fmt(pension)}`;
  document.getElementById('retiroLabel').textContent = `Pensión mensual (${pct}% del SBM)`;
  document.getElementById('retiroBreakdown').innerHTML = `
    <div class="example-block" style="margin-top:12px">
      <div class="ex-title">📐 Desglose del Cálculo</div>
      <div class="ex-row"><span class="ex-label">Método aplicado</span><span class="ex-value" style="font-size:11px">${calculationType}</span></div>
      <div class="ex-row"><span class="ex-label">SBM Promedio</span><span class="ex-value">L. ${fmt(sbm)}</span></div>
      <div class="ex-row"><span class="ex-label">Porcentaje aplicado</span><span class="ex-value">${pct}%</span></div>
      <div class="ex-row"><span class="ex-label">Pago mensual</span><span class="ex-value">L. ${fmt(pension)}</span></div>
      <div class="ex-total">Total Anual (14 pagos): L. ${fmt(anual)}</div>
    </div>
  `;
}

// Calculadora 2: Pensión por Discapacidad (Art. 35)
function calcDiscapacidad() {
  const sbm = parseFloat(document.getElementById('sbmDisc').value);
  const causa = parseInt(document.getElementById('causaDisc').value);

  if (!sbm || sbm <= 0) {
    alert('Ingresa un SBM válido.');
    return;
  }

  const pension = sbm * (causa / 100);
  const multiplier = causa === 90 ? 40 : 20;
  const auxilio = pension * multiplier;
  const anual = pension * 14;
  const conyuge = pension * 0.5;

  const resultPanel = document.getElementById('resultDisc');
  resultPanel.classList.add('show');
  
  document.getElementById('discMonto').textContent = `L. ${fmt(pension)}`;
  document.getElementById('discBreakdown').innerHTML = `
    <div class="example-block" style="margin-top:12px">
      <div class="ex-title">📐 Desglose del Cálculo</div>
      <div class="ex-row"><span class="ex-label">Renta Vitalicia (${causa}%)</span><span class="ex-value">L. ${fmt(pension)}/mes</span></div>
      <div class="ex-row"><span class="ex-label">Monto Anual (14 pagos)</span><span class="ex-value">L. ${fmt(anual)}</span></div>
      <div class="ex-row"><span class="ex-label">Auxilio (Pago Único: ${multiplier} meses)</span><span class="ex-value" style="color:var(--c-cyan)">L. ${fmt(auxilio)}</span></div>
      <div class="ex-row"><span class="ex-label">Pensión Viudez (50%)</span><span class="ex-value">L. ${fmt(conyuge)}/mes</span></div>
      <div class="ex-total">Auxilio Pago Único: L. ${fmt(auxilio)}</div>
    </div>
  `;
}

// Calculadora 3: Auxilio de Sobrevivencia (Art. 37)
function calcSobrevivencia() {
  const base = parseFloat(document.getElementById('sbmSobrev').value);
  const option = document.getElementById('situSobrev').value;

  if (!base || base <= 0) {
    alert('Ingresa una cantidad válida.');
    return;
  }

  let multiplier = 20;
  let label = "Muerte por otra causa (Activo / Retirado)";
  
  if (option === '40') {
    multiplier = 40;
    label = "Muerte por Alto Riesgo en Acto de Servicio";
  }

  const total = base * multiplier;
  const resultPanel = document.getElementById('resultSobrev');
  resultPanel.classList.add('show');
  
  document.getElementById('sobrevMonto').textContent = `L. ${fmt(total)}`;
  document.getElementById('sobrevBreakdown').innerHTML = `
    <div class="example-block" style="margin-top:12px">
      <div class="ex-title">📐 Desglose del Cálculo</div>
      <div class="ex-row"><span class="ex-label">Base (SBM / Pensión)</span><span class="ex-value">L. ${fmt(base)}</span></div>
      <div class="ex-row"><span class="ex-label">Condición</span><span class="ex-value">${label}</span></div>
      <div class="ex-row"><span class="ex-label">Multiplicador</span><span class="ex-value">× ${multiplier} meses</span></div>
      <div class="ex-total">Auxilio Total a entregar: L. ${fmt(total)}</div>
    </div>
  `;
}

// Calculadora 4: Pre-existentes Oficiales (Art. 57)
const tablaOfc57 = { 22:58, 23:62, 24:66, 25:70, 26:74, 27:78, 28:82, 29:86, 30:90, 31:92, 32:94, 33:96, 34:98, 35:100 };

function calcPreExistente() {
  const sbm = parseFloat(document.getElementById('sbmPre').value);
  const anos = parseInt(document.getElementById('anosPre').value);

  if (!sbm || sbm <= 0 || !anos || anos < 22) {
    alert('Ingresa un Sueldo Asegurado válido y al menos 22 años cotizados.');
    return;
  }

  const anosKey = Math.min(Math.max(anos, 22), 35);
  const pct = tablaOfc57[anosKey] || 100;
  const pension = sbm * (pct / 100);
  const anual = pension * 14;

  const resultPanel = document.getElementById('resultPre');
  resultPanel.classList.add('show');
  
  document.getElementById('preMonto').textContent = `L. ${fmt(pension)}`;
  document.getElementById('preBreakdown').innerHTML = `
    <div class="example-block" style="margin-top:12px">
      <div class="ex-title">📐 Desglose del Cálculo</div>
      <div class="ex-row"><span class="ex-label">Sueldo Asegurado</span><span class="ex-value">L. ${fmt(sbm)}</span></div>
      <div class="ex-row"><span class="ex-label">Años cotizados</span><span class="ex-value">${anos} años (${pct}% base)</span></div>
      <div class="ex-row"><span class="ex-label">Pensión mensual</span><span class="ex-value">L. ${fmt(pension)}</span></div>
      <div class="ex-total">Total Anual (14 pagos): L. ${fmt(anual)}</div>
    </div>
  `;
}

// Helper: Format numbers with comma separation
function fmt(n) {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ----------------------------------------------------------------
// GLOBAL SEARCH SYSTEM (Searches Text inside Active Modules)
// ----------------------------------------------------------------
const searchInput = document.getElementById('globalSearch');
const searchOverlay = document.getElementById('searchOverlay');
const searchResults = document.getElementById('searchResults');

if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('focus', () => { if (searchInput.value.trim()) showResults(); });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap') && !e.target.closest('.search-results')) {
      searchOverlay.classList.add('hidden');
    }
  });

  // Global shortcut Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

function handleSearch() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchOverlay.classList.add('hidden'); return; }

  // Search matches within index contents
  const searchableSections = [
    { id: 'fundamentos', title: 'Fundamentos del IPM', text: 'misión visión RRE Fuerzas Armadas Policía Bomberos DNII Penitenciaría inscripción expediente pólizas CNBS' },
    { id: 'nuevos', title: 'Nuevos Afiliados — Retiro (Art. 33)', text: 'nuevos afiliados pensión retiro edad mínima 58 50 SBM suspensión anticipado mancomunada' },
    { id: 'nuevos', title: 'Nuevos Afiliados — Discapacidad (Art. 35)', text: 'discapacidad total permanente alto riesgo servicio 90% 80% auxilio pago único conyuge viuda' },
    { id: 'nuevos', title: 'Nuevos Afiliados — Sobrevivencia (Art. 37-38)', text: 'sobrevivencia auxilio pensión viudo hijos ascendientes padres 40% 15% 50% 25 años aportacion' },
    { id: 'nuevos', title: 'Nuevos Afiliados — Reserva Laboral (CIRL)', text: 'reserva laboral cirl prima antigüedad cesantía despido injustificado 7% patrono' },
    { id: 'preexistentes', title: 'Pre-existentes — Retiro y Discapacidad', text: 'preexistentes separación 9% actos servicio 100% 90% 85% 80% oficiales suboficiales auxiliares' },
    { id: 'preexistentes', title: 'Pre-existentes — Suma Asegurada y Montepío', text: 'suma asegurada supervivencia montepío viuda viudo hijos menor 21 24 80% 90%' },
    { id: 'injupemp', title: 'Acogidos a la Ley de INJUPEMP', text: 'injupemp artículo 36 37 72-d muerte servicio activo natural accidental 120 mensualidades' },
    { id: 'funerarios', title: 'Gastos Funerarios y Proveedoras (FUSAMI)', text: 'gastos funerarios sepelio reembolso oficiales suboficiales tropa auxiliares fusami amor eterno' }
  ];

  const matches = searchableSections.filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.text.toLowerCase().includes(q)
  );

  renderResults(matches, q);
  showResults();
}

function showResults() { searchOverlay.classList.remove('hidden'); }

function renderResults(matches, q) {
  if (matches.length === 0) {
    searchResults.innerHTML = `<div class="search-no-results">🔍 Sin resultados para "<strong>${q}</strong>"</div>`;
    return;
  }

  searchResults.innerHTML = matches.map(s => {
    const excerpt = s.text.split(' ').slice(0, 10).join(' ');
    const highlighted = excerpt.replace(new RegExp(`(${escapeReg(q)})`, 'gi'), '<mark>$1</mark>');
    const titleHighlighted = s.title.replace(new RegExp(`(${escapeReg(q)})`, 'gi'), '<mark>$1</mark>');
    return `
      <div class="search-result-item" onclick="navigateToSection('${s.id}')">
        <div class="sri-tag">Ley del IPM</div>
        <div class="sri-title">⚖️ ${titleHighlighted}</div>
        <div class="sri-excerpt">${highlighted}…</div>
      </div>
    `;
  }).join('');
}

function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function navigateToSection(subId) {
  searchOverlay.classList.add('hidden');
  searchInput.value = '';

  // Trigger click on target subtab
  const targetSubTab = document.querySelector(`.sub-tab[data-sub="${subId}"]`);
  if (targetSubTab) {
    targetSubTab.click();
  }
}
