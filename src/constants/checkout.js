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

export const PREPARATION_TIME_NOTICE =
  'Tiempo estimado de preparación: 48 a 72 horas hábiles.';

export const PREPARATION_TIME_IMPORTANT_HEADING = 'Aclaración importante';

export const PREPARATION_TIME_IMPORTANT_LEAD =
  'El tiempo estimado de preparación es de 48 a 72 horas hábiles.';

export const PREPARATION_TIME_IMPORTANT_SUFFIX =
  'Cuando el pedido esté listo, nos comunicaremos por WhatsApp para coordinar la entrega o el retiro.';

export const PREPARATION_TIME_IMPORTANT_TEXT = `${PREPARATION_TIME_IMPORTANT_LEAD} ${PREPARATION_TIME_IMPORTANT_SUFFIX}`;
