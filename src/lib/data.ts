/**
 * Couche de lecture utilisée par les pages (Server Components).
 *
 * Règle du cahier des charges : la valeur actuelle et la plus-value ne sont
 * jamais stockées. Elles sont recalculées ici, avec decimal.js, à partir de
 * la quantité, du PRU et du dernier cours connu (repli sur le PRU si aucun
 * cours n'a été saisi, comme la vue SQL v_asset_valuation).
 *
 * Les montants ne sont convertis en `number` qu'à la toute fin, pour
 * l'affichage : aucun calcul ne se fait sur des nombres JavaScript natifs.
 */

import Decimal from "decimal.js";
import { prisma } from "@/lib/db";
import { getPortfolioAccess, type Access } from "@/lib/access";
import {
  getCurrentValue,
  getUnrealizedGain,
  getUnrealizedGainPercentage,
} from "@/lib/calculations/valuation";

interface DecimalLike {
  toString(): string;
}

interface AssetRow {
  id: string;
  portfolioId: string;
  name: string;
  symbol: string | null;
  type: string;
  quantityHeld: DecimalLike;
  averageCost: DecimalLike;
}

interface QuoteRow {
  assetId: string;
  price: DecimalLike;
  quoteDate: Date;
}

interface TransactionRow {
  id: string;
  type: string;
  quantity: DecimalLike;
  unitPrice: DecimalLike;
  transactionDate: Date;
  note: string | null;
}

interface PortfolioRow {
  id: string;
  name: string;
  currency: string;
  description: string | null;
}

export interface AssetView {
  id: string;
  portfolioId: string;
  name: string;
  symbol: string | null;
  type: string;
  quantityHeld: number;
  averageCost: number;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  gain: number;
  gainPct: number;
  hasQuote: boolean;
}

export interface PortfolioSummaryView {
  id: string;
  name: string;
  currency: string;
  description: string | null;
  totalValue: number;
  totalInvested: number;
  gain: number;
  gainPct: number;
  assetCount: number;
}

function valuate(asset: AssetRow, latestPrice: Decimal | undefined): AssetView {
  const quantity = new Decimal(asset.quantityHeld.toString());
  const averageCost = new Decimal(asset.averageCost.toString());
  const price = latestPrice ?? averageCost;

  return {
    id: asset.id,
    portfolioId: asset.portfolioId,
    name: asset.name,
    symbol: asset.symbol,
    type: asset.type,
    quantityHeld: quantity.toNumber(),
    averageCost: averageCost.toNumber(),
    currentPrice: price.toNumber(),
    currentValue: getCurrentValue(quantity, price).toNumber(),
    costBasis: quantity.times(averageCost).toNumber(),
    gain: getUnrealizedGain(quantity, averageCost, price).toNumber(),
    gainPct: getUnrealizedGainPercentage(quantity, averageCost, price).toNumber(),
    hasQuote: latestPrice !== undefined,
  };
}

async function latestPrices(assetIds: string[]): Promise<Map<string, Decimal>> {
  if (assetIds.length === 0) return new Map();

  const rows: QuoteRow[] = await prisma.quote.findMany({
    where: { assetId: { in: assetIds } },
    orderBy: { quoteDate: "desc" },
    distinct: ["assetId"],
  });
  return new Map(rows.map((r): [string, Decimal] => [r.assetId, new Decimal(r.price.toString())]));
}

function summarize(portfolio: PortfolioRow, assets: AssetView[]): PortfolioSummaryView {
  const totalValue = assets.reduce((sum, a) => sum.plus(a.currentValue), new Decimal(0));
  const totalInvested = assets.reduce((sum, a) => sum.plus(a.costBasis), new Decimal(0));
  const gain = totalValue.minus(totalInvested);

  return {
    id: portfolio.id,
    name: portfolio.name,
    currency: portfolio.currency,
    description: portfolio.description,
    totalValue: totalValue.toNumber(),
    totalInvested: totalInvested.toNumber(),
    gain: gain.toNumber(),
    gainPct: totalInvested.isZero() ? 0 : gain.dividedBy(totalInvested).times(100).toNumber(),
    assetCount: assets.length,
  };
}

/** Tous les portefeuilles dont l'utilisateur est propriétaire, avec leurs totaux. */
export async function getPortfolioSummaries(userId: string): Promise<PortfolioSummaryView[]> {
  const portfolios: (PortfolioRow & { assets: AssetRow[] })[] = await prisma.portfolio.findMany({
    where: { userId },
    include: { assets: true },
    orderBy: { createdAt: "asc" },
  });

  const allAssetIds = portfolios.flatMap((p) => p.assets.map((a) => a.id));
  const prices = await latestPrices(allAssetIds);

  return portfolios.map((p) =>
    summarize(
      p,
      p.assets.map((a) => valuate(a, prices.get(a.id)))
    )
  );
}

export interface PortfolioDetailView {
  portfolio: PortfolioSummaryView;
  assets: AssetView[];
  access: Exclude<Access, null>;
}

/** Détail d'un portefeuille, ou null si introuvable / non autorisé. */
export async function getPortfolioDetail(
  userId: string,
  portfolioId: string
): Promise<PortfolioDetailView | null> {
  const access = await getPortfolioAccess(userId, portfolioId);
  if (access === null) return null;

  const portfolio: (PortfolioRow & { assets: AssetRow[] }) | null = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    include: { assets: { orderBy: { createdAt: "asc" } } },
  });
  if (!portfolio) return null;

  const prices = await latestPrices(portfolio.assets.map((a) => a.id));
  const assets = portfolio.assets.map((a) => valuate(a, prices.get(a.id)));

  return { portfolio: summarize(portfolio, assets), assets, access };
}

export interface AssetDetailView {
  asset: AssetView;
  portfolioName: string;
  currency: string;
  access: Exclude<Access, null>;
  transactions: { id: string; type: string; quantity: number; unitPrice: number; date: string; note: string | null }[];
  quotes: { date: string; price: number }[];
}

/** Détail d'un actif, ou null si introuvable / non autorisé. */
export async function getAssetDetail(
  userId: string,
  portfolioId: string,
  assetId: string
): Promise<AssetDetailView | null> {
  const asset: (AssetRow & { portfolio: PortfolioRow }) | null = await prisma.asset.findUnique({
    where: { id: assetId },
    include: { portfolio: true },
  });
  if (!asset || asset.portfolioId !== portfolioId) return null;

  const access = await getPortfolioAccess(userId, portfolioId);
  if (access === null) return null;

  const transactions: TransactionRow[] = await prisma.transaction.findMany({
    where: { assetId },
    orderBy: { transactionDate: "desc" },
  });
  const quotes: QuoteRow[] = await prisma.quote.findMany({
    where: { assetId },
    orderBy: { quoteDate: "asc" },
  });

  const lastQuote = quotes[quotes.length - 1];
  const latest = lastQuote ? new Decimal(lastQuote.price.toString()) : undefined;

  return {
    asset: valuate(asset, latest),
    portfolioName: asset.portfolio.name,
    currency: asset.portfolio.currency,
    access,
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      quantity: new Decimal(t.quantity.toString()).toNumber(),
      unitPrice: new Decimal(t.unitPrice.toString()).toNumber(),
      date: t.transactionDate.toISOString().slice(0, 10),
      note: t.note,
    })),
    quotes: quotes.map((q) => ({
      date: q.quoteDate.toISOString().slice(0, 10),
      price: new Decimal(q.price.toString()).toNumber(),
    })),
  };
}
