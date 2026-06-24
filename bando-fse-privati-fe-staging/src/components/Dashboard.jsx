import React, { useEffect, useState } from "react";
import { apiJson } from "../api";

const formatCurrency = (value) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const getSafeObjectEntries = (value) => {
  if (!value || typeof value !== "object") {
    return [];
  }

  const rows = [];
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      rows.push([key, value[key]]);
    }
  }
  return rows;
};

const EMPTY_DASHBOARD_STATS = {
  total_strutture: 0,
  compilazioni_per_tipologia_documentale: {},
  totale_fondi: 0,
  residuo_fondi: 0,
  costo_totale_strutture: 0,
  fondi_totali_da_erogare_stato_1: 0,
  fondi_totali_da_erogare_stato_2: 0,
  fondi_totali_da_erogare_stato_4: 0,
  fondi_totali_da_erogare_stato_5: 0,
  totale_righe_stato_4: 0,
  totale_righe_stato_5: 0,
  totale_richieste_fuori_bando: 0,
  software_unici_per_profilo_documentale_stato_1: {},
  software_unici_per_profilo_documentale_stato_2: {},
  software_unici_per_profilo_documentale_stato_3: {},
  software_unici_per_profilo_documentale_stato_4: {},
  software_unici_per_profilo_documentale_stato_5: {},
  partite_iva_stato_4: [],
  partite_iva_stato_5: [],
};

const normalizeDashboardStats = (payload) => {
  let normalized = payload;

  if (typeof normalized === "string") {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      return EMPTY_DASHBOARD_STATS;
    }
  }

  if (!normalized || typeof normalized !== "object") {
    return EMPTY_DASHBOARD_STATS;
  }

  if (
    normalized.data &&
    typeof normalized.data === "object" &&
    !Array.isArray(normalized.data)
  ) {
    normalized = normalized.data;
  }

  const compilazioniRaw =
    normalized.compilazioni_per_tipologia_documentale ??
    normalized.fornitori_unici_per_tipologia;

  return {
    total_strutture: Number(normalized.total_strutture) || 0,
    compilazioni_per_tipologia_documentale:
      compilazioniRaw && typeof compilazioniRaw === "object" ? compilazioniRaw : {},
    totale_fondi: Number(normalized.totale_fondi) || 0,
    residuo_fondi: Number(normalized.residuo_fondi) || 0,
    costo_totale_strutture: Number(normalized.costo_totale_strutture) || 0,
    fondi_totali_da_erogare_stato_1:
      Number(normalized.fondi_totali_da_erogare_stato_1) || 0,
    fondi_totali_da_erogare_stato_2:
      Number(normalized.fondi_totali_da_erogare_stato_2) || 0,
    fondi_totali_da_erogare_stato_4:
      Number(normalized.fondi_totali_da_erogare_stato_4) || 0,
    fondi_totali_da_erogare_stato_5:
      Number(normalized.fondi_totali_da_erogare_stato_5) || 0,
    totale_righe_stato_4: Number(normalized.totale_righe_stato_4) || 0,
    totale_righe_stato_5: Number(normalized.totale_righe_stato_5) || 0,
    totale_richieste_fuori_bando:
      Number(normalized.totale_richieste_fuori_bando) || 0,
    software_unici_per_profilo_documentale_stato_1:
      normalized.software_unici_per_profilo_documentale_stato_1 &&
      typeof normalized.software_unici_per_profilo_documentale_stato_1 === "object"
        ? normalized.software_unici_per_profilo_documentale_stato_1
        : {},
    software_unici_per_profilo_documentale_stato_2:
      normalized.software_unici_per_profilo_documentale_stato_2 &&
      typeof normalized.software_unici_per_profilo_documentale_stato_2 === "object"
        ? normalized.software_unici_per_profilo_documentale_stato_2
        : {},
    software_unici_per_profilo_documentale_stato_3:
      normalized.software_unici_per_profilo_documentale_stato_3 &&
      typeof normalized.software_unici_per_profilo_documentale_stato_3 === "object"
        ? normalized.software_unici_per_profilo_documentale_stato_3
        : {},
    software_unici_per_profilo_documentale_stato_4:
      normalized.software_unici_per_profilo_documentale_stato_4 &&
      typeof normalized.software_unici_per_profilo_documentale_stato_4 === "object"
        ? normalized.software_unici_per_profilo_documentale_stato_4
        : {},
    software_unici_per_profilo_documentale_stato_5:
      normalized.software_unici_per_profilo_documentale_stato_5 &&
      typeof normalized.software_unici_per_profilo_documentale_stato_5 === "object"
        ? normalized.software_unici_per_profilo_documentale_stato_5
        : {},
    partite_iva_stato_4: Array.isArray(normalized.partite_iva_stato_4)
      ? normalized.partite_iva_stato_4
      : [],
    partite_iva_stato_5: Array.isArray(normalized.partite_iva_stato_5)
      ? normalized.partite_iva_stato_5
      : [],
  };
};


const SoftwareBox = ({ label, data }) => (
  <div className="dashboard-box dashboard-box-wide">
    <p className="dashboard-label">{label}</p>
    <ul className="dashboard-list">
      {getSafeObjectEntries(data).map(([profilo, details]) => (
        <li key={profilo}>
          <strong>{profilo}:</strong> {Number(details?.count) || 0}
          <div style={{ marginTop: 6 }}>
            <select defaultValue="" style={{ minWidth: 280 }}>
              <option value="" disabled>
                Seleziona applicativo_fornitore_versione
              </option>
              {(Array.isArray(details?.values) ? details.values : []).map((value) => (
                <option key={`${profilo}-${value}`} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const DropdownListBox = ({ label, placeholder, values }) => (
  <div className="dashboard-box dashboard-box-wide">
    <p className="dashboard-label">{label}</p>
    <select defaultValue="" style={{ minWidth: 280 }}>
      <option value="" disabled>
        {placeholder}
      </option>
      {(Array.isArray(values) ? values : []).map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  </div>
);

export default function Dashboard({ accessLevel }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refreshDashboard() {
    setLoading(true);
    setError("");
    try {
      const data = await apiJson("/data/dashboard", {
        method: "GET",
        accessLevel,
      });
      setStats(normalizeDashboardStats(data));
    } catch (err) {
      setError(err.message || "Errore durante il caricamento dashboard.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, [accessLevel]);

  return (
    <div className="card">
      <h2>Dashboard bando</h2>

      <button
        className="button secondary"
        onClick={refreshDashboard}
        disabled={loading}
      >
        {loading ? "Aggiornamento..." : "Aggiorna dashboard"}
      </button>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

      {stats && (
        <div className="dashboard-grid">
          <div className="dashboard-box">
            <p className="dashboard-label">Numero strutture aderenti</p>
            <p className="dashboard-value">{stats.total_strutture}</p>
          </div>

          <div className="dashboard-box">
            <p className="dashboard-label">Residuo fondi</p>
            <p className="dashboard-value">{formatCurrency(stats.residuo_fondi)}</p>
          </div>

          <div className="dashboard-box">
            <p className="dashboard-label">Totale fondi</p>
            <p className="dashboard-value">{formatCurrency(stats.totale_fondi)}</p>
          </div>

          <div className="dashboard-box">
            <p className="dashboard-label">Costo totale strutture</p>
            <p className="dashboard-value">{formatCurrency(stats.costo_totale_strutture)}</p>
          </div>

          <div className="dashboard-box dashboard-box-wide">
            <p className="dashboard-label">Conteggio compilazioni per tipologia documentale</p>
            <ul className="dashboard-list">
              {getSafeObjectEntries(stats?.compilazioni_per_tipologia_documentale).map(([tipologia, count]) => (
                <li key={tipologia}>
                  <strong>{tipologia}:</strong> {count}
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-box">
            <p className="dashboard-label">Fondi totali da erogare (Ammessi da Sviluppo Toscana)</p>
            <p className="dashboard-value">
              {formatCurrency(stats.fondi_totali_da_erogare_stato_1)}
            </p>
          </div>

          <SoftwareBox
            label="Software unici per profilo documentale (Ammessi da Sviluppo Toscana)"
            data={stats.software_unici_per_profilo_documentale_stato_1}
          />

          <div className="dashboard-box">
            <p className="dashboard-label">Fondi totali da erogare (In fase di accreditamento con Compliance Toscana)</p>
            <p className="dashboard-value">
              {formatCurrency(stats.fondi_totali_da_erogare_stato_2)}
            </p>
          </div>

          <SoftwareBox
            label="Software unici per profilo documentale (In fase di accreditamento con Compliance Toscana)"
            data={stats.software_unici_per_profilo_documentale_stato_2}
          />

          <div className="dashboard-box">
            <p className="dashboard-label">Totale richieste fuori bando</p>
            <p className="dashboard-value">{stats.totale_richieste_fuori_bando}</p>
          </div>

          <SoftwareBox
            label="Software unici per profilo documentale (Fuori bando)"
            data={stats.software_unici_per_profilo_documentale_stato_3}
          />

          <div className="dashboard-box">
            <p className="dashboard-label">Fondi totali da erogare (Accreditati con Compliance Toscana)</p>
            <p className="dashboard-value">
              {formatCurrency(stats.fondi_totali_da_erogare_stato_4)}
            </p>
          </div>

          <div className="dashboard-box">
            <p className="dashboard-label">Totale righe (Accreditati con Compliance Toscana)</p>
            <p className="dashboard-value">{stats.totale_righe_stato_4}</p>
          </div>

          <SoftwareBox
            label="Software unici per profilo documentale (Accreditati con Compliance Toscana)"
            data={stats.software_unici_per_profilo_documentale_stato_4}
          />

          <DropdownListBox
            label="Partite IVA (Accreditati con Compliance Toscana)"
            placeholder="Seleziona partita IVA"
            values={stats.partite_iva_stato_4}
          />

          <div className="dashboard-box">
            <p className="dashboard-label">Fondi totali da erogare (Impianti_avviati_in_produzione)</p>
            <p className="dashboard-value">
              {formatCurrency(stats.fondi_totali_da_erogare_stato_5)}
            </p>
          </div>

          <div className="dashboard-box">
            <p className="dashboard-label">Totale righe (Impianti_avviati_in_produzione)</p>
            <p className="dashboard-value">{stats.totale_righe_stato_5}</p>
          </div>

          <SoftwareBox
            label="Software unici per profilo documentale (Impianti_avviati_in_produzione)"
            data={stats.software_unici_per_profilo_documentale_stato_5}
          />

          <DropdownListBox
            label="Partite IVA (Impianti_avviati_in_produzione)"
            placeholder="Seleziona partita IVA"
            values={stats.partite_iva_stato_5}
          />
        </div>
      )}
    </div>
  );
}
