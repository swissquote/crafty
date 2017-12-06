const net = require("net");
const path = require("path");

const servicePort = require("service-port");

const portRange = 100;
const assigned = {};

function isPortTaken(port, fn) {
  const tester = net
    .createServer()
    .once("error", err => {
      if (err.code === "EADDRINUSE") {
        fn(null, true);
      } else {
        fn(err);
      }
    })
    .once("listening", () => {
      tester
        .once("close", () => {
          fn(null, false);
        })
        .close();
    })
    .listen(port);
}

function parse(arr, status, cb) {
  if (arr.length === 0) {
    cb(null, false);
  }

  const port = arr.shift();

  isPortTaken(port, (err, taken) => {
    //this should send error to user but it'll stop searching for ports...
    if (taken === status) {
      cb(null, port); //It's open
    } else {
      setImmediate(() => parse(arr, status, cb));
    }
  });
}

function findOpen(start, cb) {
  const stop = start + portRange;

  const ports = [];

  for (let i = start; i < stop; i++) {
    ports.push(i);
  }

  return parse(ports, false, cb);
}

module.exports = {
  getFree(buildname) {
    if (assigned[buildname]) {
      return Promise.resolve(assigned[buildname]);
    }

    const basePort = servicePort(path.join(__dirname, buildname));

    return new Promise((resolve, reject) => {
      findOpen(basePort, (err, port) => {
        if (err) {
          reject(err);
          return;
        }

        assigned[buildname] = port;

        resolve(port);
      });
    });
  },

  release(buildname) {
    delete assigned[buildname];
  }
};
