// preview-lecciones.mjs v2 — Dry run mejorado.
// CAMBIO: identifica capítulos reales (## N Title o ## N.M) y agrupa sub-secciones.
// Genera 1 lección por CAPÍTULO real, no por cada sub-header.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/jojan/AppsWebs/ciberapp';
const LIBROS_MD = join(ROOT, 'libros-md');
const GRAFO = JSON.parse(readFileSync(join(ROOT, 'meta/grafo.json'), 'utf-8'));
const MAX_CHARS = 120_000;
const MIN_CHARS_CAPITULO = 5_000;   // caps muy chicos se descartan o combinan

// Detecta capítulos reales: "## 4 Processor Architecture", "## 1.1 What Is the Internet"
// Retorna [{ num: "1.1", titulo: "What Is the Internet", level: 2, contenido }]
function parseCapitulos(md) {
  const lineas = md.split('\n');
  const capitulos = [];
  let actual = null;
  let buf = [];

  // Regex para capítulo numerado:
  //   "## 4 Processor Architecture"           → {num:"4", titulo:"Processor Architecture"}
  //   "## 1.1 What Is the Internet?"          → {num:"1.1", titulo:"What Is the Internet?"}
  //   "## 1.1.1 A Nuts-and-Bolts Description" → {num:"1.1.1", titulo:...}
  // NO match: autores, índice, números solos, "Contents", etc.
  const reCap = /^## (?:(\d+(?:\.\d+)*)\s+)?([^\n]+)$/;

  const flush = () => {
    if (actual && buf.length) {
      const contenido = buf.join('\n').trim();
      if (contenido.length >= MIN_CHARS_CAPITULO || actual.level === 1) {
        capitulos.push({ ...actual, contenido });
      }
    }
    buf = [];
  };

  for (const linea of lineas) {
    const m = linea.match(reCap);
    if (m) {
      const num = m[1] || null;
      const titulo = m[2].trim();

      // filtrar basura que docling confunde con headings
      if (/^\d+$/.test(titulo)) { buf.push(linea); continue; }      // "## 387"
      if (titulo.length < 8)     { buf.push(linea); continue; }     // muy corto
      if (/^(Contents|Table of Contents|Brief Contents|Index|Copyright|Foreword|Acknowledg|About (the )?(Author|Tech|Publisher)|Dedication|Figure Credits|Colophon|Abbreviat)/i.test(titulo)) {
        buf.push(linea); continue;
      }
      // filtrar autores típicos (palabras con inicial mayúscula y middle)
      if (/^[A-Z][a-z]+\s+[A-Z]\.\s+[A-Z][a-z]+/.test(titulo)) { buf.push(linea); continue; }
      // filtrar cosas que son solo números romanos
      if (/^[MDCLXVI]+$/.test(titulo)) { buf.push(linea); continue; }
      // filtrar títulos duplicados del título del libro
      if (capitulos.length === 0 && titulo.length > 30 && buf.length < 5) { buf.push(linea); continue; }

      flush();
      const level = num ? num.split('.').length : 1;
      actual = { num, titulo, level, key: num || titulo.slice(0,40) };
      buf.push(linea);
    } else if (actual) {
      buf.push(linea);
    }
  }
  flush();

  // agrupar sub-secciones (level 2+) bajo su capítulo raíz (level 1)
  const porCapituloRaiz = new Map();
  for (const c of capitulos) {
    const raiz = c.num ? c.num.split('.')[0] : c.titulo.slice(0,40);
    if (!porCapituloRaiz.has(raiz)) {
      porCapituloRaiz.set(raiz, {
        num: c.num,
        titulo: c.titulo,
        level: c.level,
        contenido: '',
        subSecciones: [],
      });
    }
    const entry = porCapituloRaiz.get(raiz);
    if (c.num === raiz || c.level === 1) {
      // es el capítulo raíz, sobreescribir metadata
      entry.titulo = c.titulo;
      entry.contenido = (entry.contenido + '\n\n' + c.contenido).trim();
    } else {
      entry.contenido = (entry.contenido + '\n\n' + c.contenido).trim();
      entry.subSecciones.push(c.num + ' ' + c.titulo);
    }
  }

  return Array.from(porCapituloRaiz.values());
}

function subdividir(cap, max = MAX_CHARS) {
  if (cap.contenido.length <= max) return [cap];
  // split por ###
  const sub = [];
  const lineas = cap.contenido.split('\n');
  let buf = [];
  let tituloActual = cap.titulo;
  let parte = 1;
  for (const l of lineas) {
    buf.push(l);
    if (l.match(/^### /) && buf.join('\n').length > max * 0.6) {
      sub.push({ num: `${cap.num}.${parte}`, titulo: tituloActual, contenido: buf.join('\n') });
      parte++;
      tituloActual = cap.titulo + ' (cont.)';
      buf = [];
    }
  }
  if (buf.length) sub.push({ num: `${cap.num}.${parte}`, titulo: tituloActual, contenido: buf.join('\n') });
  // force brute si sigue siendo grande
  const out = [];
  for (const s of sub) {
    if (s.contenido.length <= max) out.push(s);
    else {
      for (let i = 0; i < s.contenido.length; i += max) {
        out.push({
          num: `${s.num}.${Math.floor(i/max)+1}`,
          titulo: `${s.titulo} (parte ${Math.floor(i/max)+1})`,
          contenido: s.contenido.slice(i, i+max),
        });
      }
    }
  }
  return out;
}

function capsRelevantes(libroRef, todos) {
  const [, capFilter] = libroRef.split(':');
  if (capFilter) {
    const f = capFilter.toLowerCase().replace(/^cap/, '').trim();
    return todos.filter(c => c.num === f || (c.num && c.num.startsWith(f + '.')));
  }
  return todos;
}

console.log('════════════════════════════════════════════════════════════════');
console.log('  PREVIEW v2 — Lecciones por CAPÍTULO REAL (no por sub-sección)');
console.log('════════════════════════════════════════════════════════════════\n');

const stats = { modulos: 0, conMaterial: 0, leccionesTotal: 0, charsTotal: 0 };

for (const [modId, mod] of Object.entries(GRAFO.modules)) {
  stats.modulos++;
  const libros = mod.libros || [];

  if (libros.length === 0) {
    console.log(`📦 ${modId} · ${mod.title} — ⚠️ sin libros (knowledge-pack)\n`);
    continue;
  }

  let chunks = [];
  let librosListos = 0;
  const status = [];

  for (const ref of libros) {
    const [slug] = ref.split(':');
    const path = join(LIBROS_MD, `${slug}.md`);
    if (!existsSync(path)) {
      status.push(`  ❌ ${slug} (no procesado)`);
      continue;
    }
    librosListos++;
    status.push(`  ✅ ${slug}`);
    const md = readFileSync(path, 'utf-8');
    const todos = parseCapitulos(md);
    const relevantes = capsRelevantes(ref, todos);
    for (const c of relevantes) {
      for (const sub of subdividir(c)) chunks.push({ slug, ...sub });
    }
  }

  if (chunks.length === 0) {
    console.log(`📦 ${modId} · ${mod.title}`);
    console.log(`   ⏳ docling pendiente\n`);
    continue;
  }

  stats.conMaterial++;
  stats.leccionesTotal += chunks.length;
  const charsTotal = chunks.reduce((a,c)=>a+c.contenido.length, 0);
  stats.charsTotal += charsTotal;

  console.log(`📦 ${modId} · ${mod.title}`);
  console.log(`   📚 ${librosListos}/${libros.length} libros · 📄 ${chunks.length} lecciones · 🔤 ${Math.round(charsTotal/1000)}k chars`);
  status.forEach(l => console.log(l));
  // mostrar títulos de capítulos generados (muestra)
  console.log(`   📋 Títulos (muestra):`);
  chunks.slice(0, 8).forEach(c => {
    console.log(`      ${c.num || '?'} · ${c.titulo.slice(0,70)}`);
  });
  if (chunks.length > 8) console.log(`      ... y ${chunks.length - 8} más`);
  console.log('');
}

console.log('════════════════════════════════════════════════════════════════');
console.log('  RESUMEN');
console.log('════════════════════════════════════════════════════════════════');
console.log(`Módulos totales:                 ${stats.modulos}`);
console.log(`Módulos con material disponible: ${stats.conMaterial}`);
console.log(`Lecciones totales a generar:    ${stats.leccionesTotal}`);
console.log(`Volumen total de texto:         ${(stats.charsTotal/1_000_000).toFixed(2)}M chars`);
