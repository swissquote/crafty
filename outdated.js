const map = require('asyncmap');
const chalk = require('chalk');
const Table = require('easy-table');
const pacote = require('pacote');
const relative = require('require-relative');
const semver = require('semver')
const Repository = require("lerna/lib/Repository");
const PackageUtilities = require("lerna/lib/PackageUtilities");

console.log("Listing packages ...");
const repository = new Repository(process.cwd());
const {rootPath, packageConfigs} = repository;

// Add root package as well
packageConfigs.push('.');

var packages = PackageUtilities.getPackages({ rootPath, packageConfigs });
console.log(`${packages.length} packages found ...`)

var ownPackages = packages.map(pkg => pkg.name);

const modules = {};

console.log("Listing dependencies ...");
packages.forEach(({ name, location, dependencies, devDependencies }) => {
    const parent = name;

    const addModule = (name, requestedVersion) => {
        if (ownPackages.indexOf(name) > -1) {
            return;
        }

        if (!modules.hasOwnProperty(name)) {
            modules[name] = {
                name,
                requested: []
            };
        }

        modules[name].requested.push({
            parent,
            location,
            requestedVersion,
            currentVersion: relative(`${name}/package.json`, location).version
        })
    }

    Object.keys(dependencies  || {}).forEach(dep => addModule(dep, dependencies[dep]))
    Object.keys(devDependencies || {}).forEach(dep => addModule(dep, dependencies[dep]))
});

map(Object.keys(modules), async name =>  {
    try {
        const pkg = await pacote.manifest(`${name}@latest`);
        modules[name].latest = pkg.version; 
    } catch (e) {
        modules[name].latest = "not found";
    }
}).then(() => {
    console.log("Resolved all versions");

    const t = new Table;

    Object.keys(modules).forEach(name => {
        const outdated = modules[name].requested.map((request) => {
            return (modules[name].latest != request.currentVersion) ? request : null;
        }).filter(Boolean);

        if (outdated.length) {
            outdated.forEach(request => {
                t.cell('Package', name, (val, width) => width ? chalk.bold(val) : val);
                t.cell('Current', request.currentVersion);
                t.cell('Latest', modules[name].latest, (val, width) => {
                    if (!width) {
                        return val;
                    }

                    if (semver.major(request.currentVersion) != semver.major(val)) {
                        return chalk.red(val);
                    } else {
                        return chalk.yellow(val);
                    }
                });
                t.cell('Parent', request.parent);
                t.newRow();
            });
        }
    })

    console.log(t.toString());

    process.exit(0);
});