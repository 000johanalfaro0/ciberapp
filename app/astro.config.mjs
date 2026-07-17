import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// raíz_ — config base
// Multi-tenant SaaS con Supabase + Stripe.
// Estática-first (cada lección = markdown), dinámica solo para auth/progreso.

export default defineConfig({
  site: 'https://raiz.app',
  adapter: node({ mode: 'standalone' }),
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
