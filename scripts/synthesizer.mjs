// synthesizer.mjs v3 — Usa opencode CLI (zai-coding-plan/glm-5.2)
// + Outline pass para identificar capítulos reales (no basura de docling).
//
// Estrategia:
//   Pass 1 (outline): 1 llamada por libro → LLM identifica capítulos reales del índice
//   Pass 2 (extracción): por cada cap del outline, busca su contenido en el .md
//   Pass 3 (síntesis): 1 llamada por cap → 1 lección markdown
//
// Uso:
//   node synthesizer.mjs --modulo M0
//
// Nota: alterna providers si hay varios configurados. Por ahora solo GLM-5.2.

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = '/home/jojan/AppsWebs/ciberapp';
const LIBROS_MD = join(ROOT, 'libros-md');
const CONTENT_OUT = join(ROOT, 'content');
const GRAFO = JSON.parse(readFileSync(join(ROOT, 'meta/grafo.json'), 'utf-8'));

const MODEL = 'zai-coding-plan/glm-5.2';
const MAX_CHARS_SYNTH = 25_000; // bajo para evitar timeouts de GLM-5.2

// === Wrapper del CLI opencode ===
// Sanitiza strings para eliminar chars de control (null bytes, etc.) que vienen del PDF.
function sanitize(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // chars de control excepto \t \n \r
    .replace(/\u0000/g, '')                              // null bytes explícito
    .trim();
}

function callLLM(prompt, systemPrompt = null) {
  // Combinar system + user en un solo mensaje (opencode CLI acepta 1 positional).
  const fullPrompt = systemPrompt
    ? `### SYSTEM\n${systemPrompt}\n\n### USER\n${prompt}`
    : prompt;

  const safePrompt = sanitize(fullPrompt);
  if (safePrompt.length < 10) {
    throw new Error('prompt vacío tras sanitize');
  }
  // Linux max arg ~128k. Si el prompt es más grande, truncar (preservando el system + user inicial).
  const MAX_ARG = 120_000;
  const finalPrompt = safePrompt.length > MAX_ARG
    ? safePrompt.slice(0, MAX_ARG) + '\n\n[...material truncado por tamaño...]'
    : safePrompt;

  // opencode run --format json -m MODEL "prompt completo sanitizado"
  const args = [
    'run', '--format', 'json', '-m', MODEL,
    '--pure',
    finalPrompt,
  ];

  const t0 = Date.now();
  const result = spawnSync('opencode', args, {
    encoding: 'utf-8',
    timeout: 200_000, // 3.3 min máximo por llamada (más corto = falla rápido en vez de colgar 5 min)
    maxBuffer: 100 * 1024 * 1024,
    env: {
      ...process.env,
      // Solo XDG_CONFIG_HOME aislado: opencode.json sin MCPs (Engram desactivado).
      // NO tocar XDG_DATA_HOME porque ahí mise cachea node y rompe si lo mudamos.
      // auth.json se lee del XDG_DATA_HOME original (auth opencode-go/zai heredada).
      XDG_CONFIG_HOME: '/tmp/opencode-synth/.config',
    },
  });

  if (result.signal === 'SIGTERM') {
    throw new Error(`timeout (3.3min) — prompt era ${finalPrompt.length} chars`);
  }
  if (result.status !== 0) {
    throw new Error(`opencode CLI failed (status=${result.status}): ${(result.stderr || '').slice(0,400)}`);
  }

  // Parsear JSON lines, tomar el text del último evento type:text
  const lines = result.stdout.split('\n').filter(Boolean);
  let textContent = '';
  let tokens = null;
  for (const line of lines) {
    try {
      const ev = JSON.parse(line);
      if (ev.type === 'text' && ev.part?.text) {
        textContent += ev.part.text;
      }
      if (ev.type === 'step_finish' && ev.part?.tokens) {
        tokens = ev.part.tokens;
      }
    } catch {}
  }

  return { content: textContent, tokens, ms: Date.now() - t0 };
}

// === Outline pass ===
// Dado un .md, extrae el índice y pide al LLM que liste los capítulos REALES.
async function outlineLibro(slug) {
  const path = join(LIBROS_MD, `${slug}.md`);
  if (!existsSync(path)) return null;
  const md = readFileSync(path, 'utf-8');

  // Extraer el índice: primeros 30k chars suelen contener "Contents" o "Brief Contents"
  const idx = md.slice(0, 30_000);

  const prompt = `Analizá este índice de libro técnico (markdown extraído con docling, puede tener ruido):

\`\`\`
${idx}
\`\`\`

Tu tarea: identificar los CAPÍTULOS REALES del libro (no sub-secciones, no autores, no índice, no apéndices).

Reglas:
- Un capítulo real tiene título descriptivo de tema (ej: "Processor Architecture", "Introduction", "Binary Exploitation").
- Ignorá: "About the Author", "Contents", "Index", "Foreword", "Copyright", nombres de autores, dedicatorias.
- Si el libro usa "Chapter N" o numeración (1, 2, 3), usá ese número.
- Si no, asigná números 1, 2, 3 en orden.

OUTPUT (JSON válido, sin markdown alrededor):
{"capitulos": [{"num": "1", "titulo": "título exacto del cap"}, ...]}

No agregues explicación, solo el JSON.`;

  console.log(`  [outline] llamando a LLM para ${slug}...`);
  const { content, tokens, ms } = callLLM(prompt);

  // extraer JSON (el modelo puede envolverlo en ```json)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn(`  [outline] no se pudo parsear JSON de ${slug}. Output: ${content.slice(0,200)}`);
    return null;
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    console.log(`  [outline] ${slug}: ${parsed.capitulos?.length || 0} caps identificados (${tokens?.total || '?'} tok, ${ms}ms)`);
    return parsed.capitulos || [];
  } catch (e) {
    console.warn(`  [outline] JSON inválido de ${slug}: ${e.message}`);
    return null;
  }
}

// === Extracción de contenido de un capítulo ===
// Busca en el .md el capítulo y devuelve su contenido (todo hasta el siguiente cap real).
function extraerContenidoCap(md, cap) {
  // Buscar headings que matcheen el cap por número o título
  const lineas = md.split('\n');
  let inicio = -1, fin = lineas.length;

  const tituloClean = cap.titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // patrones a buscar
  const patrones = [
    new RegExp(`^##\\s+${cap.num}\\s+${tituloClean}`, 'i'),
    new RegExp(`^##\\s+${cap.num}[\\s\\.]+${tituloClean}`, 'i'),
    new RegExp(`^##\\s+${cap.num}\\b`, 'i'),
    new RegExp(`^##\\s+${tituloClean}`, 'i'),
    new RegExp(`^#\\s+${cap.num}\\s+${tituloClean}`, 'i'),
    new RegExp(`^Chapter\\s+${cap.num}`, 'i'),
  ];

  for (let i = 0; i < lineas.length; i++) {
    if (inicio < 0) {
      if (patrones.some(re => re.test(lineas[i]))) {
        inicio = i;
      }
    } else {
      // buscar siguiente capítulo (heading ## con número)
      if (/^##\s+(\d+)\s+/i.test(lineas[i]) || /^##\s+Chapter\s/i.test(lineas[i])) {
        fin = i;
        break;
      }
    }
  }

  if (inicio < 0) {
    // fallback: buscar por título fuzzy
    const tituloLower = cap.titulo.toLowerCase().slice(0, 30);
    for (let i = 0; i < lineas.length; i++) {
      if (lineas[i].toLowerCase().includes(tituloLower)) {
        inicio = i;
        break;
      }
    }
  }

  if (inicio < 0) return null;

  return lineas.slice(inicio, fin).join('\n').slice(0, MAX_CHARS_SYNTH);
}

// === Síntesis de lección ===
async function sintetizarLeccion(mod, cap, slug, contenido, depsDefinidos, numLeccion) {
  const systemPrompt = `Sos un educador de ciberseguridad que escribe lecciones en español neutro (tuteo, no voseo) para la plataforma "raíz_".

REGLAS DE ESTILO:
- Empieza con frase CORTA y CONTUNDENTE (cold).
- Párrafos cortos (3-5 frases). Lenguaje DIRECTO.
- Términos nuevos marcados como <a class="term" href="/glosario#TERMINO">término</a>.
- Analogías concretas cuando aclaren.
- NO inventes URLs.
- Output: markdown plano SIN frontmatter. Empieza con "# TÍTULO".

REGLA "NO ASUMIR":
- Si un término aparece pero NO fue definido upstream, definilo en esta lección.`;

  const prompt = `# TAREA
Escribí la Lección ${String(numLeccion).padStart(2,'0')} del módulo ${mod.id} (${mod.title}) para raíz_.

## Contexto
- Meta del módulo: ${mod.meta}
- Conceptos del módulo: ${(mod.introduces || []).join(', ')}.
- Ya definidos upstream (no redefinas): ${(depsDefinidos || mod.depends_on || []).join(', ') || 'nada'}.

## Material fuente — "${cap.titulo}" (${slug})

\`\`\`
${contenido}
\`\`\`

## Tu trabajo
Convertí ESTE capítulo en 1 lección coherente.

La lección debe:
1. Título H1 claro.
2. Frase contundente inicial.
3. Introducir 2-4 conceptos nuevos máximo.
4. Nota final conectando con la siguiente lección.
5. ~600-1500 palabras.
6. MANTENER TODO el conocimiento del capítulo fuente.

OUTPUT: markdown de la lección, empezando con "# Título".`;

  const { content, tokens, ms } = callLLM(prompt, systemPrompt);
  return { content, tokens, ms };
}

// === Orquestador ===
async function sintetizarModulo(modId) {
  console.log(`\n════ Sintetizando módulo ${modId} ════`);
  const mod = GRAFO.modules[modId];
  if (!mod) throw new Error(`Módulo no encontrado: ${modId}`);

  const depsDefinidos = [];
  for (const dep of (mod.depends_on || [])) {
    const depMod = GRAFO.modules[dep];
    if (depMod) depsDefinidos.push(...(depMod.introduces || []));
  }

  const outDir = join(CONTENT_OUT, modId);
  mkdirSync(outDir, { recursive: true });

  let n = 1;
  for (const libroRef of (mod.libros || [])) {
    const [slug, capFilter] = libroRef.split(':');
    const path = join(LIBROS_MD, `${slug}.md`);
    if (!existsSync(path)) {
      console.warn(`  ⚠️  ${slug}.md no existe todavía (docling pendiente)`);
      continue;
    }

    // PASS 1: outline
    let caps = await outlineLibro(slug);
    if (!caps || caps.length === 0) {
      console.warn(`  ⚠️  outline de ${slug} falló, salteando libro`);
      continue;
    }

    // Aplicar filtro :capN si viene en el libroRef (ej: "CSAPP-3e:cap2" → solo cap 2)
    if (capFilter) {
      const fNum = capFilter.toLowerCase().replace(/^cap/, '').trim();
      caps = caps.filter(c => c.num === fNum);
      console.log(`  📖 ${slug}: filtro "${capFilter}" → ${caps.length} caps a procesar`);
    } else {
      console.log(`  📖 ${slug}: ${caps.length} caps a procesar (sin filtro)`);
    }

    if (caps.length === 0) continue;

    const md = readFileSync(path, 'utf-8');

    // PASS 2+3: por cada cap, extraer y sintetizar
    for (const cap of caps) {
      const leccionId = `${modId}-L${String(n).padStart(2,'0')}`;
      const outPath = join(outDir, `${leccionId}.md`);

      if (existsSync(outPath)) {
        console.log(`  ✓ ${leccionId} ya existe, salteando`);
        n++;
        continue;
      }

      const contenido = extraerContenidoCap(md, cap);
      if (!contenido || contenido.length < 1000) {
        console.warn(`  ⚠️  ${leccionId} cap "${cap.titulo}" no encontrado o muy corto, salteando`);
        continue;
      }

      console.log(`  → ${leccionId} "${cap.titulo}" (${contenido.length} chars)...`);
      try {
        const { content, tokens, ms } = await sintetizarLeccion(mod, cap, slug, contenido, depsDefinidos, n);
        const tituloExtraido = (content.match(/^#\s+(.+)$/m)?.[1] || leccionId).replace(/"/g, '\\"');

        const frontmatter = `---
id: "${leccionId}"
modulo: "${modId}"
titulo: "${tituloExtraido}"
crumb: "MÓDULO ${modId.replace(/^M/, '')} · ${mod.title.toUpperCase()} · LECCIÓN ${String(n).padStart(2, '0')}"
numero: ${n}
depende_de: ${JSON.stringify(mod.depends_on || [])}
introduce: []
libros_fuente: ${JSON.stringify([slug])}
capitulo_fuente: "${(cap.num + ' ' + cap.titulo).replace(/"/g, '\\"')}"
generado_por: "glm-5.2@zai-coding-plan"
generado_en: "${new Date().toISOString()}"
status: "borrador"
---

`;
        writeFileSync(outPath, frontmatter + content + '\n');
        console.log(`    ✓ ${leccionId} OK (${tokens?.total || '?'} tok, ${ms}ms)`);
      } catch (e) {
        console.error(`    ❌ ${leccionId} FAILED: ${e.message}`);
      }
      n++;
    }
  }
  console.log(`\n  → Generadas ${n - 1} lecciones para ${modId}`);
}

// CLI
const args = process.argv.slice(2);
let modId = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--modulo') modId = args[++i];
}
if (!modId) {
  console.error('Uso: node synthesizer.mjs --modulo M0');
  console.error('Módulos:', Object.keys(GRAFO.modules).join(', '));
  process.exit(1);
}
sintetizarModulo(modId).catch(e => { console.error('Fatal:', e); process.exit(1); });
