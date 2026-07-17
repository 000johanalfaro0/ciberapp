# raíz_

> Ciberseguridad desde el cimiento absoluto. Carrera técnica de hacking ofensivo en español, desde cero.
> SaaS multi-tenant estilo "Duolingo Pro" con skill tree dirigido por grafo de dependencias.

## Estructura del proyecto

```
ciberapp/
├── meta/
│   └── grafo.json              # ⭐ columna vertebral: 21 módulos, ~222 lecciones
├── libros-md/                  # salida de docling (raw markdown de PDFs)
├── toc-scraped/                # TOCs públicos de libros pendientes
├── knowledge-packs/            # specs para módulos sin libro (M11, M14, M16, RUST)
├── content/                    # lecciones sintetizadas (output del synthesizer)
├── app/                        # ⭐ frontend Astro + Supabase + Stripe
│   ├── src/
│   │   ├── layouts/Base.astro  # estética raíz_ migrada del prototipo
│   │   ├── pages/
│   │   │   ├── index.astro     # landing con ASCII art
│   │   │   ├── grafo.astro     # skill tree visual M0→M17
│   │   │   ├── glosario.astro  # enciclopedia hiperconectada (autogen del grafo)
│   │   │   ├── m/[modulo].astro # página de módulo
│   │   │   └── l/[leccion].astro # página de lección con labs
│   │   └── content/config.ts   # schema de lecciones (frontmatter)
│   ├── astro.config.mjs
│   └── package.json
├── supabase/
│   └── schema.sql              # ⭐ multi-tenant con RLS, spaced repetition, Stripe
├── scripts/
│   ├── batch-docling.sh        # batch PDF→markdown sobre 16 libros
│   └── synthesizer.mjs         # ⭐ genera lecciones con DeepSeek V4 Flash
└── logs/
```

## Cómo se conecta todo

```
PDFs (16 íntegros)  ──docling──>  libros-md/  ─┐
TOCs nostarch (5)    ──webfetch──> toc-scraped/─┤
OWASP/MITRE/HackTricks ─────────── knowledge-  ─┤
                                   packs/       │
                                                 ▼
                                         synthesizer.mjs
                                          (DeepSeek V4 Flash,
                                           alterna Go/Zen)
                                                 │
                                                 ▼
                                          content/M0-L01.md
                                          content/M0-L02.md
                                          ...
                                                 │
                                                 ▼
                                          Astro app (cero JS)
                                          + Supabase (progreso)
                                          + Stripe (suscripción)
```

## Stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | Astro + vanilla JS | Respeta 100% la estética brutalista; cero overhead |
| Auth/DB | Supabase (Postgres + RLS) | Multi-tenant nativo, free tier, edge functions |
| Pagos | Stripe | Estándar, webhooks → Supabase |
| Pipeline contenido | docling + DeepSeek V4 Flash | docling convierte PDF; DeepSeek sintetiza lecciones |
| Modelos LLM | `opencode-go/deepseek-v4-flash` + `opencode-zen/deepseek-v4-flash` | Gratis / barato, zero-retention en Go |

## Setup

```sh
# 1. Frontend
cd /home/jojan/AppsWebs/ciberapp/app
npm install
npm run dev          # http://localhost:4321

# 2. Pipeline de contenido (batch docling — ~4 hs en CPU)
cd /home/jojan/AppsWebs/ciberapp
.venv/bin/docling --version   # verificar
bash scripts/batch-docling.sh # ya corre en background con nohup

# 3. Síntesis de lecciones (cuando docling terminó los PDFs del módulo)
export OPENCODE_GO_API_KEY=...
export OPENCODE_ZEN_API_KEY=...
node scripts/synthesizer.mjs --modulo M0

# 4. Base de datos
# Crear proyecto Supabase, ejecutar supabase/schema.sql en el SQL editor
```

## Cobertura actual

- **Grafo**: 21 módulos completos (M0-M17 + AI/LLM, Cloud, Malware, Rust)
- **Material**: 16 PDFs íntegros en proceso de conversión
- **Gaps**: 5 módulos se cubren con TOC + knowledge-packs (M11, M14, M16, AI-LLM, Cloud, Rust)
- **Skeleton app**: listo (landing, skill tree, módulo, lección, glosario)
- **DB schema**: listo (multi-tenant con RLS)
- **Lecciones sintetizadas**: 1 (M0-L01 "El bit" demo)

## Estado HOY (27 jun 2026)

- ✅ docling batch corriendo en background (~4 hs restantes)
- ✅ Skeleton Astro armado, estética `raíz_` migrada
- ✅ Grafo del currículo validado
- ✅ Schema Supabase multi-tenant
- ⏳ Pendiente: API keys de Go/Zen para correr synthesizer
- ⏳ Pendiente: Stripe integration, deploy a Vercel/Netlify

## Convención de nombres

- `M0`, `M1`, ..., `M17` — módulos numerados
- `M0-L01`, `M0-L02` — lecciones (L + 2 dígitos)
- `AI-LLM`, `CLOUD`, `MALWARE`, `RUST` — especializaciones (no numeradas)
- `slug-libro.md` en `libros-md/` — naming consistente con `grafo.json`
