import { DELIVERY_METHODS } from '../constants/delivery';
import { formatPrice } from './price';

export function formatOrderDetail(order) {
  const lines = [
    `Pedido #${order.id}`,
    `Fecha: ${new Date(order.createdAt).toLocaleString('es-AR')}`,
    '',
    '── Productos ──',
  ];

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}${item.sinTacc ? ' — Sin TACC' : ''}`);
    lines.push(`   Cantidad: ${item.quantity} · Subtotal: ${formatPrice(item.subtotal)}`);
  });

  if (order.orderNotes?.trim()) {
    lines.push('');
    lines.push(`Aclaraciones: ${order.orderNotes.trim()}`);
  }

  lines.push('');
  lines.push('── Resumen ──');
  lines.push(`Subtotal: ${formatPrice(order.subtotal)}`);
  lines.push(`Modalidad de entrega: ${order.deliveryLabel}`);

  if (order.deliveryMethod === DELIVERY_METHODS.DELIVERY) {
    lines.push(`Costo del envío: ${formatPrice(order.deliveryFee)}`);
  } else {
    lines.push('Costo del envío: Sin cargo');
  }

  lines.push(`Total final: ${formatPrice(order.total)}`);
  lines.push(`Forma de pago: ${order.paymentMethod}`);
  lines.push(`Estado del pago: ${order.paymentStatus}`);

  lines.push('');
  lines.push('── Entrega ──');

  if (order.deliveryMethod === DELIVERY_METHODS.PICKUP) {
    lines.push('Retiro sin cargo por Béccar');
    lines.push(`Nombre: ${order.recipientName}`);
    lines.push(`Teléfono: ${order.recipientPhone}`);
    lines.push('Dirección y horario a coordinar por WhatsApp');
  } else {
    lines.push(`Destinatario: ${order.recipientName}`);
    lines.push(`Teléfono: ${order.recipientPhone}`);
    lines.push(`Dirección: ${order.deliveryAddress}`);
    lines.push(`Localidad: ${order.locality}`);
    lines.push(`Código postal: ${order.postalCode}`);
    if (order.apartment?.trim()) lines.push(`Piso/Depto: ${order.apartment.trim()}`);
    if (order.crossStreets?.trim()) lines.push(`Entre calles: ${order.crossStreets.trim()}`);
    if (order.deliveryNotes?.trim()) lines.push(`Indicaciones: ${order.deliveryNotes.trim()}`);
  }

  return lines.join('\n');
}
