import React from "react";

export function AppContainer(e) {
  return React.Children.only(e.children);
}
export function hot() {
  return function(e) {
    return e;
  };
}
export function areComponentsEqual(e, n) {
  return e === n;
}
export function setConfig() {
    // NOOP
}
export function cold(e) {
  return e;
}
export function configureComponent() {
    // NOOP
}
