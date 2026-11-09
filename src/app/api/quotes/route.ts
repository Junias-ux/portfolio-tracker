import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPortfolioAccess, canWrite } from "@/lib/access";

const quoteSchema = z.object({
  assetId: z.string().uuid(),
  price: z.number({ invalid_type_error: "Le prix doit être un nombre." }).min(0, "Le prix ne peut pas être négatif."),
  quoteDate: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Date invalide." }),
});

// Saisie manuelle d'un cours (V1). Une seule cotation par actif et par jour :
// ressaisir le même jour corrige la valeur précédente (upsert).
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { assetId, price, quoteDate } = parsed.data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    select: { portfolioId: true },
  });
  if (!asset) {
    return NextResponse.json({ error: "Actif introuvable." }, { status: 404 });
  }

  const access = await getPortfolioAccess(session.user.id, asset.portfolioId);
  if (!canWrite(access)) {
    return NextResponse.json({ error: "Vous n'avez pas les droits d'écriture sur ce portefeuille." }, { status: 403 });
  }

  const date = new Date(quoteDate);
  const quote = await prisma.quote.upsert({
    where: { assetId_quoteDate: { assetId, quoteDate: date } },
    update: { price },
    create: { assetId, price, quoteDate: date, source: "manual" },
  });

  return NextResponse.json({ id: quote.id }, { status: 201 });
}
