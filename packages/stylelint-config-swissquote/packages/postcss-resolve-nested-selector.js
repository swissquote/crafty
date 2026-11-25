import mod from "../dist/postcss-resolve-nested-selector/index.js";
export default mod;

// Lets CommonJS consumers get the value from a plain require()
export { mod as "module.exports" };
