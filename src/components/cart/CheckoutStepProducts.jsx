import CartLineItem from './CartLineItem';
import CartDiscountSummary from './CartDiscountSummary';
import CheckoutStepActions from './CheckoutStepActions';
import PreparationTimeNotice from './PreparationTimeNotice';
import { formatPrice } from '../../utils/price';

export default function CheckoutStepProducts({
  items,
  orderNotes,
  orderTotals,
  onIncrement,
  onDecrement,
  onRemove,
  onUnitSinTaccChange,
  onOrderNotesChange,
  onContinue,
  error,
}) {
  return (
    <div className="cart-checkout-step cart-checkout-step--products">
      <div className="cart-checkout-step__content">
        <p className="cart-checkout-step__heading">Revisá tu pedido</p>

        <ul className="cart-drawer__list cart-drawer__list--checkout-products">
          {items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              onIncrement={() => onIncrement(item.productId)}
              onDecrement={() => onDecrement(item.productId)}
              onRemove={() => onRemove(item.productId)}
              onUnitSinTaccChange={(unitIndex, value) =>
                onUnitSinTaccChange(item.productId, unitIndex, value)
              }
            />
          ))}
        </ul>

        <div className="cart-drawer__order-notes cart-drawer__order-notes--step">
          <label className="cart-drawer__order-notes-label" htmlFor="cart-order-notes">
            ¿Querés aclarar algo?
          </label>
          <textarea
            id="cart-order-notes"
            className="cart-drawer__order-notes-input"
            value={orderNotes}
            placeholder="Ej.: sin cebolla, salsa aparte o indicaciones generales."
            onChange={(event) => onOrderNotesChange(event.target.value)}
          />
        </div>

        <PreparationTimeNotice />

        <div className="cart-drawer__order-summary cart-drawer__order-summary--step">
          <div className="cart-drawer__order-summary-row">
            <span>Subtotal</span>
            <span className="menu-price cart-num">{formatPrice(orderTotals.subtotalBeforeDiscount)}</span>
          </div>
          <CartDiscountSummary orderTotals={orderTotals} />
          {orderTotals.discountAmount > 0 ? (
            <div className="cart-drawer__order-summary-row cart-drawer__order-summary-row--total">
              <span>Total productos</span>
              <span className="menu-price cart-num">{formatPrice(orderTotals.subtotal)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <CheckoutStepActions error={error}>
        <button type="button" className="cart-drawer__checkout" onClick={onContinue}>
          Continuar con la entrega
        </button>
      </CheckoutStepActions>
    </div>
  );
}
