/* global test */

function test (one,two) {
   return one + two;
}

function isEqual(a, b)
{
  return a == b;
}

window.test = test;
window.isEqual = isEqual;
