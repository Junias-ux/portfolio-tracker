import { prisma } from "@/lib/db";
import Decimal from "decimal.js";

/**
 * Renvoie le dernier prix connu d'un actif.
 * Si aucune cotation n'a encore été saisie, on retombe sur le PRU
 * (comportement identique à la vue SQL v_asset_valuation :
 * COALESCE(latest_price, average_cost)), pour ne jamais afficher une
 * valeur nulle sur un actif fraîchement créé.
 */
export async function getLatestPrice(
  assetId: string,
  fallbackAverageCost: Decimal.Value
): Promise<Decimal> {
  const latestQuote = await prisma.quote.findFirst({
    where: { assetId },
    orderBy: { quoteDate: "desc" },
  });

  return latestQuote ? new Decimal(latestQuote.price.toString()) : new Decimal(fallbackAverageCost);
}
