import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["triadica"],
  },
  plugins: [glsl({})],
});
