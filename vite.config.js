import { defineConfig } from "vite";

export default defineConfig({
  base: "/FED_S10258960_Raymond_Assg1_website",
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        products: "./products.html",
        configure: "./configure.html",
        cart: "./cart.html",
      },
    },
  },
});
