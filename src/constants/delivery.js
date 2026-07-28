export const DELIVERY_METHODS = {
  PICKUP: 'pickup',
  NORTH_ZONE: 'north_zone',
  CABA: 'caba',
};

export const DELIVERY_FEES = {
  [DELIVERY_METHODS.PICKUP]: 0,
  [DELIVERY_METHODS.NORTH_ZONE]: 9500,
  [DELIVERY_METHODS.CABA]: 15000,
};

export const DELIVERY_LABELS = {
  [DELIVERY_METHODS.PICKUP]: 'Retiro por Béccar',
  [DELIVERY_METHODS.NORTH_ZONE]: 'Envío a Zona Norte',
  [DELIVERY_METHODS.CABA]: 'Envío a CABA',
  delivery: 'Envío a domicilio',
};

export const PAYMENT_METHOD = 'Transferencia';
export const PAYMENT_STATUS = 'Pendiente de pago';

export const EMPTY_DELIVERY_FIELDS = {
  recipientName: '',
  recipientPhone: '',
  deliveryAddress: '',
  locality: '',
  postalCode: '',
  apartment: '',
  crossStreets: '',
  deliveryNotes: '',
};

export function isShippingDelivery(deliveryMethod) {
  return (
    deliveryMethod === DELIVERY_METHODS.NORTH_ZONE ||
    deliveryMethod === DELIVERY_METHODS.CABA ||
    deliveryMethod === 'delivery'
  );
}

export function getDeliveryFee(deliveryMethod) {
  if (deliveryMethod === 'delivery') {
    return DELIVERY_FEES[DELIVERY_METHODS.NORTH_ZONE];
  }

  return DELIVERY_FEES[deliveryMethod] ?? 0;
}

export function toSupabaseDeliveryMethod(checkoutDeliveryMethod) {
  if (checkoutDeliveryMethod === DELIVERY_METHODS.PICKUP) {
    return DELIVERY_METHODS.PICKUP;
  }

  if (
    checkoutDeliveryMethod === DELIVERY_METHODS.NORTH_ZONE ||
    checkoutDeliveryMethod === DELIVERY_METHODS.CABA ||
    checkoutDeliveryMethod === 'delivery'
  ) {
    return 'delivery';
  }

  return checkoutDeliveryMethod;
}

export function getStoredDeliveryLabel(deliveryMethod, deliveryFee = 0) {
  if (deliveryMethod === DELIVERY_METHODS.PICKUP || deliveryMethod === 'pickup') {
    return DELIVERY_LABELS[DELIVERY_METHODS.PICKUP];
  }

  if (deliveryMethod === DELIVERY_METHODS.NORTH_ZONE) {
    return DELIVERY_LABELS[DELIVERY_METHODS.NORTH_ZONE];
  }

  if (deliveryMethod === DELIVERY_METHODS.CABA) {
    return DELIVERY_LABELS[DELIVERY_METHODS.CABA];
  }

  if (deliveryMethod === 'delivery') {
    if (deliveryFee === DELIVERY_FEES[DELIVERY_METHODS.NORTH_ZONE]) {
      return DELIVERY_LABELS[DELIVERY_METHODS.NORTH_ZONE];
    }

    if (deliveryFee === DELIVERY_FEES[DELIVERY_METHODS.CABA]) {
      return DELIVERY_LABELS[DELIVERY_METHODS.CABA];
    }

    return DELIVERY_LABELS.delivery;
  }

  return deliveryMethod;
}
