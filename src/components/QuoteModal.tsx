"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Modal, Field, FormFooter, inputClass } from "@/components/Modal";
import { postJson } from "@/lib/client";

export function QuoteModal({ assetId, onClose }: { assetId: string; onClose: () => void }) {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await postJson("/api/quotes", { assetId, price: Number(price), quoteDate: date });
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <Modal title="Saisir un cours" onClose={onClose} onSubmit={handleSubmit}>
      <Field label="Prix actuel de l'unité" hint="Ressaisir une date déjà renseignée remplace le cours précédent.">
        <input required type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Date du cours">
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </Field>
      <FormFooter submitting={submitting} submitLabel="Enregistrer" error={error} onClose={onClose} />
    </Modal>
  );
}
