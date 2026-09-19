import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Panel, StatStrip, StatCell, Tag, Button } from "@/components/ui";
import { mockPortfolios, mockAssets, assetTypeLabels } from "@/lib/mockData";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const portfolio = mockPortfolios.find((p) => p.id === params.id);
  const assets = mockAssets[params.id] ?? [];

  if (!portfolio) notFound();

  return (
    <div>
      <PageHeader
        title={portfolio.name}
        action={<Button variant="primary">+ Ajouter un actif</Button>}
      />

      <StatStrip>
        <StatCell label="Valeur actuelle" value={formatCurrency(portfolio.totalValue, portfolio.currency)} />
        <StatCell label="Investi" value={formatCurrency(portfolio.totalInvested, portfolio.currency)} />
        <StatCell
          label="Plus-value"
          value={formatCurrency(portfolio.unrealizedGain, portfolio.currency)}
          tone={portfolio.unrealizedGain >= 0 ? "gain" : "loss"}
        />
      </StatStrip>

      <Panel title="Actifs du portefeuille">
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
            {assets.map((a) => {
              const currentValue = a.quantityHeld * a.currentPrice;
              const gainPct = ((a.currentPrice - a.averageCost) / a.averageCost) * 100;
              return (
                <tr key={a.id} className="border-b border-line last:border-none">
                  <td className="py-3.5">
                    <Link href={`/portfolios/${portfolio.id}/assets/${a.id}`} className="hover:underline">
                      {a.name} {a.symbol && <span className="text-muted">({a.symbol})</span>}
                    </Link>
                  </td>
                  <td className="py-3.5 text-muted">{assetTypeLabels[a.type]}</td>
                  <td className="py-3.5 text-right font-serif">{formatNumber(a.quantityHeld)}</td>
                  <td className="py-3.5 text-right font-serif">{formatNumber(a.averageCost)}</td>
                  <td className="py-3.5 text-right font-serif">{formatNumber(currentValue)}</td>
                  <td className="py-3.5 text-right">
                    <Tag tone={gainPct >= 0 ? "gain" : "loss"}>{formatPercentage(gainPct)}</Tag>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
