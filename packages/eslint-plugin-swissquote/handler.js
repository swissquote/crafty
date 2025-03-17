try {
  const SegfaultHandler = require("segfault-handler");

  SegfaultHandler.registerHandler();
} catch (e) {
  console.error("Could not register segfault handler", e);
}
