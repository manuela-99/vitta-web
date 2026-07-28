import { DELIVERY_FEE, DELIVERY_METHODS } from '../constants/delivery';
import { supabase } from './supabase';
import { computeOrderTotals } from './whatsappOrder';

function splitCustomerName(fullName) {
  const trimmed = fullName.trim();
  const separatorIndex = trimmed.indexOf(' ');

  if (separatorIndex === -1) {
    return { firstName: trimmed, lastName: null };
  }

  return {
    firstName: trimmed.slice(0, separatorIndex),
    lastName: trimmed.slice(separatorIndex + 1).trim() || null,
  };
}

function toNullableText(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function buildOrderItems(items) {
  return items.map((item) => ({
    productId: item.productId,
    section: item.section,
    category: item.category,
    name: item.name,
    presentationLabel: item.presentationLabel,
    quantity: item.quantity,
    quantityUnit: item.quantityUnit,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
    sinTacc: item.sinTacc ?? false,
    totalWeightGrams: item.totalWeightGrams ?? null,
  }));
}

export function buildSupabaseOrderPayload(
  items,
  orderNotes = '',
  { deliveryMethod, deliveryFields } = {},
) {
  const totals = computeOrderTotals(items, deliveryMethod);
  const isDelivery = deliveryMethod === DELIVERY_METHODS.DELIVERY;
  const { firstName, lastName } = splitCustomerName(deliveryFields.recipientName ?? '');

  return {
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_phone: deliveryFields.recipientPhone.trim(),
    items: buildOrderItems(items),
    notes: toNullableText(orderNotes),
    delivery_method: deliveryMethod,
    delivery_fee: isDelivery ? DELIVERY_FEE : 0,
    delivery_address: isDelivery ? deliveryFields.deliveryAddress.trim() : null,
    locality: isDelivery ? deliveryFields.locality.trim() : null,
    postal_code: isDelivery ? deliveryFields.postalCode.trim() : null,
    apartment: isDelivery ? toNullableText(deliveryFields.apartment) : null,
    cross_streets: isDelivery ? toNullableText(deliveryFields.crossStreets) : null,
    delivery_notes: isDelivery ? toNullableText(deliveryFields.deliveryNotes) : null,
    subtotal: totals.subtotal,
    total: totals.total,
    payment_method: 'transfer',
    payment_status: 'pending_receipt',
    order_status: 'pending_payment',
  };
}

export async function submitOrderToSupabase(
  items,
  orderNotes = '',
  checkoutData = {},
) {
  const payload = buildSupabaseOrderPayload(items, orderNotes, checkoutData);
  const { error } = await supabase.from('orders').insert(payload);

  if (error) {
    return { ok: false };
  }

  return { ok: true };
}
