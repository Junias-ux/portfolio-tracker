import Link from "next/link";
import { PageHeader, Panel, Tag, Button } from "@/components/ui";
import { ValueLineChart } from "@/components/charts/ValueLineChart";
import { mockPortfolios, mockValueHistory } from "@/lib/mockData";
import { formatCurrency, formatPercentage } from "@/lib/format";

export default function DashboardPage() {
  const totalValue = mockPortfolios.reduce((sum, p) => sum + p.totalValue, 0);
  const totalGain = mockPortfolios.reduce((sum, p) => sum + p.unrealizedGain, 0);
  const totalGainPct = (totalGain / (totalValue - totalGain)) * 100;

  return (
    <div>
      <PageHeader title="Tableau de bord" />

      <p className="text-[13px] text-muted mb-1">Valeur totale, tous portefeuilles</p>
      <p className="font-serif text-[44px] sm:text-[52px] leading-none">
        {formatCurrency(totalValue, "XAF")}
      </p>
      <p className="text-[13px] text-muted mt-2">
        <span className={totalGain >= 0 ? "text-green" : "text-red"}>
          {totalGain >= 0 ? "▲" : "▼"} {formatPercentage(totalGainPct)} ({formatCurrency(totalGain, "XAF")})
        </span>{" "}
        depuis le début de l&apos;année
      </p>

      <Panel title="Évolution de la valeur" className="mt-8">
        <ValueLineChart data={mockValueHistory} />
      </Panel>

      <Panel title="Mes portefeuilles">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-ink">
              <th className="pb-2.5 font-medium">Nom</th>
              <th className="pb-2.5 font-medium">Devise</th>
              <th className="pb-2.5 font-medium text-right">Valeur</th>
              <th className="pb-2.5 font-medium text-right">Performance</th>
            </tr>
          </thead>
          <tbody>
            {mockPortfolios.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-none">
                <td className="py-3.5">
                  <Link href={`/portfolios/${p.id}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="py-3.5 text-muted">{p.currency}</td>
                <td className="py-3.5 text-right font-serif">{formatCurrency(p.totalValue, p.currency)}</td>
                <td className="py-3.5 text-right">
                  <Tag tone={p.unrealizedGainPct >= 0 ? "gain" : "loss"}>
                    {formatPercentage(p.unrealizedGainPct)}
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Button variant="quiet">+ Nouveau portefeuille</Button>
    </div>
  );
}
