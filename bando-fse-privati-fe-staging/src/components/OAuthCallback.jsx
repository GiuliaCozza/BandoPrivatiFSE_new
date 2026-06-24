import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  OAUTH_CLIENT_ID,
  OAUTH_REDIRECT_URI,
  TOKEN_ENDPOINT,
  clearAuthSession,
  exchangeAuthorizationCode,
  fetchUserInfo,
  getAuthSession,
  getStoredUserInfo,
  logout,
  parseAuthorizationResponse,
  recordAuthorizationResponse,
  scheduleRefresh,
  storeAccessDecision,
  storeTokens,
  storeUserInfo,
  verifyIdToken,
} from "../oauth";
import { getConfig } from "../config";

const StatusMessage = ({ status, message }) => {
  if (!message) return null;
  const color =
    status === "error" ? "#dc2626" : status === "success" ? "#059669" : "#111827";
  return (
    <div
      style={{
        background: "#f9fafb",
        border: `1px solid ${color}`,
        color,
        padding: "12px",
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      {message}
    </div>
  );
};

const normalizeFiscalCode = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().toUpperCase().replace(/^TINIT-/, "");
};

const getAllowedFiscalCodes = () => {
  const config = getConfig();
  const list = Array.isArray(config?.allowedFiscalCodes)
    ? config.allowedFiscalCodes
    : [];
  return new Set(list.map(normalizeFiscalCode).filter(Boolean));
};

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payloadB64 = parts[1];
  const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  try {
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const getCodiceFiscale = (user, claims, accessTokenClaims) => {
  const candidates = [
    user?.codice_fiscale,
    user?.codiceFiscale,
    user?.fiscal_number,
    user?.fiscalNumber,
    user?.cf,
    claims?.codice_fiscale,
    claims?.codiceFiscale,
    claims?.fiscal_number,
    claims?.fiscalNumber,
    claims?.cf,
    claims?.sub,
    accessTokenClaims?.preferred_username,
    accessTokenClaims?.codice_fiscale,
    accessTokenClaims?.codiceFiscale,
    accessTokenClaims?.fiscal_number,
    accessTokenClaims?.fiscalNumber,
    accessTokenClaims?.cf,
    accessTokenClaims?.sub,
    user?.sub,
  ];

  const raw = candidates.find((value) => typeof value === "string" && value.trim().length > 0);
  return normalizeFiscalCode(raw);
};

export default function OAuthCallback({ onAccessDecision = () => {} }) {
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState("");
  const [tokenPayload, setTokenPayload] = useState(null);
  const [userInfo, setUserInfo] = useState(getStoredUserInfo());
  const [refreshError, setRefreshError] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const refreshTimerRef = useRef(null);

  const authResponse = useMemo(
    () => parseAuthorizationResponse(window.location.search),
    []
  );

  const redirectToHome = () => {
    const configuredBasePath = "/bando-fse-privati-fe/";
    const viteBasePath = import.meta.env.BASE_URL || configuredBasePath;
    const normalizedBasePath = viteBasePath.endsWith("/")
      ? viteBasePath
      : `${viteBasePath}/`;
    window.location.replace(normalizedBasePath);
  };

  const denyAccessAndReturnHome = async () => {
    storeAccessDecision(false);
    onAccessDecision(false);
    await logout();
    redirectToHome();
  };

  useEffect(() => {
    const { code, state, error: authError, errorDescription } = authResponse;
    const { codeVerifier, state: storedState, nonce } = getAuthSession();

    recordAuthorizationResponse({
      code,
      state,
      error: authError,
      errorDescription,
    });

    if (authError) {
      setError(
        `Errore restituito da ARPA: ${authError}${
          errorDescription ? ` – ${errorDescription}` : ""
        }`
      );
      setStatus("error");
      clearAuthSession();
      void denyAccessAndReturnHome();
      return;
    }

    if (!code || !state) {
      setError("I parametri 'code' e 'state' non sono presenti nella risposta di ARPA.");
      setStatus("error");
      clearAuthSession();
      void denyAccessAndReturnHome();
      return;
    }

    if (!storedState || storedState !== state) {
      setError("Il parametro 'state' ricevuto non corrisponde a quello inizialmente inviato.");
      setStatus("error");
      clearAuthSession();
      void denyAccessAndReturnHome();
      return;
    }

    if (!TOKEN_ENDPOINT) {
      setError("Endpoint token OIDC non configurato. Verificare le variabili di ambiente.");
      setStatus("error");
      clearAuthSession();
      void denyAccessAndReturnHome();
      return;
    }

    const exchange = async () => {
      try {
        const tokenSet = await exchangeAuthorizationCode({
          code,
          codeVerifier,
          redirectUri: OAUTH_REDIRECT_URI,
          clientId: OAUTH_CLIENT_ID,
          tokenEndpoint: TOKEN_ENDPOINT,
        });
        setTokenPayload(tokenSet);

        let idTokenClaims = null;
        if (tokenSet.id_token) {
          idTokenClaims = await verifyIdToken({
            idToken: tokenSet.id_token,
            clientId: OAUTH_CLIENT_ID,
            nonce,
          });
        }

        const user = await fetchUserInfo({
          accessToken: tokenSet.access_token,
          expectedSub: idTokenClaims?.sub,
        });

        const accessTokenClaims = decodeJwtPayload(tokenSet.access_token);
        const fiscalCode = getCodiceFiscale(user, idTokenClaims, accessTokenClaims);
        const allowedFiscalCodes = getAllowedFiscalCodes();
        const accessGranted =
          allowedFiscalCodes.size === 0
            ? Boolean(fiscalCode)
            : Boolean(fiscalCode && allowedFiscalCodes.has(fiscalCode));

        storeAccessDecision(accessGranted);
        onAccessDecision(accessGranted);
        if (accessGranted) {
          setAccessMessage("Accesso eseguito con successo");
        } else {
          setAccessMessage(
            "Accesso negato: il codice fiscale restituito da ARPA non è autorizzato."
          );
        }

        // Persist claims e userinfo
        storeTokens({
          ...tokenSet,
          id_token_claims: idTokenClaims,
          access_token_claims: accessTokenClaims,
        });
        const enrichedUser = {
          ...user,
          codice_fiscale: fiscalCode || user?.codice_fiscale,
          display_fiscal_code: fiscalCode ? `TINIT-${fiscalCode}` : user?.display_fiscal_code,
        };
        storeUserInfo(enrichedUser);
        setUserInfo(enrichedUser);

        // Avvia refresh automatico
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
        }

        const timerId = scheduleRefresh(tokenSet, {
          onRefreshed: (refreshed) => {
            setTokenPayload(refreshed);
            setRefreshError("");
          },
          onError: (err) => {
            setRefreshError(err.message);
          },
        });
        refreshTimerRef.current = timerId;

        setStatus("success");
        if (accessGranted) {
          redirectToHome();
        } else {
          await denyAccessAndReturnHome();
        }
      } catch (err) {
        setError(err.message);
        setStatus("error");
        await denyAccessAndReturnHome();
      } finally {
        clearAuthSession();
      }
    };

    exchange();
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [authResponse, onAccessDecision]);

  return (
    <div className="app-container">
      <div className="card">
        <h2>Callback OIDC ARPA</h2>
        <p>
          Gestione del rientro da ARPA con i parametri <code>state</code> e{" "}
          <code>code</code> per la successiva richiesta di token di accesso e refresh.
        </p>

        <StatusMessage status="success" message={accessMessage} />

        <StatusMessage
          status={status === "success" ? "success" : error ? "error" : "info"}
          message={
            status === "processing"
              ? "Verifica dei parametri OIDC e richiesta token in corso..."
              : status === "success"
              ? "Token di accesso e refresh richiesti con successo e salvati in sessione."
              : error
          }
        />

        <div className="row">
          <div className="field">
            <label>State ricevuto</label>
            <input type="text" readOnly value={authResponse.state || ""} />
          </div>
          <div className="field">
            <label>Authorization code</label>
            <input type="text" readOnly value={authResponse.code || ""} />
          </div>
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <div className="field">
            <label>Token endpoint</label>
            <input type="text" readOnly value={TOKEN_ENDPOINT} />
          </div>
          <div className="field">
            <label>Client ID</label>
            <input type="text" readOnly value={OAUTH_CLIENT_ID} />
          </div>
        </div>

        {tokenPayload && (
          <div style={{ marginTop: 16 }}>
            <h3>Risposta token</h3>
            <pre
              style={{
                background: "#111827",
                color: "#e5e7eb",
                padding: 12,
                borderRadius: 8,
                overflowX: "auto",
              }}
            >
              {JSON.stringify(tokenPayload, null, 2)}
            </pre>
          </div>
        )}

        {userInfo && (
          <div style={{ marginTop: 16 }}>
            <h3>Userinfo</h3>
            <pre
              style={{
                background: "#111827",
                color: "#e5e7eb",
                padding: 12,
                borderRadius: 8,
                overflowX: "auto",
              }}
            >
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
        )}

        {refreshError && (
          <StatusMessage status="error" message={`Errore durante il refresh: ${refreshError}`} />
        )}

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button className="button secondary" onClick={() => window.location.assign("/")}>
            Torna all&apos;app
          </button>
          <button
            className="button danger"
            onClick={async () => {
              if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
              }
              await logout();
              window.location.assign("/");
            }}
          >
            Logout e pulizia sessione
          </button>
        </div>
      </div>
    </div>
  );
}
