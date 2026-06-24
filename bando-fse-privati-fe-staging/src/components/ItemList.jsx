// ItemList.jsx content
import React, { useMemo, useState } from "react";
import { apiJson, deleteItemById } from "../api";

function formatBoolean(value) {
  if (value === true) return "Sì";
  if (value === false) return "No";
  return "-";
}

export default function ItemList({ accessLevel }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingPartitaIva, setDeletingPartitaIva] = useState(null);
  const [filters, setFilters] = useState({
    id: "",
    denominazione: "",
    partitaIva: "",
    comune: "",
    repositoryProprietario: "",
    statoMonitoraggio: "",
  });

  const filteredItems = useMemo(() => {
    const normalize = (value) => String(value ?? "").toLowerCase().trim();

    return items.filter((item) =>
      normalize(item.id).includes(normalize(filters.id)) &&
      normalize(item.Anagrafica_denominazione).includes(normalize(filters.denominazione)) &&
      normalize(item.Anagrafica_partitaIva).includes(normalize(filters.partitaIva)) &&
      normalize(item.Anagrafica_comune).includes(normalize(filters.comune)) &&
      normalize(formatBoolean(item.AltreInformazioni_conservazioneDigitale)).includes(normalize(filters.repositoryProprietario)) &&
      normalize(item.stato_monitoraggio).includes(normalize(filters.statoMonitoraggio)),
    );
  }, [items, filters]);
  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const data = await apiJson("/data", {
        method: "GET",
        accessLevel,
      });
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(itemId) {
    setError("");
    setDeletingPartitaIva(itemId);
    try {
      await deleteItemById(itemId);
      setItems((prev) => prev.filter((it) => it.Anagrafica_partitaIva !== itemId));
    } catch (err) {
      setError(err.message || "Errore durante l'eliminazione.");
    } finally {
      setDeletingPartitaIva(null);
    }
  }

  return (
    <div className="card">
      <h2>Lista strutture (GET /data)</h2>

      <button
        className="button secondary"
        onClick={loadItems}
        disabled={loading}
      >
        {loading ? "Caricamento..." : "Ricarica elenco"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(220px, 1fr))", gap: 8 }}>
        <input
          type="text"
          placeholder="Filtra ID"
          value={filters.id}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, id: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filtra Denominazione"
          value={filters.denominazione}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, denominazione: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filtra P.IVA"
          value={filters.partitaIva}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, partitaIva: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filtra Comune"
          value={filters.comune}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, comune: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filtra Repository Proprietario"
          value={filters.repositoryProprietario}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, repositoryProprietario: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filtra stato_monitoraggio"
          value={filters.statoMonitoraggio}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, statoMonitoraggio: event.target.value }))
          }
        />
      </div>

      {filteredItems.length > 0 && (
        <div style={{ maxHeight: 400, overflow: "auto", marginTop: 8 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Denominazione</th>
                <th>P.IVA</th>
                <th>Comune</th>
                <th>Repository Proprietario</th>
                <th>stato_monitoraggio</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.Anagrafica_denominazione}</td>
                  <td>{it.Anagrafica_partitaIva}</td>
                  <td>{it.Anagrafica_comune}</td>
                  <td>{formatBoolean(it.AltreInformazioni_conservazioneDigitale)}</td>
                  <td>{it.stato_monitoraggio ?? "-"}</td>
                  <td>
                    {accessLevel === "admin" ? (
                      <button
                        className="button danger"
                        onClick={() => handleDelete(it.Anagrafica_partitaIva)}
                        disabled={deletingPartitaIva === it.Anagrafica_partitaIva}
                      >
                        {deletingPartitaIva === it.Anagrafica_partitaIva
                          ? "Elimino..."
                          : "Elimina"}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length === 0 && !loading && <p>Nessun item caricato.</p>}
      {items.length > 0 && filteredItems.length === 0 && (
        <p>Nessuna struttura corrisponde ai filtri selezionati.</p>
      )}
    </div>
  );
}
