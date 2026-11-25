import mod from "../dist/postcss-selector-parser/index.cjs";
export default mod;

// Lets CommonJS consumers get the value from a plain require()
export { mod as "module.exports" };
