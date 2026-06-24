import React, { useState } from "react";
import { apiJson } from "../api";

const emptyForm = {
  Rappresentante_nomeRapp: "",
  Rappresentante_cognomeRapp: "",
  Rappresentante_PEC: "",
  Anagrafica_denominazione: "",
  Anagrafica_partitaIva: "",
  Anagrafica_tipoSoggetto: "",
  Anagrafica_provincia: "",
  Anagrafica_comune: "",
  Anagrafica_indirizzo: "",
  Anagrafica_cap: "",
  Anagrafica_telefonoRapp: "",
  Anagrafica_email: "",
  Anagrafica_accreditamento: true,
  Anagrafica_convenzioneSSR: false,
  Anagrafica_convenzioneASL: false,
  Anagrafica_numeroSedi: 1,
};

export default function ItemForm({ accessLevel, onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        Anagrafica_numeroSedi: Number(form.Anagrafica_numeroSedi || 0),
        Anagrafica_accreditamento: Boolean(form.Anagrafica_accreditamento),
        Anagrafica_convenzioneSSR: Boolean(form.Anagrafica_convenzioneSSR),
        Anagrafica_convenzioneASL: Boolean(form.Anagrafica_convenzioneASL),
      };
      const created = await apiJson("/data", {
        method: "POST",
        accessLevel,
        data: payload,
      });
      setSuccess(`Creato item con id ${created.id}`);
      setForm(emptyForm);
      onCreated?.(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Crea nuova struttura (POST /data)</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label>Nome Rappresentante</label>
            <input
              value={form.Rappresentante_nomeRapp}
              onChange={(e) =>
                updateField("Rappresentante_nomeRapp", e.target.value)
              }
              required
            />
          </div>
          <div className="field">
            <label>Cognome Rappresentante</label>
            <input
              value={form.Rappresentante_cognomeRapp}
              onChange={(e) =>
                updateField("Rappresentante_cognomeRapp", e.target.value)
              }
              required
            />
          </div>
          <div className="field">
            <label>PEC Rappresentante</label>
            <input
              type="email"
              value={form.Rappresentante_PEC}
              onChange={(e) => updateField("Rappresentante_PEC", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Denominazione struttura</label>
            <input
              value={form.Anagrafica_denominazione}
              onChange={(e) =>
                updateField("Anagrafica_denominazione", e.target.value)
              }
              required
            />
          </div>
          <div className="field">
            <label>Partita IVA</label>
            <input
              value={form.Anagrafica_partitaIva}
              onChange={(e) =>
                updateField("Anagrafica_partitaIva", e.target.value)
              }
              required
            />
          </div>
          <div className="field">
            <label>Tipo soggetto</label>
            <input
              value={form.Anagrafica_tipoSoggetto}
              onChange={(e) =>
                updateField("Anagrafica_tipoSoggetto", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Provincia</label>
            <input
              value={form.Anagrafica_provincia}
              onChange={(e) =>
                updateField("Anagrafica_provincia", e.target.value)
              }
              required
            />
          </div>
          <div className="field">
            <label>Comune</label>
            <input
              value={form.Anagrafica_comune}
              onChange={(e) =>
                updateField("Anagrafica_comune", e.target.value)
              }
              required
            />
          </div>
          <div className="field">
            <label>Indirizzo</label>
            <input
              value={form.Anagrafica_indirizzo}
              onChange={(e) =>
                updateField("Anagrafica_indirizzo", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>CAP</label>
            <input
              value={form.Anagrafica_cap}
              onChange={(e) => updateField("Anagrafica_cap", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Telefono Rappresentante</label>
            <input
              value={form.Anagrafica_telefonoRapp}
              onChange={(e) =>
                updateField("Anagrafica_telefonoRapp", e.target.value)
              }
              required
            />
          </div>
          <div className="field">
            <label>Email Struttura</label>
            <input
              type="email"
              value={form.Anagrafica_email}
              onChange={(e) =>
                updateField("Anagrafica_email", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Accreditamento</label>
            <select
              value={String(form.Anagrafica_accreditamento)}
              onChange={(e) =>
                updateField(
                  "Anagrafica_accreditamento",
                  e.target.value === "true"
                )
              }
            >
              <option value="true">Sì</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="field">
            <label>Convenzione SSR</label>
            <select
              value={String(form.Anagrafica_convenzioneSSR)}
              onChange={(e) =>
                updateField(
                  "Anagrafica_convenzioneSSR",
                  e.target.value === "true"
                )
              }
            >
              <option value="true">Sì</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="field">
            <label>Convenzione ASL</label>
            <select
              value={String(form.Anagrafica_convenzioneASL)}
              onChange={(e) =>
                updateField(
                  "Anagrafica_convenzioneASL",
                  e.target.value === "true"
                )
              }
            >
              <option value="true">Sì</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="field">
            <label>Numero sedi</label>
            <input
              type="number"
              min="1"
              value={form.Anagrafica_numeroSedi}
              onChange={(e) =>
                updateField("Anagrafica_numeroSedi", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? "Creazione..." : "Crea item"}
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
}
