import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader, Button } from "@/components/ui";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user: { fullName: string; email: string; defaultCurrency: string } | null =
    await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { fullName: true, email: true, defaultCurrency: true },
    });

  return (
    <div className="max-w-[440px]">
      <PageHeader title="Paramètres du compte" />
      <Field label="Nom complet" defaultValue={user?.fullName ?? ""} />
      <Field label="Email" defaultValue={user?.email ?? ""} />
      <Field label="Devise par défaut" defaultValue={user?.defaultCurrency ?? "XAF"} />
      {/* TODO : brancher sur une route PATCH /api/me — l'enregistrement n'est pas encore actif. */}
      <Button variant="primary" disabled>
        Enregistrer
      </Button>
      <div className="border-t border-line mt-7 pt-5">
        <Button variant="danger" disabled>
          Supprimer mon compte
        </Button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <input
        defaultValue={defaultValue}
        readOnly
        className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-panel"
      />
    </div>
  );
}
