import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/native-setup.ts"]
  }
});