import { defineConfig } from 'astro/config';

// raíz_ — config base
// Multi-tenant SaaS con Supabase + Stripe.
// Estática-first (cada lección = markdown), dinámica solo para auth/progreso.

export default defineConfig({
  site: 'https://raiz.app',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
