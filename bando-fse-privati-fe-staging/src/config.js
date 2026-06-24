let cachedConfig = null;
let loadPromise = null;

const getFrontendBasePath = () => {
  const configuredBasePath = "/bando-fse-privati-fe/";
  const viteBasePath = import.meta.env.BASE_URL || configuredBasePath;
  return viteBasePath.endsWith("/") ? viteBasePath : `${viteBasePath}/`;
};

export const loadConfig = async () => {
  if (cachedConfig) {
    return cachedConfig;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const response = await fetch(`${getFrontendBasePath()}config/config.json`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Config load failed: ${response.status}`);
      }
      cachedConfig = await response.json();
    } catch (error) {
      cachedConfig = {};
    }
    return cachedConfig;
  })();

  return loadPromise;
};

export const getConfigValue = (key, fallback = "") => {
  if (!cachedConfig) {
    return fallback;
  }
  const value = cachedConfig[key];
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const getConfig = () => cachedConfig;
