// Données factices — à retirer une fois les routes API branchées.
// Le seul but ici est de développer et visualiser le frontend de façon
// autonome, sans dépendre du backend.

export const mockUser = {
  fullName: "Junias Nouss",
  initials: "JN",
  email: "junias.nouss@exemple.com",
  defaultCurrency: "XAF",
};

export const mockPortfolios = [
  {
    id: "pf-1",
    name: "Épargne long terme",
    currency: "XAF",
    totalValue: 3_100_000,
    totalInvested: 2_866_200,
    unrealizedGain: 233_800,
    unrealizedGainPct: 8.1,
  },
  {
    id: "pf-2",
    name: "Trading",
    currency: "USD",
    totalValue: 1_180_500,
    totalInvested: 1_208_000,
    unrealizedGain: -27_500,
    unrealizedGainPct: -2.3,
  },
];

export const mockAssets: Record<string, {
  id: string;
  portfolioId: string;
  name: string;
  symbol: string | null;
  type: "stock" | "crypto" | "bond" | "real_estate" | "cash" | "other";
  quantityHeld: number;
  averageCost: number;
  currentPrice: number;
}[]> = {
  "pf-1": [
    { id: "as-1", portfolioId: "pf-1", name: "Apple", symbol: "AAPL", type: "stock", quantityHeld: 10, averageCost: 142.3, currentPrice: 155.8 },
    { id: "as-2", portfolioId: "pf-1", name: "Bitcoin", symbol: "BTC", type: "crypto", quantityHeld: 0.5, averageCost: 38200, currentPrice: 37050 },
    { id: "as-3", portfolioId: "pf-1", name: "Terrain — Douala", symbol: null, type: "real_estate", quantityHeld: 1, averageCost: 480000, currentPrice: 500000 },
  ],
  "pf-2": [
    { id: "as-4", portfolioId: "pf-2", name: "Tesla", symbol: "TSLA", type: "stock", quantityHeld: 5, averageCost: 245, currentPrice: 231 },
  ],
};

export const mockTransactions: Record<string, {
  id: string;
  type: "buy" | "sell" | "dividend" | "deposit" | "withdrawal" | "fee";
  quantity: number | null;
  unitPrice: number | null;
  date: string;
}[]> = {
  "as-1": [
    { id: "tx-1", type: "buy", quantity: 6, unitPrice: 138.0, date: "2026-06-03" },
    { id: "tx-2", type: "buy", quantity: 4, unitPrice: 149.1, date: "2026-07-15" },
    { id: "tx-3", type: "dividend", quantity: null, unitPrice: 24.0, date: "2026-09-01" },
  ],
};

export const mockValueHistory = [
  { date: "Avr", value: 3_820_000 },
  { date: "Mai", value: 3_910_000 },
  { date: "Jun", value: 3_780_000 },
  { date: "Jui", value: 4_050_000 },
  { date: "Aoû", value: 4_150_000 },
  { date: "Sep", value: 4_280_500 },
];

export const mockAllocation = [
  { type: "Actions", target: 60, actual: 58 },
  { type: "Crypto", target: 10, actual: 19 },
  { type: "Liquidités", target: 30, actual: 23 },
];

export const mockNotifications = [
  { id: "n1", read: false, title: "Bitcoin a varié de +12 % aujourd'hui", time: "Il y a 2 heures" },
  { id: "n2", read: true, title: "Écart d'allocation détecté sur « Épargne long terme »", time: "Hier" },
  { id: "n3", read: true, title: "Comparaison à un indice désormais disponible", time: "3 sept. 2026" },
];

export const mockBenchmarkHistory = [
  { date: "Avr", portfolio: 100, indice: 100 },
  { date: "Mai", portfolio: 102, indice: 103 },
  { date: "Jun", portfolio: 99, indice: 105 },
  { date: "Jui", portfolio: 106, indice: 108 },
  { date: "Aoû", portfolio: 109, indice: 110 },
  { date: "Sep", portfolio: 108, indice: 111 },
];

export const mockAdvisorClients = [
  { client: "Client A", portfolio: "Retraite", permission: "Lecture seule", value: 2_400_000 },
  { client: "Client B", portfolio: "Trading actif", permission: "Lecture / écriture", value: 890_000 },
];

export const assetTypeLabels: Record<string, string> = {
  stock: "Action",
  crypto: "Crypto",
  bond: "Obligation",
  real_estate: "Immobilier",
  cash: "Liquidités",
  other: "Autre",
};
