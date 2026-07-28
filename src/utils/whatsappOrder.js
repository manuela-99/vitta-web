import {
  DELIVERY_FEE,
  DELIVERY_LABELS,
  DELIVERY_METHODS,
  EMPTY_DELIVERY_FIELDS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from '../constants/delivery';
import { WHATSAPP_NUMBER } from '../data/whatsapp';
import { shouldShowPresentationInWhatsApp } from './cartDisplay';
import { canOfferSinTaccOption } from './preparation';
import { formatPrice } from './price';

export function computeCartTotals(items) {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalWeightGrams = items.reduce(
    (sum, item) => sum + (item.totalWeightGrams ?? 0),
    0,
  );

  return { totalUnits, totalAmount, totalWeightGrams };
}

export function computeOrderTotals(items, deliveryMethod) {
  const cartTotals = computeCartTotals(items);
  const subtotal = cartTotals.totalAmount;
  const deliveryFee =
    deliveryMethod === DELIVERY_METHODS.DELIVERY ? DELIVERY_FEE : 0;
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

  if (deliveryMethod === DELIVERY_METHODS.DELIVERY) {
    const required = [
      { key: 'recipientName', message: 'Completá nombre y apellido.' },
      { key: 'recipientPhone', message: 'Completá tu teléfono.' },
      { key: 'deliveryAddress', message: 'Completá calle y número.' },
      { key: 'locality', message: 'Completá la localidad.' },
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
  if (deliveryMethod === DELIVERY_METHODS.DELIVERY) {
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
      lines.push(`Piso/departamento: ${deliveryFields.apartment.trim()}`);
    }
    if (deliveryFields.crossStreets?.trim()) {
      lines.push(`Entre calles: ${deliveryFields.crossStreets.trim()}`);
    }
    if (deliveryFields.deliveryNotes?.trim()) {
      lines.push(`Indicaciones: ${deliveryFields.deliveryNotes.trim()}`);
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
  lines.push(`Subtotal: ${formatPrice(totals.subtotal)}`);

  if (deliveryMethod === DELIVERY_METHODS.DELIVERY) {
    lines.push('Entrega: Envío a domicilio');
    lines.push(`Costo de envío: ${formatPrice(totals.deliveryFee)}`);
  } else {
    lines.push('Entrega: Retiro sin cargo por Béccar');
    lines.push('Costo de envío: Sin cargo');
  }

  lines.push(`Total: ${formatPrice(totals.total)}`);
  lines.push(...buildWhatsAppDataSection(deliveryMethod, deliveryFields));
  lines.push('');
  lines.push(`Forma de pago: ${PAYMENT_METHOD}`);
  lines.push(`Estado: ${PAYMENT_STATUS}`);
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
  const isDelivery = deliveryMethod === DELIVERY_METHODS.DELIVERY;

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
    subtotal: totals.subtotal,
    total: totals.total,
    recipientName: deliveryFields.recipientName.trim(),
    recipientPhone: deliveryFields.recipientPhone.trim(),
    deliveryAddress: isDelivery ? deliveryFields.deliveryAddress.trim() : '',
    locality: isDelivery ? deliveryFields.locality.trim() : '',
    postalCode: isDelivery ? deliveryFields.postalCode.trim() : '',
    apartment: isDelivery ? (deliveryFields.apartment?.trim() ?? '') : '',
    crossStreets: isDelivery ? (deliveryFields.crossStreets?.trim() ?? '') : '',
    deliveryNotes: isDelivery ? (deliveryFields.deliveryNotes?.trim() ?? '') : '',
    paymentMethod: PAYMENT_METHOD,
    paymentStatus: PAYMENT_STATUS,
  };
}

export function getOrderWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getCheckoutErrorMessage(reason, validationMessage) {
  if (reason === 'empty') return 'Tu carrito está vacío.';
  if (reason === 'delivery-method') return 'Elegí cómo querés recibir tu pedido.';
  if (reason === 'delivery-fields') return 'Completá todos tus datos para continuar.';
  return 'No pudimos confirmar el pedido. Intentá nuevamente.';
}
