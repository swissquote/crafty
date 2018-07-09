// @ts-check
const fs = require('fs');
const lockfile = require('@yarnpkg/lockfile');
const semver = require("semver");
const chalk = require("chalk");

const Repository = require("lerna/lib/Repository");
const PackageUtilities = require("lerna/lib/PackageUtilities");

function renderChain(currentChain) {
    //currentChain.reverse();
    console.log(currentChain.join(chalk.bold(" ← "))); // →
}

function findRequestChain(currentChain) {
    const requested = currentChain[currentChain.length -1];
    if (!requiredBy.hasOwnProperty(requested)) {
        renderChain(currentChain);
        return;
    }

    requiredBy[requested].forEach(parent => {
        if (currentChain.indexOf(parent) > -1) {
            renderChain(currentChain.concat(`loop (${parent})`));
            return;
        }

        findRequestChain(currentChain.concat(parent))
    });
}

function registerDependencies(dependencies, parent) {
    Object.keys(dependencies).forEach(dep => {
        const version = dependencies[dep];

        if (!requiredBy.hasOwnProperty(`${dep}@${version}`)) {
            requiredBy[`${dep}@${version}`] = [];
        }

        if (requiredBy[`${dep}@${version}`].indexOf(parent) === -1) {
            requiredBy[`${dep}@${version}`].push(parent);
        }
    });
}

console.log("Loading dependency tree");
let file = fs.readFileSync('yarn.lock', 'utf8');
let json = lockfile.parse(file).object;

const limitPackages = process.argv.indexOf("--all") == -1;
const ownPackages = new Set();

if (limitPackages) {
    console.log("Listing packages ...");
    const repository = new Repository(process.cwd());
    const { rootPath, packageConfigs } = repository;
    
    // Add root package as well
    //packageConfigs.push('.');
    
    var craftyPackages = PackageUtilities.getPackages({ rootPath, packageConfigs });
    console.log(`${craftyPackages.length} packages found ...`)

    craftyPackages.forEach(pkg => ownPackages.add(pkg.name));
    console.log("Listing dependencies ...");
    craftyPackages.forEach(({ dependencies, devDependencies }) => {
        Object.keys(dependencies  || {}).forEach(dep => ownPackages.add(dep))
        Object.keys(devDependencies || {}).forEach(dep => ownPackages.add(dep))
    });

    // Exclude small packages that make a lot of noise
    ownPackages.delete("chalk");
    ownPackages.delete("debug");
}



// List all the packages and their requested versions

const requiredBy = {};
const packages /*: { [package: string]: { [resolvedVersion: string]: requestedVersion: string[]; }} */ = {};
Object.keys(json).forEach(key => {
    const lastIndex = key.lastIndexOf("@");
    const module = key.substring(0, lastIndex);
    const requestedVersion = key.substring(lastIndex + 1);
    const resolvedVersion = json[key].version;

    // Prepare a list of dependencies and who required them
    if (json[key].dependencies) {
        registerDependencies(json[key].dependencies, key);
    }

    if (json[key].optionalDependencies) {
        registerDependencies(json[key].optionalDependencies, key);
    }

    if (!packages.hasOwnProperty(module)) {
        packages[module] = {};
    }

    if (!packages[module].hasOwnProperty(resolvedVersion)) {
        packages[module][resolvedVersion] = [];
    }

    packages[module][resolvedVersion].push(requestedVersion);
});

const duplicatePackages = [];

const withDuplicates = Object.keys(packages)
    .filter(module => Object.keys(packages[module]).length > 1)
    .map(module => {
        const versions = Object.keys(packages[module]);
        versions.sort(semver.compare).reverse()

        const [latestVersion, ...olderVersions] = versions;

        const requested = olderVersions.map(r => packages[module][r]).reduce((prev, current) => {
            return prev.concat(current);
        }, []);

        duplicatePackages.push({
            module,
            latestVersion,
            requested
        })
    });


duplicatePackages.forEach(({module, latestVersion, requested}) => {
    // Skip packages that we don't directly depend upon
    if (limitPackages && !ownPackages.has(module)) {
        return;     
    }

    console.log("");
    console.log(chalk.bold(module), "( Latest version", chalk.bold(latestVersion), ")");
    requested.forEach(req => findRequestChain([`${module}@${req}`]));
});
