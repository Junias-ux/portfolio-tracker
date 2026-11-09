import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const portfolioSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(150),
  currency: z
    .string()
    .regex(/^[A-Za-z]{3}$/, "La devise doit être un code à 3 lettres (ex : XAF, EUR, USD).")
    .transform((s) => s.toUpperCase()),
  description: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const portfolio = await prisma.portfolio.create({
      data: { ...parsed.data, userId: session.user.id },
    });
    return NextResponse.json(
      { id: portfolio.id, name: portfolio.name, currency: portfolio.currency },
      { status: 201 }
    );
  } catch (err) {
    // P2002 = violation de contrainte d'unicité (userId + name)
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "Vous avez déjà un portefeuille portant ce nom." },
        { status: 409 }
      );
    }
    throw err;
  }
}
