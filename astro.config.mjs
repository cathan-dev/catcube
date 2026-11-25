// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://catcube.app',
    server: { port: 4343 },
    vite: { server: { strictPort: true } },
});