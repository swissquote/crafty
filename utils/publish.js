#!/usr/bin/env node

// Sets the version on all packages in the workspace including the root package
// supported options
// --pre-release              will not do any git operation (commit, tag, push)
// --new-version <newVersion> sets the new version number
// This package borrows from https://www.npmjs.com/package/oao
// all credit goes to its maintainer for the logic and how it works

const prompts = require("prompts");
const semver = require("semver");
const chalk = require("chalk");
const path = require("path");
const globby = require("globby");
const fs = require("fs");
const execa = require("execa");

async function promptNextVersion(prevVersion) {
  const major = semver.inc(prevVersion, "major");
  const minor = semver.inc(prevVersion, "minor");
  const patch = semver.inc(prevVersion, "patch");
  const prerelease = semver.inc(prevVersion, "prerelease");
  const rc = prevVersion.indexOf("rc") < 0 ? `${major}-rc.0` : prerelease;
  const beta = prevVersion.indexOf("beta") < 0 ? `${major}-beta.0` : prerelease;
  const alpha =
    prevVersion.indexOf("alpha") < 0 ? `${major}-alpha.0` : prerelease;
  const { nextVersion } = await prompts([
    {
      name: "nextVersion",
      type: "select",
      message: `Current version is ${chalk.cyan.bold(prevVersion)}. Next one?`,
      choices: [
        { name: `Major (${chalk.cyan.bold(major)})`, value: major },
        { name: `Minor (${chalk.cyan.bold(minor)})`, value: minor },
        { name: `Patch (${chalk.cyan.bold(patch)})`, value: patch },
        { name: `Release candidate (${chalk.cyan.bold(rc)})`, value: rc },
        { name: `Beta (${chalk.cyan.bold(beta)})`, value: beta },
        { name: `Alpha (${chalk.cyan.bold(alpha)})`, value: alpha },
      ],
      defaultValue: 2,
    },
  ]);
  return nextVersion;
}

async function confirmPublish({ pkgList, numPublic, nextVersion }) {
  const { confirmPublish: out } = await prompts([
    {
      name: "confirmPublish",
      type: "confirm",
      message: `Confirm release (${chalk.yellow.bold(
        pkgList.length
      )} package/s, ${chalk.yellow.bold(numPublic)} public, v${chalk.cyan.bold(
        nextVersion
      )})?`,
      default: false,
    },
  ]);
  return out;
}

function bumpDeps(allSpecs, specs, version) {
  const dep_types = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ];

  const pkgList = Object.keys(allSpecs);

  for (const type of dep_types) {
    if (!specs.hasOwnProperty(type)) {
      continue;
    }

    for (const pkgDep of pkgList) {
      if (specs[type].hasOwnProperty(pkgDep)) {
        specs[type][pkgDep] = version;
      }
    }
  }
}

async function setVersion(allSpecs, rootPackage, newVersion, skipConfirm) {
  // Get list of packages to be updated. This is NOT the list of packages to
  // be published, since some of them might be private. But all of them will
  // be version-bumped
  const pkgList = [];
  let numPublic = 0;
  Object.keys(allSpecs).forEach((pkgName) => {
    if (allSpecs[pkgName].specs.workspaces) return;
    pkgList.push(pkgName);
    if (!allSpecs[pkgName].specs.private) numPublic += 1;
  });
  if (!pkgList.length) {
    console.error("No packages found!");
    process.exit(1);
  }

  // Determine a suitable new version number
  const rootVersion = rootPackage.version;
  const nextVersion = newVersion || (await promptNextVersion(rootVersion));

  if (!nextVersion) {
    console.error("No valid version was chosen");
    process.exit(1);
  }

  // Confirm before proceeding
  if (
    !skipConfirm &&
    !(await confirmPublish({ pkgList, numPublic, nextVersion }))
  ) {
    process.exit(1);
  }

  // Update package.json's for pkgList packages AND THE ROOT PACKAGE
  for (const pkgName of Object.keys(allSpecs)) {
    const { specPath, specs } = allSpecs[pkgName];
    specs.version = nextVersion;

    // Bump dependent requirements
    bumpDeps(allSpecs, specs, nextVersion);

    fs.writeFileSync(specPath, `${JSON.stringify(specs, null, 2)}\n`, "utf8");
  }

  return nextVersion;
}

async function exec(cmd, args, options = {}) {
  console.log(`Run cmd ${chalk.green.bold(`${cmd} ${args.join(" ")}`)}`);

  await execa(cmd, args, { stdio: "inherit", ...options });
}

async function gitCommitChanges(files, msg) {
  await exec("git", ["add"].concat(files));
  await exec("git", ["commit", "-m", msg].concat(files));
}

async function gitAddTag(tag) {
  await exec("git", ["tag", tag]);
}

async function gitPushWithTags() {
  await exec("git", ["push", "--quiet"]);
  await exec("git", ["push", "--tags", "--quiet"]);
}

async function commit(files, nextVersion) {
  // Commit, tag and push
  await gitCommitChanges(files, `v${nextVersion}`);
  await gitAddTag(`v${nextVersion}`);
  await gitPushWithTags();
}

function readPackageSpecs(paths) {
  return paths.reduce((acc, specPath) => {
    const pkg = {};
    pkg.pkgPath = path.join(process.cwd(), path.dirname(specPath));
    try {
      pkg.specPath = specPath;
      pkg.specs = JSON.parse(fs.readFileSync(pkg.specPath, "utf8"));
    } catch (err) {
      console.error(`Could not read package.json at ${pkg.specPath}`);
      throw err;
    }
    pkg.name = pkg.specs.name;

    acc[pkg.name] = pkg;

    return acc;
  }, {});
}

function readNewVersion(newVersion) {
  if (!newVersion) {
    return;
  }

  if (Array.isArray(newVersion)) {
    return newVersion[1];
  }

  return newVersion;
}

async function publish(allSpecs, preRelease) {
  for (const pkg of Object.values(allSpecs)) {
    if (pkg.specs.private) {
      continue;
    }

    console.log(chalk.bold(`Publishing ${chalk.blue(pkg.name)}`));
    await exec(
      "npm",
      preRelease ? ["publish", "--tag", "canary"] : ["publish"],
      { cwd: pkg.pkgPath }
    );
  }
}

(async function main() {
  // Read command line arguments
  const options = {
    boolean: ["pre-release"],
    string: ["new-version"],
  };
  const argv = require("yargs-parser")(process.argv.slice(2), options);

  // List workspace packages
  const rootPackagePath = "package.json";
  const rootPackage = require(path.join(process.cwd(), rootPackagePath));
  const originalVersion = rootPackage.version;

  const paths = await globby(
    rootPackage.workspaces.packages.map((p) => `${p}/package.json`)
  );

  paths.push(rootPackagePath);

  const allSpecs = readPackageSpecs(paths);
  const nextVersion = await setVersion(
    allSpecs,
    rootPackage,
    readNewVersion(argv.newVersion),
    false
  );

  if (!argv.preRelease) {
    const files = Object.values(allSpecs).map((spec) => spec.specPath);

    // Refresh lockfile after version changes
    await exec("yarn", ["install"]);
    files.push("yarn.lock");

    await commit(files, nextVersion);
  }

  await publish(allSpecs, argv.preRelease);

  if (argv.preRelease) {
    // Restore previous version
    await setVersion(allSpecs, rootPackage, originalVersion, true);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
