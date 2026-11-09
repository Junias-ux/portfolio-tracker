import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPortfolioAccess, canWrite } from "@/lib/access";

const assetSchema = z.object({
  portfolioId: z.string().uuid(),
  name: z.string().trim().min(1, "Le nom est requis.").max(150),
  symbol: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((s) => (s ? s : undefined)),
  type: z.enum(["stock", "crypto", "bond", "real_estate", "cash", "other"]),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = assetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { portfolioId, name, symbol, type } = parsed.data;

  const access = await getPortfolioAccess(session.user.id, portfolioId);
  if (access === null) {
    return NextResponse.json({ error: "Portefeuille introuvable." }, { status: 404 });
  }
  if (!canWrite(access)) {
    return NextResponse.json({ error: "Accès en lecture seule sur ce portefeuille." }, { status: 403 });
  }

  // quantityHeld et averageCost démarrent à 0 : ils ne bougent que via
  // des transactions (POST /api/transactions), jamais saisis directement.
  const asset = await prisma.asset.create({
    data: { portfolioId, name, symbol: symbol ?? null, type },
  });

  return NextResponse.json({ id: asset.id, name: asset.name }, { status: 201 });
}
