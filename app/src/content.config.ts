import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// raíz_ — content collections (Astro 6 API con loaders).
//
// Las lecciones se generan con scripts/synthesizer.mjs y caen en:
//   /home/jojan/proyectos/ciberapp/content/<modulo>/<leccion-id>.md
//
// Los módulos se cargan del grafo.json directamente (no son collection).

const lecciones = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: '../content',
  }),
  schema: z.object({
    id: z.string(),
    modulo: z.string(),
    titulo: z.string(),
    crumb: z.string(),
    numero: z.number(),
    depende_de: z.array(z.string()),
    introduce: z.array(z.string()).default([]),
    libros_fuente: z.array(z.string()).default([]),
    lab: z.object({
      tipo: z.enum(['toggle', 'terminal_sim', 'cipher_xor', 'subnetting', 'packet_visualizer', 'none']).default('none'),
      descripcion: z.string().optional(),
      texto_plano: z.string().optional(),
      clave: z.string().optional(),
      cifrado: z.string().optional(),
    }).default({ tipo: 'none' }),
    quiz: z.array(z.object({
      pregunta: z.string(),
      opciones: z.array(z.string()),
      correcta: z.number(),
      explicacion: z.string(),
    })).default([]),
    flashcards: z.array(z.object({
      anverso: z.string(),
      reverso: z.string(),
    })).default([]),
    generado_en: z.string(),
    status: z.enum(['borrador', 'revisado', 'publicado']).default('borrador'),
  }),
});

export const collections = { lecciones };
