import { PageHeader, Panel, StatStrip, StatCell } from "@/components/ui/index";
import { BenchmarkLineChart } from "@/components/charts/BenchmarkLineChart";
import { mockBenchmarkHistory } from "@/lib/mockData";
import { formatPercentage } from "@/lib/format";

export default function BenchmarkPage() {
  return (
    <div>
      <PageHeader
        title="Comparaison à un indice"
        action={
          <select className="border border-line rounded-[3px] px-3 py-2 text-sm bg-bg">
            <option>S&amp;P 500</option>
          </select>
        }
      />
      <Panel title="Base 100 — portefeuille vs indice">
        <BenchmarkLineChart data={mockBenchmarkHistory} />
      </Panel>
      <StatStrip>
        <StatCell label="Performance portefeuille" value={formatPercentage(8.1)} tone="gain" />
        <StatCell label="Performance S&P 500" value={formatPercentage(11.4)} tone="gain" />
      </StatStrip>
    </div>
  );
}
