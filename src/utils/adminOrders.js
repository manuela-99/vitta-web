import { supabase } from './supabase.js';

const ORDER_COLUMNS = [
  'id',
  'created_at',
  'customer_first_name',
  'customer_last_name',
  'customer_phone',
  'items',
  'notes',
  'delivery_method',
  'delivery_fee',
  'delivery_address',
  'locality',
  'postal_code',
  'apartment',
  'cross_streets',
  'delivery_notes',
  'subtotal',
  'total',
  'payment_method',
  'payment_status',
  'order_status',
].join(', ');

export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_COLUMNS)
    .order('created_at', { ascending: false });

  return { data: normalizeOrders(data ?? []), error };
}

export async function fetchOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_COLUMNS)
    .eq('id', orderId)
    .maybeSingle();

  return { data: data ? normalizeOrder(data) : null, error };
}

export async function updateOrder(orderId, updates) {
  const payload = {};

  if (updates.order_status !== undefined) payload.order_status = updates.order_status;
  if (updates.payment_status !== undefined) payload.payment_status = updates.payment_status;

  if (Object.keys(payload).length === 0) {
    return { ok: true };
  }

  const { error } = await supabase.from('orders').update(payload).eq('id', orderId);

  return { ok: !error, error };
}

export function parseOrderItems(rawItems) {
  if (Array.isArray(rawItems)) return rawItems;

  if (typeof rawItems === 'string') {
    try {
      const parsed = JSON.parse(rawItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function normalizeOrder(order) {
  return {
    ...order,
    items: parseOrderItems(order.items),
  };
}

function normalizeOrders(orders) {
  return orders.map(normalizeOrder);
}

export function formatCustomerName(order) {
  return [order.customer_first_name, order.customer_last_name].filter(Boolean).join(' ');
}

export function formatOrderDate(value) {
  if (!value) return '-';

  return new Date(value).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function formatOrderNumber(order) {
  if (order.order_number != null) {
    return `#${order.order_number}`;
  }

  const date = new Date(order.created_at);
  if (Number.isNaN(date.getTime())) {
    return '#----';
  }

  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join('');

  return `#${stamp}`;
}

export function getOrderUpdatedAt(order) {
  return order.updated_at ?? order.created_at;
}

export function normalizePhoneForWhatsApp(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('549') && digits.length >= 12) return digits;
  if (digits.startsWith('54') && digits.length >= 11) return digits;
  if (digits.startsWith('9') && digits.length === 11) return `54${digits}`;
  if (digits.length === 10) return `549${digits}`;

  return digits;
}

export function buildCustomerWhatsAppLink(order, orderNumber) {
  const phone = normalizePhoneForWhatsApp(order.customer_phone);
  if (!phone) return '';

  const firstName = order.customer_first_name?.trim() || formatCustomerName(order);
  const message = `Hola ${firstName}, te escribimos de Vitta por tu pedido ${orderNumber}.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
