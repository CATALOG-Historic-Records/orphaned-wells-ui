/// <reference types="vitest/config" />
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const reactAppEnv: Record<string, string> = {
    NODE_ENV: mode,
    PUBLIC_URL: env.PUBLIC_URL ?? "",
  };
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("REACT_APP_")) {
      reactAppEnv[key] = value;
    }
  }

  return {
    plugins: [react()],
    define:
      mode === "test"
        ? undefined
        : {
            "process.env": JSON.stringify(reactAppEnv),
          },
    resolve: {
      alias: {
        assets: path.resolve(__dirname, "src/assets"),
        components: path.resolve(__dirname, "src/components"),
        services: path.resolve(__dirname, "src/services"),
        styles: path.resolve(__dirname, "src/styles"),
        themes: path.resolve(__dirname, "src/themes"),
        views: path.resolve(__dirname, "src/views"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 3000,
      strictPort: true,
      allowedHosts: true,
    },
    build: {
      outDir: "build",
      sourcemap: process.env.GENERATE_SOURCEMAP !== "false",
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
    },
  };
});
