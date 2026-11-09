"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Modal, Field, FormFooter, inputClass } from "@/components/Modal";
import { postJson } from "@/lib/client";
import { assetTypeLabels } from "@/lib/labels";

export function NewAssetButton({ portfolioId }: { portfolioId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState("stock");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await postJson("/api/assets", { portfolioId, name, symbol: symbol || undefined, type });
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    setOpen(false);
    setName("");
    setSymbol("");
    router.refresh();
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        + Ajouter un actif
      </Button>
      {open && (
        <Modal title="Nouvel actif" onClose={() => setOpen(false)} onSubmit={handleSubmit}>
          <Field label="Nom">
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Apple" />
          </Field>
          <Field label="Symbole (facultatif)" hint="Ex : AAPL, BTC. Laissez vide pour un bien non coté.">
            <input maxLength={20} value={symbol} onChange={(e) => setSymbol(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Type">
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              {Object.entries(assetTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-[11.5px] text-muted mb-4">
            L&apos;actif démarre à quantité 0. Enregistrez ensuite un achat pour renseigner la quantité et le prix moyen.
          </p>
          <FormFooter submitting={submitting} submitLabel="Ajouter" error={error} onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
