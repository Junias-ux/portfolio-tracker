import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAssetDetail } from "@/lib/data";
import { canWrite } from "@/lib/access";
import { PageHeader, Panel, StatStrip, StatCell, Tag } from "@/components/ui";
import { ValueLineChart } from "@/components/charts/ValueLineChart";
import { AssetActions } from "@/components/AssetActions";
import { transactionTypeLabels } from "@/lib/labels";
import { formatNumber, formatPercentage, formatDate } from "@/lib/format";

export default async function AssetDetailPage({
  params,
}: {
  params: { id: string; assetId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const detail = await getAssetDetail(session.user.id, params.id, params.assetId);
  if (!detail) notFound();

  const { asset, transactions, quotes, access, currency } = detail;

  return (
    <div>
      <PageHeader
        title={`${asset.name}${asset.symbol ? ` (${asset.symbol})` : ""}`}
        action={canWrite(access) ? <AssetActions assetId={asset.id} /> : undefined}
      />

      <StatStrip>
        <StatCell label="Quantité détenue" value={formatNumber(asset.quantityHeld, 8)} />
        <StatCell label={`Prix moyen d'achat (${currency})`} value={formatNumber(asset.averageCost)} />
        <StatCell
          label="Plus-value latente"
          value={formatPercentage(asset.gainPct)}
          tone={asset.gainPct >= 0 ? "gain" : "loss"}
        />
      </StatStrip>

      {!asset.hasQuote && (
        <p className="text-[12.5px] text-muted mb-6">
          Aucun cours saisi : la valeur est calculée au prix moyen d&apos;achat, donc la plus-value reste à 0 tant que
          vous n&apos;avez pas saisi un cours.
        </p>
      )}

      <Panel title="Évolution du cours">
        {quotes.length >= 2 ? (
          <ValueLineChart data={quotes.map((q) => ({ date: formatDate(q.date), value: q.price }))} />
        ) : (
          <p className="text-sm text-muted">Saisissez au moins deux cours à des dates différentes pour voir la courbe.</p>
        )}
      </Panel>

      <Panel title="Historique des transactions">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted">Aucune transaction pour le moment.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted border-b border-ink">
                <th className="pb-2.5 font-medium">Date</th>
                <th className="pb-2.5 font-medium">Type</th>
                <th className="pb-2.5 font-medium text-right">Quantité</th>
                <th className="pb-2.5 font-medium text-right">Prix / montant</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const isTrade = t.type === "buy" || t.type === "sell";
                return (
                  <tr key={t.id} className="border-b border-line last:border-none">
                    <td className="py-3.5">{formatDate(t.date)}</td>
                    <td className="py-3.5">
                      <Tag>{transactionTypeLabels[t.type] ?? t.type}</Tag>
                    </td>
                    <td className="py-3.5 text-right font-serif">{isTrade ? formatNumber(t.quantity, 8) : "—"}</td>
                    <td className="py-3.5 text-right font-serif">{formatNumber(t.unitPrice)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
