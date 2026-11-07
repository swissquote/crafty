export let specialConstant: number;

function initializationWithSideEffects() {
  // ...
  specialConstant = 42;
}

initializationWithSideEffects();
