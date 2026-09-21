"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[360px]">
        <h1 className="font-serif text-[26px] mb-1.5">Ledger</h1>
        <p className="text-[13px] text-muted mb-8">Le patrimoine, tenu à jour.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Adresse email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Mot de passe</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
            />
          </div>

          {error && <p className="text-[12.5px] text-red">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>

        <div className="flex justify-between mt-4 text-[12.5px] text-muted">
          <Link href="/register" className="border-b border-line hover:border-ink">
            Créer un compte
          </Link>
          <Link href="#" className="border-b border-line hover:border-ink">
            Mot de passe oublié
          </Link>
        </div>
      </div>
    </div>
  );
}
