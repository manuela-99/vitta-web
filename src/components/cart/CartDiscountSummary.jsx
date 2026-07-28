import { formatPrice } from '../../utils/price';

export default function CartDiscountSummary({ orderTotals }) {
  if (!orderTotals?.discountAmount) return null;

  return (
    <div className="cart-drawer__order-summary-row cart-drawer__order-summary-row--discount">
      <span>Descuento Viandas ({orderTotals.discountPercent}% OFF)</span>
      <span className="menu-price cart-num">-{formatPrice(orderTotals.discountAmount)}</span>
    </div>
  );
}
