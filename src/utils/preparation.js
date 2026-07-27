export function canOfferSinTaccOption(product) {
  return product?.preparationMode === 'choice';
}

export function getInitialSinTacc(product) {
  if (product?.preparationMode === 'sin-tacc-only') return true;
  return false;
}

export function parseStoredSinTacc(raw, product) {
  if (typeof raw.sinTacc === 'boolean') return raw.sinTacc;
  if (raw.preparation === 'sin-tacc') return true;
  return getInitialSinTacc(product);
}
