"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Modal, Field, FormFooter, inputClass } from "@/components/Modal";
import { postJson } from "@/lib/client";

export function NewPortfolioButton({ variant = "primary" }: { variant?: "primary" | "quiet" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("XAF");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await postJson<{ id: string }>("/api/portfolios", {
      name,
      currency,
      description: description || undefined,
    });
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    setOpen(false);
    router.push(`/portfolios/${res.data.id}`);
    router.refresh();
  }

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        + Nouveau portefeuille
      </Button>
      {open && (
        <Modal title="Nouveau portefeuille" onClose={() => setOpen(false)} onSubmit={handleSubmit}>
          <Field label="Nom">
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Épargne long terme" />
          </Field>
          <Field label="Devise" hint="Code à 3 lettres : XAF, EUR, USD…">
            <input required maxLength={3} value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Description (facultatif)">
            <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
          </Field>
          <FormFooter submitting={submitting} submitLabel="Créer" error={error} onClose={() => setOpen(false)} />
        </Modal>
      )}
    </>
  );
}
