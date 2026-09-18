/**
 * Calculs liés au prix moyen d'achat (PRU / average cost).
 *
 * Règle du cahier des charges (section 5) :
 * - Un achat recalcule le PRU par moyenne pondérée.
 * - Une vente NE modifie PAS le PRU des unités restantes ; elle réalise
 *   une plus-value ou une moins-value sur la quantité vendue.
 *
 * Decimal.js est utilisé partout ici plutôt que le type `number` natif de
 * JavaScript, pour éviter les erreurs d'arrondi en virgule flottante
 * (ex : 0.1 + 0.2 !== 0.3), inacceptables sur des calculs financiers.
 */

import Decimal from "decimal.js";

export interface AssetPosition {
  quantityHeld: Decimal.Value;
  averageCost: Decimal.Value;
}

export interface BuyResult {
  newQuantity: Decimal;
  newAverageCost: Decimal;
}

export interface SellResult {
  newQuantity: Decimal;
  /** Le PRU ne change pas lors d'une vente ; renvoyé pour confirmation explicite. */
  unchangedAverageCost: Decimal;
  realizedGain: Decimal;
}

/**
 * Applique un achat à une position existante et renvoie la nouvelle
 * quantité détenue et le nouveau prix moyen d'achat.
 *
 * Formule :
 *   nouveau_PRU = (ancienne_quantité × ancien_PRU + quantité_achetée × prix_achat)
 *                 ÷ (ancienne_quantité + quantité_achetée)
 */
export function applyBuy(
  position: AssetPosition,
  boughtQuantity: Decimal.Value,
  purchasePrice: Decimal.Value
): BuyResult {
  const oldQuantity = new Decimal(position.quantityHeld);
  const oldAverageCost = new Decimal(position.averageCost);
  const qty = new Decimal(boughtQuantity);
  const price = new Decimal(purchasePrice);

  if (qty.lte(0)) {
    throw new Error("La quantité achetée doit être strictement positive.");
  }
  if (price.lt(0)) {
    throw new Error("Le prix d'achat ne peut pas être négatif.");
  }

  const newQuantity = oldQuantity.plus(qty);

  // Cas particulier : première ligne sur un actif encore vide.
  if (newQuantity.isZero()) {
    return { newQuantity: new Decimal(0), newAverageCost: new Decimal(0) };
  }

  const totalCostBefore = oldQuantity.times(oldAverageCost);
  const totalCostBought = qty.times(price);
  const newAverageCost = totalCostBefore.plus(totalCostBought).dividedBy(newQuantity);

  return { newQuantity, newAverageCost };
}

/**
 * Applique une vente à une position existante et renvoie la nouvelle
 * quantité détenue ainsi que la plus-value (ou moins-value) réalisée.
 *
 * Le PRU des unités restantes reste inchangé — c'est la règle centrale
 * à ne jamais casser dans une évolution future du code.
 */
export function applySell(
  position: AssetPosition,
  soldQuantity: Decimal.Value,
  sellPrice: Decimal.Value
): SellResult {
  const oldQuantity = new Decimal(position.quantityHeld);
  const averageCost = new Decimal(position.averageCost);
  const qty = new Decimal(soldQuantity);
  const price = new Decimal(sellPrice);

  if (qty.lte(0)) {
    throw new Error("La quantité vendue doit être strictement positive.");
  }
  if (qty.gt(oldQuantity)) {
    throw new Error(
      `Impossible de vendre ${qty.toString()} unités : seulement ${oldQuantity.toString()} détenues.`
    );
  }

  const newQuantity = oldQuantity.minus(qty);
  const realizedGain = qty.times(price.minus(averageCost));

  return {
    newQuantity,
    unchangedAverageCost: averageCost,
    realizedGain,
  };
}
