"use client";

import { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui";

export const inputClass = "w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-bg";

export function Modal({
  title,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
        className="w-full max-w-[420px] bg-panel border border-ink p-7"
      >
        <h2 className="font-serif text-lg mb-5">{title}</h2>
        {children}
      </form>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted mt-1">{hint}</p>}
    </div>
  );
}

export function FormFooter({
  submitting,
  submitLabel,
  error,
  onClose,
}: {
  submitting: boolean;
  submitLabel: string;
  error: string | null;
  onClose: () => void;
}) {
  return (
    <>
      {error && <p className="text-[12.5px] text-red mb-3">{error}</p>}
      <div className="flex gap-2.5 mt-2">
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? "Enregistrement…" : submitLabel}
        </Button>
        <Button type="button" variant="quiet" className="flex-1" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </>
  );
}
