import React, { useEffect, useState } from "react";
import {
  buildAuthorizationUrl,
  getStoredTokens,
  getStoredUserInfo,
  logout,
} from "../oauth";

const normalizeFiscalCode = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().toUpperCase().replace(/^TINIT-/, "");
};

const formatFiscalCode = (value) => {
  const normalized = normalizeFiscalCode(value);
  return normalized ? `TINIT-${normalized}` : "";
};

const resolveFiscalCode = () => {
  const userInfo = getStoredUserInfo();
  const tokens = getStoredTokens();
  const idTokenClaims = tokens?.id_token_claims;
  const accessTokenClaims = tokens?.access_token_claims;

  const candidates = [
    userInfo?.display_fiscal_code,
    userInfo?.codice_fiscale,
    userInfo?.codiceFiscale,
    userInfo?.fiscal_number,
    userInfo?.fiscalNumber,
    userInfo?.cf,
    idTokenClaims?.codice_fiscale,
    idTokenClaims?.codiceFiscale,
    idTokenClaims?.fiscal_number,
    idTokenClaims?.fiscalNumber,
    idTokenClaims?.cf,
    accessTokenClaims?.preferred_username,
    accessTokenClaims?.codice_fiscale,
    accessTokenClaims?.codiceFiscale,
    accessTokenClaims?.fiscal_number,
    accessTokenClaims?.fiscalNumber,
    accessTokenClaims?.cf,
  ];

  const raw = candidates.find(
    (value) => typeof value === "string" && value.trim().length > 0
  );
  return formatFiscalCode(raw);
};

export default function HeaderBar({
  accessLevel,
  onLogout = logout,
}) {
  const [authPreparing, setAuthPreparing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getStoredTokens()));
  const [fiscalCode, setFiscalCode] = useState(resolveFiscalCode);

  useEffect(() => {
    if (accessLevel === "admin") {
      setIsLoggedIn(true);
    }
  }, [accessLevel]);

  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(Boolean(getStoredTokens()));
      setFiscalCode(resolveFiscalCode());
    };
    window.addEventListener("storage", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
    };
  }, []);

  const handleAuthRedirect = async () => {
    setAuthPreparing(true);
    try {
      const url = await buildAuthorizationUrl();
      window.location.assign(url);
    } finally {
      setAuthPreparing(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
      setIsLoggedIn(false);
      setFiscalCode("");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header>
      <div className="header-top">
        <div>
          <h1>Gestione Bando FSE privati</h1>
          {isLoggedIn && fiscalCode && (
            <p style={{ margin: "4px 0 0", fontSize: "0.95rem", color: "#ffffff" }}>
              <strong>{fiscalCode}</strong>
            </p>
          )}
        </div>
        <div className="header-actions">
          <button
            className="button primary"
            onClick={handleAuthRedirect}
            disabled={authPreparing || isLoggedIn}
          >
            Accedi tramite ARPA
          </button>
          <button
            className="button danger"
            onClick={handleLogout}
            disabled={loggingOut || !isLoggedIn}
          >
            {loggingOut ? "Pulizia..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
