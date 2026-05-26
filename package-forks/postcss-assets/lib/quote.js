/* eslint quotes: 0 */

import { format } from "node:util";

const R_QUOTES = /'/g;

function escapeQuote(match, offset, string) {
  if (string[offset - 1] === "\\") {
    return match;
  }
  return `\\${match}`;
}

export default function quote(string) {
  if (string[0] === "'" || string[0] === '"') {
    return string;
  }
  return format("'%s'", string.replace(R_QUOTES, escapeQuote));
}
