import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import globalPlugin from 'vite-plugin-global';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // globalPlugin({
    //   jQuery: "jquery",
    // }),
  ],
  define: {
    global: {},
  },
});
