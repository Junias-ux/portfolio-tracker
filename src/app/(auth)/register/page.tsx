import Link from "next/link";
import { Button } from "@/components/ui";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[360px]">
        <h1 className="font-serif text-[26px] mb-1.5">Créer un compte</h1>
        <p className="text-[13px] text-muted mb-8">Quelques informations pour commencer.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Nom complet</label>
            <input className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Adresse email</label>
            <input type="email" className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Mot de passe</label>
            <input type="password" className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel" />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Créer mon compte
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
