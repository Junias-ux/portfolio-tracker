import { PageHeader, Button } from "@/components/ui";
import { mockUser } from "@/lib/mockData";

export default function SettingsPage() {
  return (
    <div className="max-w-[440px]">
      <PageHeader title="Paramètres du compte" />
      <Field label="Nom complet" defaultValue={mockUser.fullName} />
      <Field label="Email" defaultValue={mockUser.email} />
      <Field label="Devise par défaut" defaultValue={mockUser.defaultCurrency} />
      <Button variant="primary">Enregistrer</Button>
      <div className="border-t border-line mt-7 pt-5">
        <Button variant="danger">Supprimer mon compte</Button>
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
        className="w-full border border-line rounded-[3px] px-3 py-2.5 text-sm bg-bg"
      />
    </div>
  );
}
