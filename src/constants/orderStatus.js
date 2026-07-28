export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING_RECEIPT: 'pending_receipt',
  PAID: 'paid',
  REJECTED: 'rejected',
};

export const PAYMENT_METHOD_LABELS = {
  transfer: 'Transferencia',
};

export const VISIBLE_STATUS = {
  PENDING_RECEIPT: 'pending_receipt',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const VISIBLE_STATUS_LABELS = {
  [VISIBLE_STATUS.PENDING_RECEIPT]: 'Pendiente de comprobante',
  [VISIBLE_STATUS.REJECTED]: 'Comprobante rechazado',
  [VISIBLE_STATUS.CONFIRMED]: 'Confirmado',
  [VISIBLE_STATUS.PREPARING]: 'En preparaci\u00f3n',
  [VISIBLE_STATUS.READY_FOR_PICKUP]: 'Listo para retirar',
  [VISIBLE_STATUS.OUT_FOR_DELIVERY]: 'En camino',
  [VISIBLE_STATUS.COMPLETED]: 'Entregado',
  [VISIBLE_STATUS.CANCELLED]: 'Cancelado',
};

export const VISIBLE_STATUS_OPTIONS = [
  VISIBLE_STATUS.PENDING_RECEIPT,
  VISIBLE_STATUS.CONFIRMED,
  VISIBLE_STATUS.PREPARING,
  VISIBLE_STATUS.READY_FOR_PICKUP,
  VISIBLE_STATUS.OUT_FOR_DELIVERY,
  VISIBLE_STATUS.COMPLETED,
  VISIBLE_STATUS.REJECTED,
  VISIBLE_STATUS.CANCELLED,
];

const BASE_ORDER_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: VISIBLE_STATUS.PENDING_RECEIPT, label: 'Pendientes' },
  { id: VISIBLE_STATUS.CONFIRMED, label: 'Confirmados' },
  { id: VISIBLE_STATUS.PREPARING, label: 'En preparaci\u00f3n' },
  { id: VISIBLE_STATUS.READY_FOR_PICKUP, label: 'Listos' },
  { id: VISIBLE_STATUS.OUT_FOR_DELIVERY, label: 'En camino' },
  { id: VISIBLE_STATUS.COMPLETED, label: 'Entregados' },
  { id: VISIBLE_STATUS.CANCELLED, label: 'Cancelados' },
];

export const ORDER_COUNTERS = [
  {
    id: VISIBLE_STATUS.PENDING_RECEIPT,
    label: 'Pendientes de comprobante',
    matches: (order) => getVisibleStatusId(order) === VISIBLE_STATUS.PENDING_RECEIPT,
  },
  {
    id: VISIBLE_STATUS.CONFIRMED,
    label: 'Confirmados',
    matches: (order) => getVisibleStatusId(order) === VISIBLE_STATUS.CONFIRMED,
  },
  {
    id: VISIBLE_STATUS.PREPARING,
    label: 'En preparaci\u00f3n',
    matches: (order) => getVisibleStatusId(order) === VISIBLE_STATUS.PREPARING,
  },
  {
    id: VISIBLE_STATUS.READY_FOR_PICKUP,
    label: 'Listos',
    matches: (order) => getVisibleStatusId(order) === VISIBLE_STATUS.READY_FOR_PICKUP,
  },
  {
    id: VISIBLE_STATUS.COMPLETED,
    label: 'Entregados',
    matches: (order) => getVisibleStatusId(order) === VISIBLE_STATUS.COMPLETED,
  },
];

export function normalizeOrderStatus(status) {
  if (status === 'ready') return ORDER_STATUS.READY_FOR_PICKUP;
  if (status === 'delivered') return ORDER_STATUS.COMPLETED;
  return status;
}

export function normalizePaymentStatus(status) {
  if (status === 'confirmed' || status === 'receipt_received') return PAYMENT_STATUS.PAID;
  return status;
}

export function getVisibleStatusId(order) {
  const paymentStatus = normalizePaymentStatus(order.payment_status);
  const orderStatus = normalizeOrderStatus(order.order_status);

  if (orderStatus === ORDER_STATUS.CANCELLED) {
    return VISIBLE_STATUS.CANCELLED;
  }

  if (orderStatus === ORDER_STATUS.COMPLETED) {
    return VISIBLE_STATUS.COMPLETED;
  }

  if (paymentStatus === PAYMENT_STATUS.PENDING_RECEIPT) {
    return VISIBLE_STATUS.PENDING_RECEIPT;
  }

  if (paymentStatus === PAYMENT_STATUS.REJECTED) {
    return VISIBLE_STATUS.REJECTED;
  }

  if (paymentStatus === PAYMENT_STATUS.PAID && orderStatus === ORDER_STATUS.CONFIRMED) {
    return VISIBLE_STATUS.CONFIRMED;
  }

  if (paymentStatus === PAYMENT_STATUS.PAID && orderStatus === ORDER_STATUS.PREPARING) {
    return VISIBLE_STATUS.PREPARING;
  }

  if (paymentStatus === PAYMENT_STATUS.PAID && orderStatus === ORDER_STATUS.READY_FOR_PICKUP) {
    return VISIBLE_STATUS.READY_FOR_PICKUP;
  }

  if (paymentStatus === PAYMENT_STATUS.PAID && orderStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
    return VISIBLE_STATUS.OUT_FOR_DELIVERY;
  }

  if (orderStatus === ORDER_STATUS.PENDING_PAYMENT) {
    return VISIBLE_STATUS.PENDING_RECEIPT;
  }

  return VISIBLE_STATUS.PENDING_RECEIPT;
}

export function getVisibleStatusLabel(order) {
  return VISIBLE_STATUS_LABELS[getVisibleStatusId(order)] ?? 'Estado desconocido';
}

export function getVisibleStatusOptionLabel(statusId) {
  return VISIBLE_STATUS_LABELS[statusId] ?? 'Estado desconocido';
}

export function getOrderFilters(orders) {
  const hasRejected = orders.some((order) => getVisibleStatusId(order) === VISIBLE_STATUS.REJECTED);

  if (!hasRejected) {
    return BASE_ORDER_FILTERS;
  }

  const filters = [...BASE_ORDER_FILTERS];
  filters.splice(filters.length - 1, 0, {
    id: VISIBLE_STATUS.REJECTED,
    label: 'Comprobante rechazado',
  });

  return filters;
}

export function matchesOrderFilter(order, filterId) {
  if (filterId === 'all') return true;
  return getVisibleStatusId(order) === filterId;
}

export function getStatusUpdatePayload(visibleStatusId, currentPaymentStatus) {
  switch (visibleStatusId) {
    case VISIBLE_STATUS.PENDING_RECEIPT:
      return {
        payment_status: PAYMENT_STATUS.PENDING_RECEIPT,
        order_status: ORDER_STATUS.PENDING_PAYMENT,
      };
    case VISIBLE_STATUS.REJECTED:
      return {
        payment_status: PAYMENT_STATUS.REJECTED,
        order_status: ORDER_STATUS.PENDING_PAYMENT,
      };
    case VISIBLE_STATUS.CONFIRMED:
      return {
        payment_status: PAYMENT_STATUS.PAID,
        order_status: ORDER_STATUS.CONFIRMED,
      };
    case VISIBLE_STATUS.PREPARING:
      return {
        payment_status: PAYMENT_STATUS.PAID,
        order_status: ORDER_STATUS.PREPARING,
      };
    case VISIBLE_STATUS.READY_FOR_PICKUP:
      return {
        payment_status: PAYMENT_STATUS.PAID,
        order_status: ORDER_STATUS.READY_FOR_PICKUP,
      };
    case VISIBLE_STATUS.OUT_FOR_DELIVERY:
      return {
        payment_status: PAYMENT_STATUS.PAID,
        order_status: ORDER_STATUS.OUT_FOR_DELIVERY,
      };
    case VISIBLE_STATUS.COMPLETED:
      return {
        payment_status: PAYMENT_STATUS.PAID,
        order_status: ORDER_STATUS.COMPLETED,
      };
    case VISIBLE_STATUS.CANCELLED:
      return {
        order_status: ORDER_STATUS.CANCELLED,
        payment_status: currentPaymentStatus,
      };
    default:
      return null;
  }
}
