import mod from "../dist/postcss-value-parser/index.js";
export default mod;

// Lets CommonJS consumers get the value from a plain require()
export { mod as "module.exports" };
