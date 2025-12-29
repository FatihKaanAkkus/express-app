import path from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    typecheck: {
      enabled: true,
    },
    setupFiles: "./src/tests/setup.ts",
    include: ["src/**/*.test.ts"],
    exclude: [
      ...configDefaults.exclude,
      "dist",
      "prisma",
      "src/generated",
      "src/database",
    ],
    watch: false,
    coverage: {
      exclude: ["src/generated", "src/database"],
    },
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@prisma": path.resolve(__dirname, "./prisma"),
    },
  },
});
