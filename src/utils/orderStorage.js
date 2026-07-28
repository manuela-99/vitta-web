const ORDERS_STORAGE_KEY = 'vitta-orders-v1';

export function saveOrder(order) {
  if (typeof window === 'undefined') return order;

  try {
    const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    const orders = stored ? JSON.parse(stored) : [];
    orders.unshift(order);
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Persist failure should not block checkout.
  }

  return order;
}

export function loadOrders() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getOrderById(orderId) {
  return loadOrders().find((order) => order.id === orderId) ?? null;
}
