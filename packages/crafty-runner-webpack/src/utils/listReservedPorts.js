#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ports = require("service-names-port-numbers")();

const target = "tcp";

const reservedPorts = [];
function put(n) {
  if (n < 1024) {
    return;
  }
  var last = reservedPorts[reservedPorts.length - 1];

  if (n > last || !reservedPorts.length) {
    reservedPorts.push(n);
  } else if (n < last) {
    var i = reservedPorts.length - 1;
    while (i >= 0 && n < reservedPorts[i]) {
      i = i - 1;
    }
    reservedPorts.splice(i + 1, 0, n);
  }
}

ports.forEach((entry) => {
  const name = entry.ServiceName;
  const description = entry.Description;
  const protocol = entry.TransportProtocol;
  const port = entry.PortNumber;

  const used =
    (name || description.toLowerCase() === "reserved") &&
    port &&
    (protocol === target || !protocol);

  if (!used) {
    return;
  }

  const pair = port.split("-");
  const min = parseInt(pair[0], 10);

  if (pair.length === 1) {
    put(min);
  } else {
    const max = parseInt(pair[1], 10);
    for (let i = min; i <= max; i++) {
      put(i);
    }
  }
});

fs.writeFileSync(
  path.join(__dirname, "reservedPorts.json"),
  JSON.stringify(reservedPorts)
);

console.log(
  `Bloom filter written to 'reservedPorts.json' with ${reservedPorts.length} reserved ports.`
);
