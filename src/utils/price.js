export function formatPrice(amount) {
  return `$${amount.toLocaleString('es-AR')}`;
}

export function parsePriceFromDisplay(value) {
  const match = String(value).match(/\$([\d.]+)/);
  if (!match) return 0;
  return Number.parseInt(match[1].replace(/\./g, ''), 10);
}

export function formatWeight(totalGrams) {
  if (totalGrams >= 1000) {
    const kg = totalGrams / 1000;
    return `${kg.toLocaleString('es-AR', { maximumFractionDigits: 2 })} kg`;
  }
  return `${totalGrams.toLocaleString('es-AR')} g`;
}
