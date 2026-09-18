/**
 * Calculs de valorisation d'un actif.
 * Règle centrale du cahier des charges : la valeur actuelle et la
 * plus-value latente ne sont jamais stockées, toujours recalculées.
 */

import Decimal from "decimal.js";

export function getCurrentValue(
  quantityHeld: Decimal.Value,
  latestPrice: Decimal.Value
): Decimal {
  return new Decimal(quantityHeld).times(latestPrice);
}

export function getUnrealizedGain(
  quantityHeld: Decimal.Value,
  averageCost: Decimal.Value,
  latestPrice: Decimal.Value
): Decimal {
  const currentValue = getCurrentValue(quantityHeld, latestPrice);
  const costBasis = new Decimal(quantityHeld).times(averageCost);
  return currentValue.minus(costBasis);
}

export function getUnrealizedGainPercentage(
  quantityHeld: Decimal.Value,
  averageCost: Decimal.Value,
  latestPrice: Decimal.Value
): Decimal {
  const costBasis = new Decimal(quantityHeld).times(averageCost);
  if (costBasis.isZero()) return new Decimal(0);

  const gain = getUnrealizedGain(quantityHeld, averageCost, latestPrice);
  return gain.dividedBy(costBasis).times(100);
}
