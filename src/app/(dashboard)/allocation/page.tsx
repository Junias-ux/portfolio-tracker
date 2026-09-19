import { PageHeader, Panel, Button } from "@/components/ui/index";
import { AllocationBar } from "@/components/charts/AllocationBar";
import { mockAllocation } from "@/lib/mockData";

export default function AllocationPage() {
  return (
    <div>
      <PageHeader title="Objectifs d'allocation" action={<Button variant="quiet">Modifier</Button>} />
      <Panel>
        {mockAllocation.map((a) => (
          <AllocationBar key={a.type} type={a.type} target={a.target} actual={a.actual} />
        ))}
        <p className="text-xs text-muted mt-2">
          Le repère vertical marque la cible ; la barre pleine montre la répartition réelle.
        </p>
      </Panel>
    </div>
  );
}
