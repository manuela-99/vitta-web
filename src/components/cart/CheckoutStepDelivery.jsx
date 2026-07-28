import { DELIVERY_METHODS } from '../../constants/delivery';
import { formatPrice } from '../../utils/price';
import DeliverySection from './DeliverySection';
import CartDiscountSummary from './CartDiscountSummary';
import CheckoutStepActions from './CheckoutStepActions';
import PreparationTimeNotice from './PreparationTimeNotice';

function getDeliverySummaryParts(deliveryMethod, deliveryFee) {
  if (deliveryMethod === DELIVERY_METHODS.PICKUP) {
    return { label: 'Retiro por Béccar', value: 'Sin cargo', isPrice: false };
  }

  if (deliveryMethod === DELIVERY_METHODS.NORTH_ZONE) {
    return { label: 'Envío a Zona Norte', value: formatPrice(deliveryFee), isPrice: true };
  }

  if (deliveryMethod === DELIVERY_METHODS.CABA) {
    return { label: 'Envío a CABA', value: formatPrice(deliveryFee), isPrice: true };
  }

  return null;
}

export default function CheckoutStepDelivery({
  deliveryMethod,
  deliveryFields,
  fieldErrors,
  hasSavedCheckoutData,
  orderTotals,
  onMethodChange,
  onFieldChange,
  onClearSavedData,
  onBack,
  onContinue,
  error,
}) {
  const deliverySummary = getDeliverySummaryParts(deliveryMethod, orderTotals.deliveryFee);

  return (
    <div className="cart-checkout-step cart-checkout-step--delivery">
      <div className="cart-checkout-step__content">
        <DeliverySection
          deliveryMethod={deliveryMethod}
          deliveryFields={deliveryFields}
          fieldErrors={fieldErrors}
          hasSavedCheckoutData={hasSavedCheckoutData}
          onMethodChange={onMethodChange}
          onFieldChange={onFieldChange}
          onClearSavedData={onClearSavedData}
        />

        <PreparationTimeNotice />

        {deliverySummary ? (
          <div className="cart-drawer__order-summary cart-drawer__order-summary--delivery-step">
            <div className="cart-drawer__order-summary-row">
              <span>Subtotal</span>
              <span className="menu-price cart-num">
                {formatPrice(orderTotals.subtotalBeforeDiscount)}
              </span>
            </div>
            <CartDiscountSummary orderTotals={orderTotals} />
            {orderTotals.discountAmount > 0 ? (
              <div className="cart-drawer__order-summary-row">
                <span>Total productos</span>
                <span className="menu-price cart-num">{formatPrice(orderTotals.subtotal)}</span>
              </div>
            ) : null}
            <div className="cart-drawer__order-summary-row cart-drawer__order-summary-row--delivery">
              <span>{deliverySummary.label}</span>
              <span
                className={
                  deliverySummary.isPrice ? 'menu-price cart-num' : 'cart-checkout-review__delivery-free'
                }
              >
                {deliverySummary.value}
              </span>
            </div>
            <div className="cart-drawer__order-summary-row cart-drawer__order-summary-row--total">
              <span>Total</span>
              <span className="menu-price cart-num cart-num--lg">{formatPrice(orderTotals.total)}</span>
            </div>
          </div>
        ) : null}
      </div>

      <CheckoutStepActions error={error}>
        <button type="button" className="cart-drawer__checkout-secondary" onClick={onBack}>
          Volver al pedido
        </button>
        <button type="button" className="cart-drawer__checkout" onClick={onContinue}>
          Continuar con el pago
        </button>
      </CheckoutStepActions>
    </div>
  );
}
