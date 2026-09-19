export function formatCurrency(value: number, currency: string = "XAF"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "XAF" ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)} %`;
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(isoDate)
  );
}
