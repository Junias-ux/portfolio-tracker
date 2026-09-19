export function AllocationBar({
  type,
  target,
  actual,
}: {
  type: string;
  target: number;
  actual: number;
}) {
  const drifted = Math.abs(actual - target) >= 5;
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-1.5">
        <span>{type}</span>
        <span className={drifted ? "text-red" : "text-ink"}>
          {actual} % <span className="text-muted">/ cible {target} %</span>
        </span>
      </div>
      <div className="relative h-1.5 bg-line">
        <div
          className={`absolute inset-y-0 left-0 ${drifted ? "bg-red" : "bg-green"}`}
          style={{ width: `${actual}%` }}
        />
        <div className="absolute -top-1 w-0.5 h-3.5 bg-ink" style={{ left: `${target}%` }} />
      </div>
    </div>
  );
}
