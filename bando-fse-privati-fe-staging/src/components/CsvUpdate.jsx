import React, { useState } from "react";
import { apiRequest } from "../api";

export default function CsvUpdate({ accessLevel }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiRequest("/data/update-from-csv", {
        method: "POST",
        accessLevel,
        body: formData,
      });

      setMessage("Aggiornamento da CSV completato.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Update da CSV</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div style={{ marginTop: 8 }}>
          <button className="button primary" type="submit" disabled={!file || loading}>
            {loading ? "Aggiornamento..." : "Aggiorna da CSV"}
          </button>
        </div>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <p style={{ fontSize: "0.8rem", marginTop: 8 }}>
      </p>
    </div>
  );
}
