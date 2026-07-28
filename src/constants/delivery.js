export const DELIVERY_FEE = 9500;

export const DELIVERY_METHODS = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery',
};

export const DELIVERY_LABELS = {
  [DELIVERY_METHODS.PICKUP]: 'Retiro por Béccar',
  [DELIVERY_METHODS.DELIVERY]: 'Envío a domicilio',
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
