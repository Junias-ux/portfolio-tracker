import { prisma } from "@/lib/db";

export type Access = "owner" | "read_write" | "read_only" | null;

/**
 * Niveau d'accès d'un utilisateur sur un portefeuille :
 * - "owner" : il en est propriétaire
 * - "read_write" / "read_only" : accès conseiller accordé (advisor_portfolio_access)
 * - null : aucun accès (ou portefeuille inexistant — on ne distingue pas
 *   volontairement, pour ne pas révéler l'existence d'un portefeuille à
 *   quelqu'un qui n'y a pas droit)
 */
export async function getPortfolioAccess(userId: string, portfolioId: string): Promise<Access> {
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    select: { userId: true },
  });
  if (!portfolio) return null;
  if (portfolio.userId === userId) return "owner";

  const advisorAccess = await prisma.advisorPortfolioAccess.findUnique({
    where: { advisorId_portfolioId: { advisorId: userId, portfolioId } },
  });
  return advisorAccess ? advisorAccess.permission : null;
}

export function canWrite(access: Access): boolean {
  return access === "owner" || access === "read_write";
}
