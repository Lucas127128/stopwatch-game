import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss({ optimize: true }),
    sveltekit({
      compilerOptions: {
        runes: true,
        experimental: { async: true },
      },
      adapter: adapter(),
      experimental: { remoteFunctions: true, forkPreloads: true },
    }),
  ],
});
