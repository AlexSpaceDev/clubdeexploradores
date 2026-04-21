// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: reemplazar con el dominio real cuando se contrate
  site: 'https://printcraft.ec',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});