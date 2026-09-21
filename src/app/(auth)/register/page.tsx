"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    // Compte créé : on connecte directement l'utilisateur, sans lui
    // redemander ses identifiants juste après les avoir saisis.
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[360px]">
        <h1 className="font-serif text-[26px] mb-1.5">Créer un compte</h1>
        <p className="text-[13px] text-muted mb-8">Quelques informations pour commencer.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Nom complet</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Adresse email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Mot de passe</label>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
            />
            <p className="text-[11px] text-muted mt-1">8 caractères minimum.</p>
          </div>

          {error && <p className="text-[12.5px] text-red">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Création…" : "Créer mon compte"}
          </Button>
        </form>

        <div className="mt-4 text-[12.5px] text-muted">
          Déjà un compte ?{" "}
          <Link href="/login" className="border-b border-line hover:border-ink">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
