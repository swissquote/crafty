import fs from "node:fs/promises";

async function loadFile(searchPath) {

  const isJson = searchPath.endsWith(".json");

  if (isJson) {
    const file = await fs.readFile(searchPath, "utf8");
    return JSON.parse(file);
  }

  const imported = await import(searchPath);
  if (imported && imported.default) {
    return imported.default;
  }

  return imported;
}

export function cosmiconfig(name, options) {
  return {
    async load(searchPath) {
      const config = await loadFile(searchPath);

      return options.transform({ config });
    },
    search() {
      return null;
    },
  };
}
