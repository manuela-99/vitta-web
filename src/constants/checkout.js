export const CHECKOUT_STEPS = {
  PRODUCTS: 1,
  DELIVERY: 2,
  CONFIRM: 3,
};

export const CHECKOUT_STEP_LABELS = [
  { step: CHECKOUT_STEPS.PRODUCTS, number: '01', label: 'Productos' },
  { step: CHECKOUT_STEPS.DELIVERY, number: '02', label: 'Entrega' },
  { step: CHECKOUT_STEPS.CONFIRM, number: '03', label: 'Confirmación' },
];
