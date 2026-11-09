import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPortfolioDetail } from "@/lib/data";
import { canWrite } from "@/lib/access";
import { PageHeader, Panel, StatStrip, StatCell, Tag } from "@/components/ui";
import { NewAssetButton } from "@/components/NewAssetButton";
import { assetTypeLabels } from "@/lib/labels";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";

export default async function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const detail = await getPortfolioDetail(session.user.id, params.id);
  if (!detail) notFound();

  const { portfolio, assets, access } = detail;

  return (
    <div>
      <PageHeader
        title={portfolio.name}
        action={canWrite(access) ? <NewAssetButton portfolioId={portfolio.id} /> : undefined}
      />

      <StatStrip>
        <StatCell label="Valeur actuelle" value={formatCurrency(portfolio.totalValue, portfolio.currency)} />
        <StatCell label="Investi" value={formatCurrency(portfolio.totalInvested, portfolio.currency)} />
        <StatCell
          label="Plus-value latente"
          value={formatCurrency(portfolio.gain, portfolio.currency)}
          tone={portfolio.gain >= 0 ? "gain" : "loss"}
        />
      </StatStrip>

      <Panel title="Actifs du portefeuille">
        {assets.length === 0 ? (
          <p className="text-sm text-muted">Aucun actif. Ajoutez-en un pour commencer.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-ink">
                <th className="pb-2.5 font-medium">Actif</th>
                <th className="pb-2.5 font-medium">Type</th>
                <th className="pb-2.5 font-medium text-right">Quantité</th>
                <th className="pb-2.5 font-medium text-right">PRU</th>
                <th className="pb-2.5 font-medium text-right">Valeur</th>
                <th className="pb-2.5 font-medium text-right">Plus-value</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-none">
                  <td className="py-3.5">
                    <Link href={`/portfolios/${portfolio.id}/assets/${a.id}`} className="hover:underline">
                      {a.name} {a.symbol && <span className="text-muted">({a.symbol})</span>}
                    </Link>
                  </td>
                  <td className="py-3.5 text-muted">{assetTypeLabels[a.type] ?? a.type}</td>
                  <td className="py-3.5 text-right font-serif">{formatNumber(a.quantityHeld, 8)}</td>
                  <td className="py-3.5 text-right font-serif">{formatNumber(a.averageCost)}</td>
                  <td className="py-3.5 text-right font-serif">{formatNumber(a.currentValue)}</td>
                  <td className="py-3.5 text-right">
                    <Tag tone={a.gainPct >= 0 ? "gain" : "loss"}>{formatPercentage(a.gainPct)}</Tag>
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
