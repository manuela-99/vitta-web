import { formatPrice } from './price';
import { canOfferSinTaccOption, parseStoredSinTacc } from './preparation';

export function normalizeSinTaccUnits(quantity, sinTaccUnits, canBeGlutenFree, legacyAllSinTacc = false) {
  if (!canBeGlutenFree || quantity <= 0) return [];

  let units = Array.isArray(sinTaccUnits) ? sinTaccUnits.map(Boolean) : [];

  if (units.length === 0 && legacyAllSinTacc) {
    units = Array(quantity).fill(true);
  }

  while (units.length < quantity) {
    units.push(false);
  }

  return units.slice(0, quantity);
}

export function getSinTaccUnits(item) {
  if (!canOfferSinTaccOption(item)) return [];

  if (Array.isArray(item.sinTaccUnits) && item.sinTaccUnits.length === item.quantity) {
    return item.sinTaccUnits.map(Boolean);
  }

  return normalizeSinTaccUnits(item.quantity, [], true, Boolean(item.sinTacc));
}

export function getSinTaccCount(item) {
  return getSinTaccUnits(item).filter(Boolean).length;
}

export function parseStoredLineItem(raw, product) {
  let quantity = Math.max(0, raw.quantity ?? 1);

  if (typeof raw.normalQuantity === 'number' || typeof raw.sinTaccQuantity === 'number') {
    const normalQuantity = Math.max(0, raw.normalQuantity ?? 0);
    const sinTaccQuantity = product.canBeGlutenFree
      ? Math.max(0, raw.sinTaccQuantity ?? 0)
      : 0;
    quantity = normalQuantity + sinTaccQuantity;

    return {
      quantity,
      sinTaccUnits: [
        ...Array(sinTaccQuantity).fill(true),
        ...Array(normalQuantity).fill(false),
      ].slice(0, quantity),
    };
  }

  if (Array.isArray(raw.sinTaccUnits)) {
    return {
      quantity,
      sinTaccUnits: normalizeSinTaccUnits(
        quantity,
        raw.sinTaccUnits,
        product.canBeGlutenFree,
      ),
    };
  }

  return {
    quantity,
    sinTaccUnits: normalizeSinTaccUnits(
      quantity,
      [],
      product.canBeGlutenFree,
      parseStoredSinTacc(raw, product),
    ),
  };
}

export function formatQuantityWithUnit(quantity, unit = 'unidad') {
  if (quantity === 1) {
    if (unit === 'docena') return '1 docena';
    if (unit === 'unidad') return '1 unidad';
    if (unit === 'caja') return '1 caja';
    return `1 ${unit}`;
  }

  if (unit === 'docena') return `${quantity} docenas`;
  if (unit === 'unidad') return `${quantity} unidades`;
  if (unit === 'caja') return `${quantity} cajas`;
  return `${quantity} ${unit}`;
}

export function buildCartItemMetaParts(item, { includePresentation = false } = {}) {
  const parts = [];
  const unit = item.quantityUnit ?? 'unidad';

  if (includePresentation && item.presentationLabel?.trim()) {
    parts.push(item.presentationLabel);
  }

  parts.push(formatQuantityWithUnit(item.quantity, unit));

  if (canOfferSinTaccOption(item)) {
    const sinTaccCount = getSinTaccCount(item);
    if (sinTaccCount === item.quantity) {
      parts.push('Sin TACC');
    } else if (sinTaccCount > 0) {
      parts.push(`${sinTaccCount} Sin TACC`);
    }
  }

  return parts;
}

export function formatCartItemSummary(item) {
  const unitLabel = formatQuantityWithUnit(item.quantity, item.quantityUnit ?? 'unidad');
  return `${unitLabel} \u00b7 ${formatPrice(item.subtotal)}`;
}

export function expandCartItemsForOrder(items) {
  return items.flatMap((item) => {
    if (!canOfferSinTaccOption(item)) {
      return [item];
    }

    const units = getSinTaccUnits(item);
    const sinTaccCount = units.filter(Boolean).length;
    const commonCount = item.quantity - sinTaccCount;
    const expanded = [];

    if (commonCount > 0) {
      expanded.push({
        ...item,
        quantity: commonCount,
        sinTaccUnits: Array(commonCount).fill(false),
        sinTacc: false,
        subtotal: commonCount * item.unitPrice,
        totalWeightGrams: item.gramsPerUnit ? item.gramsPerUnit * commonCount : null,
      });
    }

    if (sinTaccCount > 0) {
      expanded.push({
        ...item,
        quantity: sinTaccCount,
        sinTaccUnits: Array(sinTaccCount).fill(true),
        sinTacc: true,
        subtotal: sinTaccCount * item.unitPrice,
        totalWeightGrams: item.gramsPerUnit ? item.gramsPerUnit * sinTaccCount : null,
      });
    }

    return expanded.length > 0 ? expanded : [item];
  });
}
