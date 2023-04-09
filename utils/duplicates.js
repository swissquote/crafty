#!/usr/bin/env node
const path = require("path");
const glob = require("glob");

const { formatBytes, getModulePath, isModule } = require("./functions.js");

function findFiles() {
  return glob.sync('**/*-stats.json', { ignore: 'node_modules/**' });
}

function scanFiles(files) {
  const allModules = {};
  
  for (const file of files) {
    const loadFile = path.join(process.cwd(), file);
    const data = require(loadFile);
  
    const validModules = data.modules.filter(
      (m) => m.nameForCondition != null && isModule(m.name)
    );
  
    for (const m of validModules) {
      if (!allModules.hasOwnProperty(m.nameForCondition)) {
        allModules[m.nameForCondition] = {
          file: m.nameForCondition,
          size: m.size,
          totalSize: 0,
          occurences: [],
        };
      }
  
      allModules[m.nameForCondition].totalSize += m.size;
      allModules[m.nameForCondition].occurences.push(file);
    }
  }
  
  // Creates a list of all modules that have files duplicated across more than one module
  const duplicateModules = Object.values(allModules)
    .filter((m) => m.occurences.length > 1)
    .sort((a, b) => b.totalSize - a.totalSize);
  
  const allModulesByModule = {};
  
  // Group modules with any duplicates by module
  duplicateModules.forEach((m) => {
    const modulePath = getModulePath(m.file);
  
    if (!allModulesByModule.hasOwnProperty(modulePath)) {
      allModulesByModule[modulePath] = {
        module: modulePath,
        totalSize: 0,
        files: [],
      };
    }
  
    allModulesByModule[modulePath].totalSize += m.totalSize;
    allModulesByModule[modulePath].files.push(m);
  });
  
  const duplicateModulesByPackage = Object.values(allModulesByModule).sort(
    (a, b) => b.totalSize - a.totalSize
  );

  return {
    duplicateModules,
    duplicateModulesByPackage
  };
}

function printReport(duplicateModules,
  duplicateModulesByPackage) {
  const prefix = process.cwd() + "/";

  console.log("Duplicated files, per module\n============================\n");
  for (const m of duplicateModulesByPackage) {
    console.log(
      `${m.module} (${formatBytes(m.totalSize)}, ${m.files.length} files)`
    );
    const occurences = new Set();
    m.files.forEach((file) => {
      file.occurences.forEach((occurence) => {
        occurences.add(occurence);
      });
    });
  
    occurences.forEach((occurence) => {
      console.log("- ", occurence.replace("./packages/", ""));
    });
  
    console.log();
  }
  
  console.log();
  console.log("Duplicated files\n==========================\n");
  for (const m of duplicateModules) {
    console.log(m.file.replace(prefix, ""), "(", formatBytes(m.totalSize), ")");
    for (const occurence of m.occurences) {
      console.log("-", occurence.replace("./packages/", ""));
    }
    console.log();
  }
}

module.exports = {
  findFiles,
  scanFiles,
  printReport
}

const args = process.argv.slice(2);
if (args.length > 0) {
  const report = scanFiles(args);

  if (report.duplicateModules.length > 0) {
    console.error("Found duplicate packages");
    printReport(report.duplicateModules, report.duplicateModulesByPackage);

    process.exit(1);
  }
}
