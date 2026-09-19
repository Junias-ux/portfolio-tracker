import { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "default",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" | "quiet" | "danger" }) {
  const base = "text-sm font-medium px-4 py-2 rounded-[3px] border transition-colors";
  const variants: Record<string, string> = {
    default: "border-ink text-ink bg-transparent hover:bg-ink/5",
    primary: "border-green bg-green text-white hover:bg-green/90",
    quiet: "border-line text-muted bg-transparent hover:bg-line/20",
    danger: "border-red text-red bg-transparent hover:bg-red/5",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "gain" | "loss" | "neutral" }) {
  const tones: Record<string, string> = {
    gain: "bg-green-soft text-green",
    loss: "bg-red-soft text-red",
    neutral: "border border-line text-muted",
  };
  return <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>;
}

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`border border-line bg-panel p-6 mb-6 ${className}`}>
      {title && <p className="text-[13px] text-muted mb-4">{title}</p>}
      {children}
    </div>
  );
}

export function StatStrip({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-3 border border-line mb-7">{children}</div>;
}

export function StatCell({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "gain" | "loss" | "neutral" }) {
  const toneClass = tone === "gain" ? "text-green" : tone === "loss" ? "text-red" : "text-ink";
  return (
    <div className="p-5 border-b sm:border-b-0 sm:border-r border-line last:border-none">
      <div className="text-xs text-muted mb-1.5">{label}</div>
      <div className={`font-serif text-[22px] ${toneClass}`}>{value}</div>
    </div>
  );
}

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-7">
      <h1 className="font-serif text-2xl text-ink">{title}</h1>
      {action}
    </div>
  );
}
