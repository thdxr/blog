import { defineConfig } from "vite";
import solid from "solid-start";
import adapter from "solid-start-static";

export default defineConfig({
  plugins: [
    solid({
      adapter: adapter(),
    }),
  ],
});
