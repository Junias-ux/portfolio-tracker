"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui";

const TYPES = [
  { value: "buy", label: "Achat" },
  { value: "sell", label: "Vente" },
  { value: "dividend", label: "Dividende" },
  { value: "deposit", label: "Dépôt" },
  { value: "withdrawal", label: "Retrait" },
] as const;

export function TransactionModal({ assetId, onClose }: { assetId: string; onClose: () => void }) {
  const [type, setType] = useState<(typeof TYPES)[number]["value"]>("buy");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          type,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          transactionDate: date,
          note: note || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Impossible d'enregistrer la transaction.");
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] bg-panel border border-ink p-7"
      >
        <h2 className="font-serif text-lg mb-5">Nouvelle transaction</h2>

        <div className="flex border border-line rounded-[3px] overflow-hidden mb-5 text-xs">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setType(t.value)}
              className={`flex-1 py-2 border-r border-line last:border-none ${
                type === t.value ? "bg-green text-white" : "text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Field label="Quantité">
          <input
            required
            type="number"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0,00"
            className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-bg"
          />
        </Field>

        <Field label="Prix unitaire">
          <input
            required
            type="number"
            step="any"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="0,00"
            className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-bg"
          />
        </Field>

        <Field label="Date">
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-bg"
          />
        </Field>

        <Field label="Note (facultatif)">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-bg"
          />
        </Field>

        {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}

        <div className="flex gap-2.5 mt-2">
          <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
            {submitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Button type="button" variant="quiet" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}
