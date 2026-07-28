import {
  DELIVERY_LABELS,
  DELIVERY_METHODS,
  EMPTY_DELIVERY_FIELDS,
  getDeliveryFee,
  isShippingDelivery,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from '../constants/delivery';
import { PREPARATION_TIME_IMPORTANT_TEXT } from '../constants/checkout';
import { WHATSAPP_NUMBER } from '../data/whatsapp';
import { shouldShowPresentationInWhatsApp } from './cartDisplay';
import { canOfferSinTaccOption } from './preparation';
import { formatPrice } from './price';
import { computeViandasPromotion } from './viandasPromotion';

export function computeCartTotals(items) {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalBeforeDiscount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalWeightGrams = items.reduce(
    (sum, item) => sum + (item.totalWeightGrams ?? 0),
    0,
  );
  const promotion = computeViandasPromotion(items);

  return {
    totalUnits,
    subtotalBeforeDiscount,
    discountPercent: promotion.discountPercent,
    discountAmount: promotion.discountAmount,
    totalAmount: subtotalBeforeDiscount - promotion.discountAmount,
    totalWeightGrams,
  };
}

export function computeOrderTotals(items, deliveryMethod) {
  const cartTotals = computeCartTotals(items);
  const subtotal = cartTotals.totalAmount;
  const deliveryFee = getDeliveryFee(deliveryMethod);
  const total = subtotal + deliveryFee;

  return {
    ...cartTotals,
    subtotal,
    deliveryFee,
    total,
  };
}

export function validateCartForOrder(items) {
  if (items.length === 0) {
    return { valid: false, reason: 'empty' };
  }

  return { valid: true };
}

export function validateCheckout(items, deliveryMethod, deliveryFields = EMPTY_DELIVERY_FIELDS) {
  const cartValidation = validateCartForOrder(items);
  if (!cartValidation.valid) {
    return cartValidation;
  }

  if (!deliveryMethod) {
    return { valid: false, reason: 'delivery-method' };
  }

  if (deliveryMethod === DELIVERY_METHODS.PICKUP) {
    const required = [
      { key: 'recipientName', message: 'Completá nombre y apellido.' },
      { key: 'recipientPhone', message: 'Completá tu teléfono.' },
    ];
    const fieldErrors = {};

    for (const field of required) {
      if (!deliveryFields[field.key]?.trim()) {
        fieldErrors[field.key] = field.message;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        valid: false,
        reason: 'delivery-fields',
        fieldErrors,
      };
    }
  }

  if (isShippingDelivery(deliveryMethod)) {
    const required = [
      { key: 'recipientName', message: 'Completá nombre y apellido.' },
      { key: 'recipientPhone', message: 'Completá tu teléfono.' },
      { key: 'deliveryAddress', message: 'Completá calle y número.' },
      { key: 'locality', message: 'Completá la localidad o barrio.' },
      { key: 'postalCode', message: 'Completá el código postal.' },
    ];
    const fieldErrors = {};

    for (const field of required) {
      if (!deliveryFields[field.key]?.trim()) {
        fieldErrors[field.key] = field.message;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        valid: false,
        reason: 'delivery-fields',
        fieldErrors,
      };
    }
  }

  return { valid: true };
}

function buildWhatsAppDataSection(deliveryMethod, deliveryFields) {
  if (isShippingDelivery(deliveryMethod)) {
    const lines = [
      '',
      'DATOS',
      `Nombre: ${deliveryFields.recipientName.trim()}`,
      `Teléfono: ${deliveryFields.recipientPhone.trim()}`,
      `Dirección: ${deliveryFields.deliveryAddress.trim()}`,
      `Localidad: ${deliveryFields.locality.trim()}`,
      `Código postal: ${deliveryFields.postalCode.trim()}`,
    ];

    if (deliveryFields.apartment?.trim()) {
      lines.push(`Piso o departamento: ${deliveryFields.apartment.trim()}`);
    }
    if (deliveryFields.deliveryNotes?.trim()) {
      lines.push(`Referencias de entrega: ${deliveryFields.deliveryNotes.trim()}`);
    }

    return lines;
  }

  return [
    '',
    'DATOS',
    `Nombre: ${deliveryFields.recipientName.trim()}`,
    `Teléfono: ${deliveryFields.recipientPhone.trim()}`,
    'Retiro por Béccar. Dirección exacta y horario a coordinar por WhatsApp.',
  ];
}

export function buildOrderWhatsAppMessage(
  items,
  orderNotes = '',
  { deliveryMethod, deliveryFields = EMPTY_DELIVERY_FIELDS } = {},
) {
  const totals = computeOrderTotals(items, deliveryMethod);
  const trimmedNotes = orderNotes.trim();
  const lines = ['Hola Vitta, quiero realizar este pedido:', '', 'PEDIDO'];

  items.forEach((item) => {
    const itemTitle =
      item.sinTacc && canOfferSinTaccOption(item)
        ? `${item.name} — Sin TACC`
        : item.name;
    const detailParts = [`× ${item.quantity}`];

    if (shouldShowPresentationInWhatsApp(item)) {
      detailParts.unshift(item.presentationLabel);
    }

    lines.push(`• ${itemTitle} (${detailParts.join(' ')}) — ${formatPrice(item.subtotal)}`);
  });

  if (trimmedNotes) {
    lines.push(`Aclaraciones: ${trimmedNotes}`);
  }

  lines.push('');
  lines.push(`Subtotal: ${formatPrice(totals.subtotalBeforeDiscount)}`);

  if (totals.discountAmount > 0) {
    lines.push(
      `Descuento Viandas (${totals.discountPercent}% OFF): -${formatPrice(totals.discountAmount)}`,
    );
  }

  lines.push(`Entrega: ${DELIVERY_LABELS[deliveryMethod] ?? deliveryMethod}`);

  if (deliveryMethod === DELIVERY_METHODS.PICKUP) {
    lines.push('Costo de envío: Sin cargo');
  } else {
    lines.push(`Costo de envío: ${formatPrice(totals.deliveryFee)}`);
  }

  lines.push(`Total: ${formatPrice(totals.total)}`);
  lines.push(...buildWhatsAppDataSection(deliveryMethod, deliveryFields));
  lines.push('');
  lines.push(`Forma de pago: ${PAYMENT_METHOD}`);
  lines.push(`Estado: ${PAYMENT_STATUS}`);
  lines.push('');
  lines.push(PREPARATION_TIME_IMPORTANT_TEXT);
  lines.push('');
  lines.push(
    'Quedo a la espera de los datos para realizar la transferencia. Enviaré el comprobante por este medio para confirmar el pedido.',
  );

  return { message: lines.join('\n'), totals };
}

export function buildOrderRecord(
  items,
  orderNotes = '',
  { deliveryMethod, deliveryFields = EMPTY_DELIVERY_FIELDS } = {},
) {
  const totals = computeOrderTotals(items, deliveryMethod);
  const isShipping = isShippingDelivery(deliveryMethod);

  return {
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    items: items.map((item) => ({
      productId: item.productId,
      name: item.name,
      presentationLabel: item.presentationLabel,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      sinTacc: item.sinTacc ?? false,
      totalWeightGrams: item.totalWeightGrams ?? null,
    })),
    orderNotes: orderNotes.trim(),
    deliveryMethod,
    deliveryLabel: DELIVERY_LABELS[deliveryMethod],
    deliveryFee: totals.deliveryFee,
    subtotalBeforeDiscount: totals.subtotalBeforeDiscount,
    discountPercent: totals.discountPercent,
    discountAmount: totals.discountAmount,
    subtotal: totals.subtotal,
    total: totals.total,
    recipientName: deliveryFields.recipientName.trim(),
    recipientPhone: deliveryFields.recipientPhone.trim(),
    deliveryAddress: isShipping ? deliveryFields.deliveryAddress.trim() : '',
    locality: isShipping ? deliveryFields.locality.trim() : '',
    postalCode: isShipping ? deliveryFields.postalCode.trim() : '',
    apartment: isShipping ? (deliveryFields.apartment?.trim() ?? '') : '',
    crossStreets: isShipping ? (deliveryFields.crossStreets?.trim() ?? '') : '',
    deliveryNotes: isShipping ? (deliveryFields.deliveryNotes?.trim() ?? '') : '',
    paymentMethod: PAYMENT_METHOD,
    paymentStatus: PAYMENT_STATUS,
  };
}

export function getOrderWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function isValidOrderWhatsAppUrl(whatsappUrl, message) {
  if (WHATSAPP_NUMBER !== '5491156440224') {
    return false;
  }

  const expectedLink = getOrderWhatsAppLink(message);
  if (whatsappUrl !== expectedLink) {
    return false;
  }

  const isWaMe = whatsappUrl.startsWith(`https://wa.me/${WHATSAPP_NUMBER}`);
  const isApi = whatsappUrl.startsWith(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`);

  if (!isWaMe && !isApi) {
    return false;
  }

  try {
    const url = new URL(whatsappUrl);
    return url.searchParams.get('text') === message;
  } catch {
    return false;
  }
}

export function getCheckoutErrorMessage(reason, validationMessage) {
  if (reason === 'empty') return 'Tu carrito está vacío.';
  if (reason === 'delivery-method') return 'Elegí cómo querés recibir tu pedido.';
  if (reason === 'delivery-fields') return 'Completá todos tus datos para continuar.';
  return 'No pudimos confirmar el pedido. Intentá nuevamente.';
}
