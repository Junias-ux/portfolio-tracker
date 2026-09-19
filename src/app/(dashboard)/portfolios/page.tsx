import Link from "next/link";
import { PageHeader, Panel, Tag, Button } from "@/components/ui";
import { mockPortfolios } from "@/lib/mockData";
import { formatCurrency, formatPercentage } from "@/lib/format";

export default function PortfoliosPage() {
  return (
    <div>
      <PageHeader title="Mes portefeuilles" action={<Button variant="primary">+ Nouveau portefeuille</Button>} />
      <Panel>
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
    </div>
  );
}
