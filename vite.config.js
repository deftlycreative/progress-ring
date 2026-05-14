import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";

// This config is used by `npm run build` and `npm run dev:vue` / `npm run dev:react`.
// Tests use vitest.config.js, which Vitest prefers over this file.
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag === "progress-ring",
                },
            },
        }),
        react(),
    ],
    build: {
        lib: {
            entry: "src/progress-ring.js",
            name: "ProgressRing",
            // Produces dist/progress-ring.js (ESM) and dist/progress-ring.umd.js (UMD)
            fileName: (format) => `progress-ring${format === "umd" ? ".umd" : ""}.js`,
            formats: ["es", "umd"],
        },
        sourcemap: true,
        // No external deps — the web component is entirely self-contained
    },
});
