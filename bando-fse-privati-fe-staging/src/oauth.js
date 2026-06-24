import { getConfigValue } from "./config";

const inferIssuer = (endpoint) => {
  if (!endpoint) return null;
  const match = endpoint.match(/^(.*)\/protocol\/openid-connect\//);
  return match ? match[1] : null;
};

const configuredAuthUrl = getConfigValue("authUrl", "");
const configuredTokenUrl = getConfigValue("tokenUrl", "");
const configuredLogoutUrl = getConfigValue("unauthUrl", "");
const configuredUserInfoUrl = getConfigValue("userinfoUrl", "");
const configuredClientId = getConfigValue("clientId", "");
const configuredRedirectUri = getConfigValue("redirectUri", "");
const configuredPostLogoutRedirectUri = getConfigValue(
  "postLogoutRedirectUri",
  configuredRedirectUri
);
const configuredScopes = getConfigValue("scopes", "");

const resolvedIssuer =
  inferIssuer(configuredAuthUrl) || inferIssuer(configuredTokenUrl) || "";

export const OAUTH_ISSUER = resolvedIssuer;

export const AUTHORIZATION_ENDPOINT = configuredAuthUrl;

export const TOKEN_ENDPOINT = configuredTokenUrl;

export const USERINFO_ENDPOINT = configuredUserInfoUrl;

export const LOGOUT_ENDPOINT = configuredLogoutUrl;

export const OAUTH_CLIENT_ID = configuredClientId;

export const OAUTH_REDIRECT_URI = configuredRedirectUri;

export const OAUTH_SCOPE = configuredScopes;
export const OAUTH_POST_LOGOUT_REDIRECT_URI = configuredPostLogoutRedirectUri;

const PKCE_CODE_VERIFIER_KEY = "pkce_code_verifier";
const OAUTH_STATE_KEY = "oauth_state";
const OAUTH_NONCE_KEY = "oauth_nonce";
const OAUTH_AUTH_RESPONSE_KEY = "oauth_authorization_response";
const OAUTH_TOKENS_KEY = "oauth_tokens";
const OAUTH_USERINFO_KEY = "oauth_userinfo";
const OAUTH_ACCESS_GRANTED_KEY = "oauth_access_granted";

const base64UrlEncode = (input) =>
  btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const base64UrlToUint8Array = (str) => {
  const padding = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    buffer[i] = raw.charCodeAt(i);
  }
  return buffer;
};

const createRandomString = (length) => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(length));
  return base64UrlEncode(randomBytes);
};

export const createCodeVerifier = () => createRandomString(32);

export const createCodeChallenge = async (verifier) => {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
};

export const createState = () => createRandomString(16);

export const createNonce = () => createRandomString(16);

export const persistAuthSession = ({ codeVerifier, state, nonce }) => {
  if (codeVerifier) {
    sessionStorage.setItem(PKCE_CODE_VERIFIER_KEY, codeVerifier);
  }
  if (state) {
    sessionStorage.setItem(OAUTH_STATE_KEY, state);
  }
  if (nonce) {
    sessionStorage.setItem(OAUTH_NONCE_KEY, nonce);
  }
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(PKCE_CODE_VERIFIER_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_NONCE_KEY);
  sessionStorage.removeItem(OAUTH_AUTH_RESPONSE_KEY);
};

export const getAuthSession = () => ({
  codeVerifier: sessionStorage.getItem(PKCE_CODE_VERIFIER_KEY),
  state: sessionStorage.getItem(OAUTH_STATE_KEY),
  nonce: sessionStorage.getItem(OAUTH_NONCE_KEY),
});

export const recordAuthorizationResponse = (payload) => {
  sessionStorage.setItem(OAUTH_AUTH_RESPONSE_KEY, JSON.stringify(payload));
};

export const getLastAuthorizationResponse = () => {
  const raw = sessionStorage.getItem(OAUTH_AUTH_RESPONSE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const computeAbsoluteExpiry = (expiresIn) => {
  if (!expiresIn) return null;
  return Date.now() + expiresIn * 1000;
};

export const storeTokens = (payload) => {
  const enriched = {
    ...payload,
    received_at: Date.now(),
    expires_at: payload.expires_at || computeAbsoluteExpiry(payload.expires_in),
    refresh_expires_at:
      payload.refresh_expires_at || computeAbsoluteExpiry(payload.refresh_expires_in),
  };
  sessionStorage.setItem(OAUTH_TOKENS_KEY, JSON.stringify(enriched));
  return enriched;
};

export const getStoredTokens = () => {
  const raw = sessionStorage.getItem(OAUTH_TOKENS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const storeUserInfo = (payload) => {
  sessionStorage.setItem(OAUTH_USERINFO_KEY, JSON.stringify(payload));
};

export const getStoredUserInfo = () => {
  const raw = sessionStorage.getItem(OAUTH_USERINFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const storeAccessDecision = (granted) => {
  sessionStorage.setItem(OAUTH_ACCESS_GRANTED_KEY, granted ? "true" : "false");
};

export const getAccessDecision = () => sessionStorage.getItem(OAUTH_ACCESS_GRANTED_KEY) === "true";

export const clearAccessDecision = () => {
  sessionStorage.removeItem(OAUTH_ACCESS_GRANTED_KEY);
};

export const buildAuthorizationUrl = async ({
  authorizationEndpoint = AUTHORIZATION_ENDPOINT,
  clientId = OAUTH_CLIENT_ID,
  redirectUri = OAUTH_REDIRECT_URI,
  scope = OAUTH_SCOPE,
} = {}) => {
  const codeVerifier = createCodeVerifier();
  const codeChallenge = await createCodeChallenge(codeVerifier);
  const state = createState();
  const nonce = createNonce();

  persistAuthSession({ codeVerifier, state, nonce });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${authorizationEndpoint}?${params.toString()}`;
};

export const parseAuthorizationResponse = (search) => {
  const params = new URLSearchParams(search);
  return {
    code: params.get("code"),
    state: params.get("state"),
    error: params.get("error"),
    errorDescription: params.get("error_description"),
  };
};

export const exchangeAuthorizationCode = async ({
  code,
  codeVerifier,
  redirectUri = OAUTH_REDIRECT_URI,
  clientId = OAUTH_CLIENT_ID,
  tokenEndpoint = TOKEN_ENDPOINT,
}) => {
  if (!code) {
    throw new Error("Codice di autorizzazione assente nella risposta ARPA");
  }

  if (!codeVerifier) {
    throw new Error("Code verifier PKCE non presente in sessione");
  }

  if (!clientId) {
    throw new Error("Client ID OIDC non configurato");
  }

  if (!redirectUri) {
    throw new Error("Redirect URI OIDC non configurata");
  }

  const payload = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  });

  const res = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.error_description || data.error || detail;
    } catch {
      // no-op
    }
    throw new Error(`Errore token ARPA: ${detail}`);
  }

  return res.json();
};

const getKeyFromJwk = async (jwk) => {
  try {
    return await crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      true,
      ["verify"]
    );
  } catch {
    return null;
  }
};

const resolveKey = async (kid) => {
  if (!kid) return null;
  const res = await fetch(`${OAUTH_ISSUER}/protocol/openid-connect/certs`);
  if (!res.ok) {
    throw new Error("Impossibile recuperare la JWKS da ARPA");
  }
  const data = await res.json();
  const keys = Array.isArray(data.keys) ? data.keys : [];
  const jwk = keys.find((entry) => entry.kid === kid);
  if (!jwk) return null;
  return getKeyFromJwk(jwk);
};

export const verifyIdToken = async ({ idToken, clientId = OAUTH_CLIENT_ID, nonce }) => {
  if (!idToken) {
    throw new Error("Token ID mancante");
  }

  if (!clientId) {
    throw new Error("Client ID OIDC non configurato");
  }

  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Formato ID Token non valido");
  }

  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));

  if (payload.iss !== OAUTH_ISSUER) {
    throw new Error("Issuer non valido nel token ID");
  }

  if (!payload.aud || !payload.aud.includes(clientId)) {
    throw new Error("Audience non valido nel token ID");
  }

  if (nonce && payload.nonce !== nonce) {
    throw new Error("Nonce non valido nel token ID");
  }

  const key = await resolveKey(header.kid);
  if (!key) {
    throw new Error("Impossibile risolvere la chiave pubblica per l'ID token");
  }

  const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = Uint8Array.from(atob(parts[2]), (char) => char.charCodeAt(0));

  const valid = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    signature,
    data
  );

  if (!valid) {
    throw new Error("Firma ID token non valida");
  }

  return payload;
};

export const fetchUserInfo = async ({ accessToken, expectedSub }) => {
  if (!accessToken) {
    throw new Error("Access token mancante");
  }

  const res = await fetch(USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Errore nel recupero dei dati utente da ARPA");
  }

  const data = await res.json();
  if (expectedSub && data.sub !== expectedSub) {
    throw new Error("Subject non coerente nei dati utente");
  }

  return data;
};

export const refreshTokens = async ({
  refreshToken,
  clientId = OAUTH_CLIENT_ID,
  tokenEndpoint = TOKEN_ENDPOINT,
}) => {
  if (!refreshToken) {
    throw new Error("Refresh token mancante");
  }

  const payload = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const res = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.error_description || data.error || detail;
    } catch {
      // no-op
    }
    throw new Error(`Errore refresh ARPA: ${detail}`);
  }

  return res.json();
};

export const scheduleRefresh = (
  tokenSet,
  { onRefreshed, onError } = {}
) => {
  if (!tokenSet?.refresh_token) {
    return null;
  }

  const expiresAt = tokenSet.expires_at || Date.now() + tokenSet.expires_in * 1000;
  const now = Date.now();
  const refreshAt = Math.max(expiresAt - 60 * 1000, now + 5 * 1000);
  const delay = refreshAt - now;

  return setTimeout(async () => {
    try {
      const refreshed = await refreshTokens({
        refreshToken: tokenSet.refresh_token,
        clientId: OAUTH_CLIENT_ID,
        tokenEndpoint: TOKEN_ENDPOINT,
      });
      const stored = storeTokens(refreshed);
      if (onRefreshed) {
        onRefreshed(stored);
      }
    } catch (err) {
      if (onError) {
        onError(err);
      }
    }
  }, delay);
};

export const logout = async ({
  accessToken,
  refreshToken,
  idToken,
  postLogoutRedirectUri,
} = {}) => {
  const storedTokens = getStoredTokens();
  const resolvedAccessToken = accessToken ?? storedTokens?.access_token;
  const resolvedRefreshToken = refreshToken ?? storedTokens?.refresh_token;
  const resolvedIdToken = idToken ?? storedTokens?.id_token;
  const resolvedPostLogoutRedirectUri =
    postLogoutRedirectUri ?? OAUTH_POST_LOGOUT_REDIRECT_URI;

  if (LOGOUT_ENDPOINT) {
    const params = new URLSearchParams({
      client_id: OAUTH_CLIENT_ID,
    });

    if (resolvedRefreshToken) {
      params.set("refresh_token", resolvedRefreshToken);
    }

    if (resolvedIdToken) {
      params.set("id_token_hint", resolvedIdToken);
    }

    if (resolvedPostLogoutRedirectUri) {
      params.set("post_logout_redirect_uri", resolvedPostLogoutRedirectUri);
    }

    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      if (resolvedAccessToken) {
        headers.Authorization = `Bearer ${resolvedAccessToken}`;
      }

      const response = await fetch(LOGOUT_ENDPOINT, {
        method: "POST",
        headers,
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error("Logout ARPA fallito");
      }
    } catch {
      // no-op
    }
  }

  sessionStorage.removeItem(OAUTH_TOKENS_KEY);
  sessionStorage.removeItem(OAUTH_USERINFO_KEY);
  sessionStorage.removeItem(OAUTH_ACCESS_GRANTED_KEY);
};
