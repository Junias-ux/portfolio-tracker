import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPortfolioSummaries } from "@/lib/data";
import { PageHeader, Panel, Tag } from "@/components/ui";
import { NewPortfolioButton } from "@/components/NewPortfolioButton";
import { formatCurrency, formatPercentage } from "@/lib/format";

export default async function PortfoliosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const portfolios = await getPortfolioSummaries(session.user.id);

  return (
    <div>
      <PageHeader title="Mes portefeuilles" action={<NewPortfolioButton />} />
      <Panel>
        {portfolios.length === 0 ? (
          <p className="text-sm text-muted">Aucun portefeuille pour le moment.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-ink">
                <th className="pb-2.5 font-medium">Nom</th>
                <th className="pb-2.5 font-medium">Devise</th>
                <th className="pb-2.5 font-medium text-right">Actifs</th>
                <th className="pb-2.5 font-medium text-right">Valeur</th>
                <th className="pb-2.5 font-medium text-right">Performance</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-none">
                  <td className="py-3.5">
                    <Link href={`/portfolios/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3.5 text-muted">{p.currency}</td>
                  <td className="py-3.5 text-right font-serif">{p.assetCount}</td>
                  <td className="py-3.5 text-right font-serif">{formatCurrency(p.totalValue, p.currency)}</td>
                  <td className="py-3.5 text-right">
                    <Tag tone={p.gainPct >= 0 ? "gain" : "loss"}>{formatPercentage(p.gainPct)}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
