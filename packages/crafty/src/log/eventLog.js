const logged = new Set();

function getKey(event) {
  return (event.error && event.error.message) || event.message;
}

function wasLogged(event) {
  const key = getKey(event);
  if (key) {
    return logged.has(key);
  }

  // Simple strings will not match as keys
  // and will always be logged
  return false;
}

function recordLogged(event) {
  const key = getKey(event);
  if (key) {
    logged.add(key);
  }
}

module.exports = {
  wasLogged,
  recordLogged
};
