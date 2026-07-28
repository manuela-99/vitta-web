import { isShippingDelivery, toSupabaseDeliveryMethod } from '../constants/delivery';
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
  const isShipping = isShippingDelivery(deliveryMethod);
  const { firstName, lastName } = splitCustomerName(deliveryFields.recipientName ?? '');

  return {
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_phone: deliveryFields.recipientPhone.trim(),
    items: buildOrderItems(items),
    notes: toNullableText(orderNotes),
    delivery_method: toSupabaseDeliveryMethod(deliveryMethod),
    delivery_fee: totals.deliveryFee,
    delivery_address: isShipping ? deliveryFields.deliveryAddress.trim() : null,
    locality: isShipping ? deliveryFields.locality.trim() : null,
    postal_code: isShipping ? deliveryFields.postalCode.trim() : null,
    apartment: isShipping ? toNullableText(deliveryFields.apartment) : null,
    cross_streets: isShipping ? toNullableText(deliveryFields.crossStreets) : null,
    delivery_notes: isShipping ? toNullableText(deliveryFields.deliveryNotes) : null,
    subtotal: totals.subtotal,
    total: totals.total,
    payment_method: 'transfer',
    payment_status: 'pending_receipt',
    order_status: 'pending_payment',
  };
}

function logSupabaseError(context, error) {
  console.error(`ERROR SUPABASE (${context}):`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
  });
}

async function submitViaApi(payload) {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.status === 503) {
      return { ok: false, skipped: true };
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return {
        ok: false,
        error: {
          message: body.error ?? 'Order API request failed',
          code: body.code,
        },
      };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, skipped: true, error };
  }
}

async function submitViaRpc(payload) {
  const { error } = await supabase.rpc('create_public_order', { payload });

  if (error) {
    logSupabaseError('rpc', error);
    return { ok: false, error };
  }

  return { ok: true };
}

async function submitViaInsert(payload) {
  const { error } = await supabase.from('orders').insert(payload);

  if (error) {
    logSupabaseError('insert', error);
    return { ok: false, error };
  }

  return { ok: true };
}

export async function submitOrderToSupabase(
  items,
  orderNotes = '',
  checkoutData = {},
) {
  const payload = buildSupabaseOrderPayload(items, orderNotes, checkoutData);

  if (import.meta.env.PROD) {
    const apiResult = await submitViaApi(payload);
    if (apiResult.ok) return { ok: true };
    if (!apiResult.skipped) return { ok: false, error: apiResult.error };
  }

  const rpcResult = await submitViaRpc(payload);
  if (rpcResult.ok) return { ok: true };

  const isMissingRpc =
    rpcResult.error?.code === '42883' ||
    rpcResult.error?.code === 'PGRST202' ||
    rpcResult.error?.message?.includes('create_public_order');

  if (!isMissingRpc) {
    return { ok: false, error: rpcResult.error };
  }

  return submitViaInsert(payload);
}
