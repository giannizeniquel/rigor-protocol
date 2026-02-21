/** @type {import('tailwindcss').Config} */
import tokens from '../../packages/design-tokens/tailwind.config.js';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  presets: [tokens],
}
