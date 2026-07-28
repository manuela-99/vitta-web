import { formatOrderDetail } from '../../utils/orderDetail';
import { formatPrice } from '../../utils/price';

export default function OrderConfirmation({ order, onClose }) {
  const detailText = formatOrderDetail(order);

  return (
    <div className="cart-drawer__confirmation">
      <p className="cart-drawer__confirmation-lead">Tu pedido fue registrado</p>
      <p className="cart-drawer__confirmation-note">
        Te redirigimos a WhatsApp para enviar el resumen. Si no se abrió, podés volver a intentarlo
        desde allí.
      </p>

      <div className="cart-drawer__confirmation-summary">
        <div className="cart-drawer__order-summary-row">
          <span>Subtotal</span>
          <span className="menu-price cart-num">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="cart-drawer__order-summary-row">
          <span>Modalidad de entrega</span>
          <span>{order.deliveryLabel}</span>
        </div>
        <div className="cart-drawer__order-summary-row">
          <span>Costo de envío</span>
          <span className="menu-price cart-num">
            {order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'Sin cargo'}
          </span>
        </div>
        <div className="cart-drawer__order-summary-row cart-drawer__order-summary-row--total">
          <span>Total</span>
          <span className="menu-price cart-num cart-num--lg">{formatPrice(order.total)}</span>
        </div>
        <div className="cart-drawer__order-summary-row">
          <span>Forma de pago</span>
          <span>{order.paymentMethod}</span>
        </div>
        <div className="cart-drawer__order-summary-row">
          <span>Estado</span>
          <span>{order.paymentStatus}</span>
        </div>
      </div>

      <div className="cart-drawer__confirmation-detail">
        <p className="cart-drawer__confirmation-detail-heading">Detalle del pedido</p>
        <pre className="cart-drawer__confirmation-detail-text">{detailText}</pre>
      </div>

      <button type="button" className="cart-drawer__checkout" onClick={onClose}>
        Cerrar
      </button>
    </div>
  );
}
