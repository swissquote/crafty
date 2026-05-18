import { URLSearchParams } from "node:url";

export default function composeQueryString(current, addon) {
  const newSearchParams = new URLSearchParams(addon);
  newSearchParams.forEach((value, name) => current.set(name, value));
}
