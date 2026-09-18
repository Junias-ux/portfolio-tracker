import type {
  AssetType,
  TransactionType,
  Role,
  AdvisorPermission,
} from "@prisma/client";

export type { AssetType, TransactionType, Role, AdvisorPermission };

export interface AssetWithValuation {
  id: string;
  name: string;
  symbol: string | null;
  type: AssetType;
  quantityHeld: string; // Decimal sérialisé en string à travers l'API
  averageCost: string;
  currentPrice: string;
  currentValue: string;
  unrealizedGain: string;
  unrealizedGainPercentage: string;
}

export interface PortfolioSummary {
  id: string;
  name: string;
  currency: string;
  totalValue: string;
  totalUnrealizedGain: string;
}
