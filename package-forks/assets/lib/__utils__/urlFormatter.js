import { format, URL } from "node:url";

export default function urlFormatter(obj) {
  if (obj instanceof URL) {
    return obj.toString();
  }

  if (obj.searchParams) {
    const params = [];
    for (const [key, value] of obj.searchParams.entries()) {
      params.push(value ? `${key}=${value}` : key);
    }
    obj.search = params.join("&");
  }

  return format(obj);
}
