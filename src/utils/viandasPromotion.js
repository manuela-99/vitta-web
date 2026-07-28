export function normalizeCategory(category) {
  return String(category ?? '')
    .trim()
    .toLowerCase();
}

export function isViandasSide(item) {
  if (item.section !== 'viandas') return false;

  const category = normalizeCategory(item.category);
  return category === 'guarniciones' || category === 'ensaladas';
}

export function isViandasPlate(item) {
  return item.section === 'viandas' && !isViandasSide(item);
}

export function getViandasDiscountPercent(completeCombos) {
  if (completeCombos >= 10) return 15;
  if (completeCombos >= 5) return 10;
  return 0;
}

export function computeViandasPromotion(items) {
  let totalPlates = 0;
  let totalSides = 0;
  let viandasSubtotal = 0;

  for (const item of items) {
    if (item.section !== 'viandas') continue;

    viandasSubtotal += item.subtotal;

    if (isViandasSide(item)) {
      totalSides += item.quantity;
    } else {
      totalPlates += item.quantity;
    }
  }

  const completeCombos = Math.min(totalPlates, totalSides);
  const discountPercent = getViandasDiscountPercent(completeCombos);
  const discountAmount =
    discountPercent > 0 ? Math.round((viandasSubtotal * discountPercent) / 100) : 0;

  return {
    totalPlates,
    totalSides,
    completeCombos,
    discountPercent,
    discountAmount,
    viandasSubtotal,
  };
}
