import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { applyBuy, applySell } from "@/lib/calculations/averageCost";

describe("applyBuy", () => {
  it("initialise le PRU sur un premier achat", () => {
    const result = applyBuy({ quantityHeld: 0, averageCost: 0 }, 6, 138);

    expect(result.newQuantity.toString()).toBe("6");
    expect(result.newAverageCost.toString()).toBe("138");
  });

  it("recalcule le PRU pondéré sur un deuxième achat à un prix différent", () => {
    // 6 unités à 138, puis 4 unités à 149.10
    const position = { quantityHeld: 6, averageCost: 138 };
    const result = applyBuy(position, 4, 149.1);

    // PRU attendu = (6*138 + 4*149.10) / 10 = (828 + 596.4) / 10 = 142.44
    expect(result.newQuantity.toString()).toBe("10");
    expect(result.newAverageCost.toFixed(2)).toBe("142.44");
  });

  it("rejette une quantité achetée négative ou nulle", () => {
    expect(() => applyBuy({ quantityHeld: 10, averageCost: 100 }, 0, 100)).toThrow();
    expect(() => applyBuy({ quantityHeld: 10, averageCost: 100 }, -5, 100)).toThrow();
  });

  it("rejette un prix d'achat négatif", () => {
    expect(() => applyBuy({ quantityHeld: 10, averageCost: 100 }, 5, -1)).toThrow();
  });
});

describe("applySell", () => {
  it("ne modifie pas le PRU lors d'une vente partielle", () => {
    const position = { quantityHeld: 10, averageCost: new Decimal("142.44") };
    const result = applySell(position, 4, 160);

    expect(result.newQuantity.toString()).toBe("6");
    expect(result.unchangedAverageCost.toString()).toBe("142.44");
  });

  it("calcule correctement une plus-value réalisée", () => {
    const position = { quantityHeld: 10, averageCost: 100 };
    const result = applySell(position, 4, 160);

    // (160 - 100) * 4 = 240
    expect(result.realizedGain.toString()).toBe("240");
  });

  it("calcule correctement une moins-value réalisée", () => {
    const position = { quantityHeld: 10, averageCost: 100 };
    const result = applySell(position, 4, 80);

    // (80 - 100) * 4 = -80
    expect(result.realizedGain.toString()).toBe("-80");
  });

  it("refuse de vendre plus que la quantité détenue", () => {
    const position = { quantityHeld: 5, averageCost: 100 };
    expect(() => applySell(position, 10, 100)).toThrow();
  });

  it("refuse une quantité vendue négative ou nulle", () => {
    const position = { quantityHeld: 5, averageCost: 100 };
    expect(() => applySell(position, 0, 100)).toThrow();
  });
});
