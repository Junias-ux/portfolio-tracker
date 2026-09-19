import Link from "next/link";
import { Button } from "@/components/ui/index";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[360px]">
        <h1 className="font-serif text-[26px] mb-1.5">Ledger</h1>
        <p className="text-[13px] text-muted mb-8">Le patrimoine, tenu à jour.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Adresse email</label>
            <input
              type="email"
              placeholder="vous@exemple.com"
              className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Se connecter
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
