function asRegExp(test) {
  if (typeof test === "string") {
    return new RegExp(`^${test.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}`);
  }
  return test;
}

function matchPart(str, testStr) {
  if (!testStr) return true;
  const test = asRegExp(testStr);
  if (Array.isArray(test)) {
    return test.map(asRegExp).some(regExp => regExp.test(str));
  } else {
    return test.test(str);
  }
}

function matchObject(obj, str) {
  if (obj.test) {
    if (!matchPart(str, obj.test)) {
      return false;
    }
  }
  if (obj.include) {
    if (!matchPart(str, obj.include)) {
      return false;
    }
  }
  if (obj.exclude) {
    if (matchPart(str, obj.exclude)) {
      return false;
    }
  }
  return true;
}

module.exports = {
  matchObject
};
