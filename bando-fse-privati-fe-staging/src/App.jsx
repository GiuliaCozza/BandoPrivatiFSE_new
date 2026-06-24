import React, { useCallback, useEffect, useRef, useState } from "react";
import HeaderBar from "./components/HeaderBar";
import Dashboard from "./components/Dashboard";
import ItemList from "./components/ItemList";
import CsvImport from "./components/CsvImport";
import CsvUpdate from "./components/CsvUpdate";
import CsvExport from "./components/CsvExport";
import DeleteItem from "./components/DeleteItem";
import OAuthCallback from "./components/OAuthCallback";
import { getAccessDecision, logout } from "./oauth";

export default function App() {
  const [accessGranted, setAccessGranted] = useState(getAccessDecision());
  const inactivityTimeoutRef = useRef(null);
  const logoutInProgressRef = useRef(false);
  const accessLevel = accessGranted ? "admin" : "read";

  const executeLogout = useCallback(async () => {
    if (logoutInProgressRef.current) {
      return;
    }
    logoutInProgressRef.current = true;
    try {
      await logout();
      setAccessGranted(false);
    } finally {
      logoutInProgressRef.current = false;
    }
  }, []);

  useEffect(() => {
    const syncAccess = () => setAccessGranted(getAccessDecision());
    window.addEventListener("storage", syncAccess);
    return () => {
      window.removeEventListener("storage", syncAccess);
    };
  }, []);

  useEffect(() => {
    if (!accessGranted) {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      return undefined;
    }

    const resetInactivityTimeout = () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(() => {
        executeLogout();
      }, 10 * 60 * 1000);
    };

    const onUserInteraction = (event) => {
      if (event.target?.closest("button")) {
        resetInactivityTimeout();
      }
    };

    resetInactivityTimeout();
    document.addEventListener("click", onUserInteraction, true);

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      document.removeEventListener("click", onUserInteraction, true);
    };
  }, [accessGranted, executeLogout]);

  const isCallbackRoute = window.location.pathname.includes("/callback");

  if (isCallbackRoute) {
    return <OAuthCallback onAccessDecision={setAccessGranted} />;
  }

  return (
    <div>
      <HeaderBar
        accessLevel={accessLevel}
        onLogout={executeLogout}
      />

      <div className="app-container">
        {!accessGranted && (
          <div className="card app-locked-banner">
            <h2>Accesso bloccato</h2>
            <p>
              Completa la verifica del codice fiscale tramite ARPA per abilitare le funzioni
              dell&apos;applicazione.
            </p>
          </div>
        )}

        <div className={accessGranted ? "app-content" : "app-content app-content-disabled"}>
          <Dashboard accessLevel={accessLevel} />

          <ItemList accessLevel={accessLevel} />

          <div className="row" style={{ marginTop: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <CsvExport accessLevel={accessLevel} />
            </div>
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <CsvImport accessLevel={accessLevel} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <CsvUpdate accessLevel={accessLevel} />
            </div>
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <DeleteItem />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
