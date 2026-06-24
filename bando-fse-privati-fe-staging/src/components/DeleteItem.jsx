// DeleteItem.jsx content
import React, { useState } from "react";
import { deleteItemByPartitaIva } from "../api";

export default function DeleteItem() {
  const [itemId, setItemId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const trimmedId = itemId.trim();
    if (!trimmedId) {
      setError("Inserisci una Partita IVA valida.");
      return;
    }

    setLoading(true);

    try {
      await deleteItemByPartitaIva(trimmedId);
      setMessage("Riga eliminata con successo.");
      setItemId("");
    } catch (err) {
      setError(err.message || "Errore durante l'eliminazione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Elimina riga per Partita IVA</h2>

      <form onSubmit={handleDelete}>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Inserisci la partita IVA della struttura:</label>
            <input
              type="text"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder=""
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="button danger" type="submit" disabled={loading}>
            {loading ? "Elimino..." : "Elimina"}
          </button>
        </div>

        {message && (
          <p style={{ color: "green", marginTop: 8 }}>{message}</p>
        )}
        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
      </form>
    </div>
  );
}
