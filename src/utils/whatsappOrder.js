import { WHATSAPP_NUMBER } from '../data/whatsapp';
import { formatPrice, formatWeight } from './price';

export function computeCartTotals(items) {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalWeightGrams = items.reduce(
    (sum, item) => sum + (item.totalWeightGrams ?? 0),
    0,
  );

  return { totalUnits, totalAmount, totalWeightGrams };
}

export function validateCartForOrder(items) {
  if (items.length === 0) {
    return { valid: false, reason: 'empty' };
  }

  return { valid: true };
}

export function buildOrderWhatsAppMessage(items, orderNotes = '') {
  const totals = computeCartTotals(items);
  const trimmedNotes = orderNotes.trim();
  const lines = ['Hola Vitta, quiero realizar este pedido:', ''];

  items.forEach((item, index) => {
    const itemTitle = item.sinTacc ? `${item.name} — Sin TACC` : item.name;
    lines.push(`${index + 1}. ${itemTitle}`);
    lines.push(`• Presentación: ${item.presentationLabel}`);
    lines.push(`• Cantidad: ${item.quantity}`);
    if (item.totalWeightGrams) {
      lines.push(`• Peso total: ${formatWeight(item.totalWeightGrams)}`);
    }
    lines.push(`• Subtotal: ${formatPrice(item.subtotal)}`);
    lines.push('');
  });

  if (trimmedNotes) {
    lines.push('Aclaraciones del pedido:');
    lines.push(trimmedNotes);
    lines.push('');
  }

  lines.push('────────────────');
  lines.push(`Cantidad total: ${totals.totalUnits} unidades`);
  if (totals.totalWeightGrams > 0) {
    lines.push(`Peso total: ${formatWeight(totals.totalWeightGrams)}`);
  }
  lines.push(`TOTAL: ${formatPrice(totals.totalAmount)}`);
  lines.push('────────────────');
  lines.push('');
  lines.push('Quisiera coordinar la entrega y el medio de pago. ¡Gracias!');

  return { message: lines.join('\n'), totals };
}

export function getOrderWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
