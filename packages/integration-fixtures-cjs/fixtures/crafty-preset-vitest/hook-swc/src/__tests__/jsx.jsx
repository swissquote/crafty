test("loads JSX tests through the SWC preset hook", () => {
  expect(__SWC_MAGIC__).toBe("swc-hooked");
});