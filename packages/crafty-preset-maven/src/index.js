const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");

const tmp = require("tmp");
const xml2js = require("xml2js");

let loadedPom;

function forEachAncestorDirectory(directory, callback) {
  let currentDirectory = directory;
  //eslint-disable-next-line no-constant-condition
  while (true) {
    const result = callback(currentDirectory);
    if (result !== undefined) {
      return result;
    }
    const parentPath = path.dirname(currentDirectory);
    if (parentPath === currentDirectory) {
      return undefined;
    }
    currentDirectory = parentPath;
  }
}

function getEffectivePom() {
  if (loadedPom) {
    return loadedPom;
  }

  const tmpfile = tmp.fileSync().name;

  const pomWorkingDirectory = forEachAncestorDirectory(
    process.cwd(),
    directory => {
      return fs.existsSync(path.join(directory, "pom.xml"))
        ? directory
        : undefined;
    }
  );

  if (!pomWorkingDirectory) {
    throw new Error("No pom.xml found");
  }

  childProcess.execSync(`mvn help:effective-pom -Doutput="${tmpfile}" 2>&1`, {
    cwd: pomWorkingDirectory
  });

  xml2js.parseString(
    fs.readFileSync(tmpfile),
    { trim: true, async: false },
    (err, result) => {
      if (!result.project) {
        throw new Error("This is not a valid effective pom");
      }

      loadedPom = result.project;
    }
  );

  return loadedPom;
}

function getDestination(config) {
  const paths = {
    webapp: "resources",
    webjar: "META-INF/resources/webjars"
  };

  const appName = config.name ? `/${config.name}` : "";
  let basedir;

  if (process.env.TARGET_BASEDIR) {
    basedir = process.env.TARGET_BASEDIR;
  } else {
    const pom = getEffectivePom();

    if (config.mavenType === "webjar") {
      basedir = pom.build[0].outputDirectory[0];
    } else {
      basedir = `${pom.build[0].directory[0]}/${pom.build[0].finalName[0]}`;
    }
  }

  return `${basedir}/${paths[config.mavenType]}${appName}`;
}

module.exports = {
  config(config) {
    if (!config.mavenType) {
      return config;
    }

    if (config.mavenType !== "webapp" && config.mavenType !== "webjar") {
      throw new Error(
        `Your config.type '${config.mavenType}' is invalid, must be 'webapp' or 'webjar'`
      );
    }

    try {
      config.destination = getDestination(config);
    } catch (e) {
      console.error(
        `Could not define destination using maven, falling back to default. \nOriginal message:\n${e.message}`
      );
    }

    return config;
  }
};
