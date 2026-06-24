import { useState } from "react";
import { getApiBase } from "../api";

export default function CsvExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleExport = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${getApiBase()}/data/export-csv`, {
        method: "GET",
        headers: {
          "X-Access-Level": "reader",
        },
      });

      if (!res.ok) {
        throw new Error(`Errore ${res.status}: ${res.statusText}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "data_export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess("Esportazione completata");
    } catch (err) {
      setError(err.message || "Errore durante l'esportazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Esporta CSV</h2>
      <p className="hint">Scarica i dati in formato CSV.</p>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <button className="button" onClick={handleExport} disabled={loading}>
        {loading ? "Esportazione in corso..." : "Esporta CSV"}
      </button>
    </section>
  );
}
