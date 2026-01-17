import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api/client";
import type { Report, Sample, UIStatus, Variant } from "./types";
import "./App.css";

type CreateSamplePayload = { name: string; variants: Variant[] };

export default function App() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [variants, setVariants] = useState<Variant[]>([]);

  const [preview, setPreview] = useState<Report | null>(null);
  const [savedReport, setSavedReport] = useState<Report | null>(null);

  const [status, setStatus] = useState<UIStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const requestSeq = useRef(0);

  const selectedSample = useMemo(
    () => samples.find((s) => s.id === selectedSampleId) ?? null,
    [samples, selectedSampleId]
  );

  async function loadSamples() {
    setStatus("loading");
    setError(null);
    try {
      const data = await api<Sample[]>("/samples");
      setSamples(data);
      setStatus("success");
    } catch (e: any) {
      setStatus("error");
      setError(e.message ?? "Erro ao carregar amostras");
    }
  }

  useEffect(() => {
    loadSamples();
  }, []);

  async function selectSample(sampleId: string) {
    setSelectedSampleId(sampleId);

    const s = samples.find((x) => x.id === sampleId);
    if (s) {
      setName(s.name);
      setVariants(s.variants);
    }

    setPreview(null);

    const mySeq = ++requestSeq.current;
    setStatus("loading");
    setError(null);

    try {
      const rep = await api<Report>(`/reports/${sampleId}`);
      if (requestSeq.current !== mySeq) return;
      setSavedReport(rep);
      setStatus("success");
    } catch {
      if (requestSeq.current !== mySeq) return;
      setSavedReport(null);
      setStatus("success");
    }
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { id: "chr1-154548-A-G", gene: "BRCA1", classification: "Patogênico" },
    ]);
  }

  function updateVariant(index: number, patch: Partial<Variant>) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveSample() {
    setStatus("loading");
    setError(null);

    const payload: CreateSamplePayload = { name, variants };

    try {
      const created = await api<Sample>("/samples", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await loadSamples();
      setSelectedSampleId(created.id);
      setPreview(null);
      setSavedReport(null);
      setStatus("success");
    } catch (e: any) {
      setStatus("error");
      setError(e.message ?? "Erro ao salvar amostra");
    }
  }

  async function generatePreview() {
    if (!selectedSampleId) {
      setStatus("error");
      setError("Selecione uma amostra primeiro.");
      return;
    }

    const mySeq = ++requestSeq.current;
    setStatus("loading");
    setError(null);

    try {
      const rep = await api<Report>("/reports/previa", {
        method: "POST",
        body: JSON.stringify({ sampleId: selectedSampleId, notes }),
      });
      if (requestSeq.current !== mySeq) return;
      setPreview(rep);
      setStatus("success");
    } catch (e: any) {
      if (requestSeq.current !== mySeq) return;
      setStatus("error");
      setError(e.message ?? "Erro ao gerar prévia");
    }
  }

  async function generateFinal() {
    if (!selectedSampleId) {
      setStatus("error");
      setError("Selecione uma amostra primeiro.");
      return;
    }

    const mySeq = ++requestSeq.current;
    setStatus("loading");
    setError(null);

    try {
      const rep = await api<Report>("/reports", {
        method: "POST",
        body: JSON.stringify({ sampleId: selectedSampleId, notes }),
      });
      if (requestSeq.current !== mySeq) return;
      setSavedReport(rep);
      setPreview(null);
      setStatus("success");
    } catch (e: any) {
      if (requestSeq.current !== mySeq) return;
      setStatus("error");
      setError(e.message ?? "Erro ao gerar laudo final");
    }
  }

  async function fetchSaved() {
    if (!selectedSampleId) {
      setStatus("error");
      setError("Selecione uma amostra primeiro.");
      return;
    }

    const mySeq = ++requestSeq.current;
    setStatus("loading");
    setError(null);

    try {
      const rep = await api<Report>(`/reports/${selectedSampleId}`);
      if (requestSeq.current !== mySeq) return;
      setSavedReport(rep);
      setStatus("success");
    } catch (e: any) {
      if (requestSeq.current !== mySeq) return;
      setSavedReport(null);
      setStatus("error");
      setError("Não existe laudo salvo para essa amostra.");
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebarHeader">
          <h2>Amostras</h2>
          <button onClick={loadSamples}>Recarregar</button>
        </div>

        <div className="samplesList">
          {samples.length === 0 ? (
            <div className="muted">Nenhuma amostra criada ainda.</div>
          ) : (
            samples.map((s) => (
              <button
                key={s.id}
                className={s.id === selectedSampleId ? "sampleItem active" : "sampleItem"}
                onClick={() => selectSample(s.id)}
              >
                <div className="sampleName">{s.name}</div>
                <div className="sampleId">{s.id}</div>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>Laboratório</h1>
          <div className="status">
            <span>{status}</span>
            {error ? <span className="error">{error}</span> : null}
          </div>
        </header>

        <div className="grid">
          <section className="card">
            <h2>Formulário</h2>

            <label>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Amostra A" />

            <div className="row">
              <h3>Variantes</h3>
              <button onClick={addVariant}>Adicionar</button>
            </div>

            {variants.length === 0 ? (
              <div className="muted">Adicione ao menos uma variante.</div>
            ) : (
              <div className="variants">
                {variants.map((v, i) => (
                  <div className="variantRow" key={i}>
                    <input
                      value={v.id}
                      onChange={(e) => updateVariant(i, { id: e.target.value })}
                      placeholder="chr1-154548-A-G"
                    />
                    <input
                      value={v.gene}
                      onChange={(e) => updateVariant(i, { gene: e.target.value })}
                      placeholder="BRCA1"
                    />
                    <select
                      value={v.classification}
                      onChange={(e) => updateVariant(i, { classification: e.target.value as any })}
                    >
                      <option value="Patogênico">Patogênico</option>
                      <option value="Benigno">Benigno</option>
                      <option value="VUS">VUS</option>
                    </select>
                    <button onClick={() => removeVariant(i)}>Remover</button>
                  </div>
                ))}
              </div>
            )}

            <label>Observações (obrigatório)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Triagem fictícia para fins educacionais."
            />

            <div className="actions">
              <button onClick={saveSample}>Salvar amostra</button>
              <button onClick={generatePreview} disabled={!selectedSampleId}>
                Gerar prévia do laudo
              </button>
              <button onClick={generateFinal} disabled={!selectedSampleId}>
                Gerar laudo final
              </button>
              <button onClick={fetchSaved} disabled={!selectedSampleId}>
                Buscar laudo salvo
              </button>
            </div>
          </section>

          <section className="card">
            <h2>Detalhes</h2>

            <h3>Amostra selecionada</h3>
            <pre>{JSON.stringify(selectedSample, null, 2)}</pre>

            <h3>Prévia</h3>
            <pre>{JSON.stringify(preview, null, 2)}</pre>

            <h3>Laudo salvo</h3>
            <pre>{JSON.stringify(savedReport, null, 2)}</pre>
          </section>
        </div>
      </main>
    </div>
  );
}
