import { getConfigValue } from "./config";

const DEFAULT_API_BASE =
  "https://bando-fse-privati-5146.k8s-san-s01.rtpc.sct.toscana.it";

const resolveApiBase = () => {
  const backendUrl = getConfigValue("backendUrl", DEFAULT_API_BASE);
  const apiPath = getConfigValue("apiPath", "");

  if (!apiPath) {
    return backendUrl;
  }

  const baseEndsWithSlash = backendUrl.endsWith("/");
  const pathStartsWithSlash = apiPath.startsWith("/");

  if (baseEndsWithSlash && pathStartsWithSlash) {
    return `${backendUrl}${apiPath.slice(1)}`;
  }

  if (!baseEndsWithSlash && !pathStartsWithSlash) {
    return `${backendUrl}/${apiPath}`;
  }

  return `${backendUrl}${apiPath}`;
};

export const getApiBase = () => resolveApiBase();

export async function apiRequest(
  path,
  { method = "GET", accessLevel, headers = {}, body } = {}
) {
  const url = `${resolveApiBase()}${path}`;

  const finalHeaders = {
    ...(headers || {}),
  };

  if (accessLevel) {
    finalHeaders["X-Access-Level"] = accessLevel;
  }

  const options = {
    method,
    headers: finalHeaders,
    body,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    let detail;
    try {
      const data = await res.json();
      detail = data.detail || JSON.stringify(data);
    } catch {
      detail = res.statusText;
    }
    throw new Error(`Errore ${res.status}: ${detail}`);
  }

  if (res.status === 204) {
    return;
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  return res;
}

export async function apiJson(
  path,
  { method = "GET", accessLevel, data } = {}
) {
  return apiRequest(path, {
    method,
    accessLevel,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function deleteItemById(itemId) {
  return apiRequest(`/data/by-id/${itemId}`, {
    method: "DELETE",
    accessLevel: "admin",
  });
}

export async function deleteItemByPartitaIva(partitaIva) {
  const encodedPartitaIva = encodeURIComponent(partitaIva);
  return apiRequest(`/data/${encodedPartitaIva}`, {
    method: "DELETE",
    accessLevel: "admin",
  });
}
