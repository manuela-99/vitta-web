export function canOfferSinTaccOption(product) {
  return product?.canBeGlutenFree === true;
}

export function isPastasProduct(product) {
  return product?.category === 'PASTAS';
}

export function getInitialSinTacc() {
  return false;
}

export function parseStoredSinTacc(raw, product) {
  if (!canOfferSinTaccOption(product)) return false;
  if (typeof raw.sinTacc === 'boolean') return raw.sinTacc;
  if (raw.preparation === 'sin-tacc') return true;
  return false;
}
