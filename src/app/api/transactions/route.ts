import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Decimal from "decimal.js";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applyBuy, applySell } from "@/lib/calculations/averageCost";
import {
  getCurrentValue,
  getUnrealizedGain,
  getUnrealizedGainPercentage,
} from "@/lib/calculations/valuation";
import { getLatestPrice } from "@/lib/quotes";
import { transactionInputSchema } from "@/lib/validation/transaction";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  const parsed = transactionInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { assetId, type, quantity, unitPrice, transactionDate, note } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({
        where: { id: assetId },
        include: { portfolio: true },
      });
      if (!asset) {
        throw new RouteError(404, "Actif introuvable.");
      }

      // Autorisation : propriétaire du portefeuille, OU conseiller avec
      // un accès explicite en écriture (advisor_portfolio_access).
      const isOwner = asset.portfolio.userId === session.user.id;
      if (!isOwner) {
        const advisorAccess = await tx.advisorPortfolioAccess.findUnique({
          where: {
            advisorId_portfolioId: {
              advisorId: session.user.id,
              portfolioId: asset.portfolioId,
            },
          },
        });
        if (!advisorAccess || advisorAccess.permission !== "read_write") {
          throw new RouteError(403, "Vous n'avez pas les droits d'écriture sur ce portefeuille.");
        }
      }

      const currentPosition = {
        quantityHeld: asset.quantityHeld.toString(),
        averageCost: asset.averageCost.toString(),
      };

      let newQuantity = new Decimal(currentPosition.quantityHeld);
      let newAverageCost = new Decimal(currentPosition.averageCost);
      let realizedGain: Decimal | null = null;

      // Seuls l'achat et la vente modifient la position détenue.
      // Dividende, dépôt, retrait et frais sont historisés tels quels
      // (V1 : ils n'affectent pas quantityHeld/averageCost de l'actif —
      // une vraie gestion des liquidités comme actif à part entière
      // viendra si besoin, voir cahier des charges section "Autre").
      if (type === "buy") {
        const r = applyBuy(currentPosition, quantity, unitPrice);
        newQuantity = r.newQuantity;
        newAverageCost = r.newAverageCost;
      } else if (type === "sell") {
        const r = applySell(currentPosition, quantity, unitPrice);
        newQuantity = r.newQuantity;
        realizedGain = r.realizedGain;
        // newAverageCost reste inchangé, cf. règle du cahier des charges.
      }

      const createdTransaction = await tx.transaction.create({
        data: {
          assetId,
          type,
          quantity,
          unitPrice,
          transactionDate: new Date(transactionDate),
          note,
        },
      });

      const updatedAsset = await tx.asset.update({
        where: { id: assetId },
        data: {
          quantityHeld: newQuantity.toFixed(8),
          averageCost: newAverageCost.toFixed(8),
        },
      });

      return { createdTransaction, updatedAsset, realizedGain };
    });

    const latestPrice = await getLatestPrice(
      result.updatedAsset.id,
      result.updatedAsset.averageCost.toString()
    );
    const quantityHeld = result.updatedAsset.quantityHeld.toString();
    const averageCost = result.updatedAsset.averageCost.toString();

    return NextResponse.json(
      {
        transaction: result.createdTransaction,
        asset: {
          id: result.updatedAsset.id,
          quantityHeld,
          averageCost,
          currentPrice: latestPrice.toFixed(8),
          currentValue: getCurrentValue(quantityHeld, latestPrice).toFixed(2),
          unrealizedGain: getUnrealizedGain(quantityHeld, averageCost, latestPrice).toFixed(2),
          unrealizedGainPercentage: getUnrealizedGainPercentage(quantityHeld, averageCost, latestPrice).toFixed(2),
        },
        realizedGain: result.realizedGain ? result.realizedGain.toFixed(2) : null,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof RouteError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    // Erreurs métier venant de averageCost.ts (ex: vente > quantité détenue)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const assetId = request.nextUrl.searchParams.get("assetId");
  if (!assetId) {
    return NextResponse.json({ error: "Le paramètre assetId est requis." }, { status: 400 });
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: { portfolio: true },
  });
  if (!asset) {
    return NextResponse.json({ error: "Actif introuvable." }, { status: 404 });
  }

  const isOwner = asset.portfolio.userId === session.user.id;
  if (!isOwner) {
    const advisorAccess = await prisma.advisorPortfolioAccess.findUnique({
      where: {
        advisorId_portfolioId: { advisorId: session.user.id, portfolioId: asset.portfolioId },
      },
    });
    if (!advisorAccess) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }
  }

  const transactions = await prisma.transaction.findMany({
    where: { assetId },
    orderBy: { transactionDate: "desc" },
  });

  return NextResponse.json({ transactions });
}

class RouteError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
