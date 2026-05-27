import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ['./setup.js'],
    testTimeout: 60000,
    include: ["**/__tests__/**/*.js"],
    coverage: {
      reporter: ["text", "lcov", "html"],
      allowExternal: true,
      exclude: ["**/tmp-*", "**/fixtures/**", "**/dist/**"]
    }
  }
});
