import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPortfolioSummaries } from "@/lib/data";
import { PageHeader, Panel, Tag } from "@/components/ui";
import { NewPortfolioButton } from "@/components/NewPortfolioButton";
import { formatCurrency, formatPercentage } from "@/lib/format";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const portfolios = await getPortfolioSummaries(session.user.id);

  // Des portefeuilles en devises différentes ne s'additionnent pas (la
  // conversion multi-devises est prévue en V3) : un total par devise.
  const totals = new Map<string, { value: number; invested: number }>();
  for (const p of portfolios) {
    const t = totals.get(p.currency) ?? { value: 0, invested: 0 };
    t.value += p.totalValue;
    t.invested += p.totalInvested;
    totals.set(p.currency, t);
  }
  const totalEntries = Array.from(totals.entries());

  return (
    <div>
      <PageHeader title="Tableau de bord" />

      {portfolios.length === 0 ? (
        <Panel>
          <p className="text-sm text-muted mb-4">
            Vous n&apos;avez pas encore de portefeuille. Créez-en un, puis ajoutez-y vos actifs et vos transactions.
          </p>
          <NewPortfolioButton />
        </Panel>
      ) : (
        <>
          {totalEntries.map(([currency, t], i) => {
            const gain = t.value - t.invested;
            const pct = t.invested === 0 ? 0 : (gain / t.invested) * 100;
            return (
              <div key={currency} className={i === 0 ? "" : "mt-6"}>
                <p className="text-[13px] text-muted mb-1">
                  Valeur totale{totalEntries.length > 1 ? ` — ${currency}` : ", tous portefeuilles"}
                </p>
                <p className={`font-serif leading-none ${i === 0 ? "text-[44px] sm:text-[52px]" : "text-[32px]"}`}>
                  {formatCurrency(t.value, currency)}
                </p>
                <p className="text-[13px] text-muted mt-2">
                  <span className={gain >= 0 ? "text-green" : "text-red"}>
                    {gain >= 0 ? "▲" : "▼"} {formatPercentage(pct)} ({formatCurrency(gain, currency)})
                  </span>{" "}
                  de plus-value latente
                </p>
              </div>
            );
          })}

          <Panel title="Mes portefeuilles" className="mt-8">
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
                {portfolios.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-none">
                    <td className="py-3.5">
                      <Link href={`/portfolios/${p.id}`} className="hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3.5 text-muted">{p.currency}</td>
                    <td className="py-3.5 text-right font-serif">{formatCurrency(p.totalValue, p.currency)}</td>
                    <td className="py-3.5 text-right">
                      <Tag tone={p.gainPct >= 0 ? "gain" : "loss"}>{formatPercentage(p.gainPct)}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <NewPortfolioButton variant="quiet" />
        </>
      )}
    </div>
  );
}
