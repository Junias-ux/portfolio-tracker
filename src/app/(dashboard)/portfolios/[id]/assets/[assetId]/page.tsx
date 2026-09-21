"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { PageHeader, Panel, StatStrip, StatCell, Button, Tag } from "@/components/ui";
import { ValueLineChart } from "@/components/charts/ValueLineChart";
import { TransactionModal } from "@/components/TransactionModal";
import { mockAssets, mockTransactions, mockValueHistory } from "@/lib/mockData";
import { formatCurrency, formatNumber, formatPercentage, formatDate } from "@/lib/format";

const TRANSACTION_LABELS: Record<string, string> = {
  buy: "Achat",
  sell: "Vente",
  dividend: "Dividende",
  deposit: "Dépôt",
  withdrawal: "Retrait",
  fee: "Frais",
};

export default function AssetDetailPage({ params }: { params: { id: string; assetId: string } }) {
  const [modalOpen, setModalOpen] = useState(false);
  const asset = mockAssets[params.id]?.find((a) => a.id === params.assetId);
  const transactions = mockTransactions[params.assetId] ?? [];

  if (!asset) notFound();

  const gainPct = ((asset.currentPrice - asset.averageCost) / asset.averageCost) * 100;

  return (
    <div>
      <PageHeader
        title={`${asset.name}${asset.symbol ? ` (${asset.symbol})` : ""}`}
        action={<Button variant="primary" onClick={() => setModalOpen(true)}>+ Nouvelle transaction</Button>}
      />

      <StatStrip>
        <StatCell label="Quantité détenue" value={formatNumber(asset.quantityHeld)} />
        <StatCell label="Prix moyen d'achat" value={formatNumber(asset.averageCost)} />
        <StatCell label="Plus-value latente" value={formatPercentage(gainPct)} tone={gainPct >= 0 ? "gain" : "loss"} />
      </StatStrip>

      <Panel title="Évolution du cours">
        <ValueLineChart data={mockValueHistory} />
      </Panel>

      <Panel title="Historique des transactions">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-ink">
              <th className="pb-2.5 font-medium">Date</th>
              <th className="pb-2.5 font-medium">Type</th>
              <th className="pb-2.5 font-medium text-right">Quantité</th>
              <th className="pb-2.5 font-medium text-right">Prix</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-line last:border-none">
                <td className="py-3.5">{formatDate(t.date)}</td>
                <td className="py-3.5">
                  <Tag>{TRANSACTION_LABELS[t.type]}</Tag>
                </td>
                <td className="py-3.5 text-right font-serif">{t.quantity !== null ? formatNumber(t.quantity) : "—"}</td>
                <td className="py-3.5 text-right font-serif">{t.unitPrice !== null ? formatNumber(t.unitPrice) : "—"}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted">
                  Aucune transaction pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      {modalOpen && (
        <TransactionModal assetId={params.assetId} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
