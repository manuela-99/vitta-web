import { DELIVERY_METHODS, isShippingDelivery } from '../../constants/delivery';
import { buildCartItemMetaParts } from '../../utils/cartItem';
import { shouldShowPresentationInCart } from '../../utils/cartDisplay';
import { formatPrice } from '../../utils/price';
import CheckoutStepActions from './CheckoutStepActions';
import CartDiscountSummary from './CartDiscountSummary';
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

export default function CheckoutStepConfirm({
  items,
  orderNotes,
  deliveryMethod,
  deliveryFields,
  orderTotals,
  onBack,
  whatsappLink,
  onWhatsAppClick,
  error,
}) {
  const isShipping = isShippingDelivery(deliveryMethod);
  const deliverySummary = getDeliverySummaryParts(deliveryMethod, orderTotals.deliveryFee);

  return (
    <div className="cart-checkout-step cart-checkout-step--confirm">
      <div className="cart-checkout-step__content cart-checkout-step__content--confirm">
        <section
          className="cart-checkout-payment cart-checkout-payment--highlight"
          aria-labelledby="cart-payment-heading"
        >
          <h3 id="cart-payment-heading" className="cart-checkout-payment__title">
            Pagá por transferencia
          </h3>
          <p className="cart-checkout-payment__text">
            Al enviar el pedido, se abrirá WhatsApp con el detalle de la compra y los datos para
            realizar el pago.
          </p>
          <p className="cart-checkout-payment__notice">
            El pedido se confirma al recibir el comprobante.
          </p>
        </section>

        <section className="cart-checkout-review" aria-labelledby="cart-review-heading">
          <h3 id="cart-review-heading" className="cart-checkout-review__heading">
            Resumen del pedido
          </h3>

          <div className="cart-checkout-review__products">
            <ul className="cart-checkout-review__items">
              {items.map((item) => {
                const metaParts = buildCartItemMetaParts(item, {
                  includePresentation: shouldShowPresentationInCart(item),
                });

                return (
                  <li key={item.productId} className="cart-checkout-review__item">
                    <div className="cart-checkout-review__item-head">
                      <span className="cart-checkout-review__item-name">{item.name}</span>
                      <span className="menu-price cart-num cart-checkout-review__item-price">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                    <p className="cart-checkout-review__item-meta">{metaParts.join(' · ')}</p>
                  </li>
                );
              })}
            </ul>

            {orderNotes.trim() && (
              <p className="cart-checkout-review__notes">
                <span className="cart-checkout-review__notes-label">Aclaraciones:</span>{' '}
                {orderNotes.trim()}
              </p>
            )}
          </div>

          <div className="cart-drawer__order-summary cart-drawer__order-summary--review">
            {orderTotals.discountAmount > 0 ? (
              <>
                <div className="cart-drawer__order-summary-row">
                  <span>Subtotal</span>
                  <span className="menu-price cart-num">
                    {formatPrice(orderTotals.subtotalBeforeDiscount)}
                  </span>
                </div>
                <CartDiscountSummary orderTotals={orderTotals} />
              </>
            ) : null}
            {deliverySummary ? (
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
            ) : null}
            <div className="cart-drawer__order-summary-row cart-drawer__order-summary-row--total">
              <span>TOTAL</span>
              <span className="menu-price cart-num cart-num--lg">{formatPrice(orderTotals.total)}</span>
            </div>
          </div>
        </section>

        <section className="cart-checkout-review__contact" aria-labelledby="cart-contact-heading">
          <h4 id="cart-contact-heading" className="cart-checkout-review__contact-heading">
            Datos de contacto
          </h4>
          <div className="cart-checkout-review__contact-row">
            <div className="cart-checkout-review__contact-field">
              <span className="cart-checkout-review__contact-label">Nombre y apellido</span>
              <span className="cart-checkout-review__contact-value">
                {deliveryFields.recipientName.trim()}
              </span>
            </div>
            <div className="cart-checkout-review__contact-field cart-checkout-review__contact-field--phone">
              <span className="cart-checkout-review__contact-label">Teléfono</span>
              <span className="cart-checkout-review__contact-value">
                {deliveryFields.recipientPhone.trim()}
              </span>
            </div>
          </div>

          {isShipping ? (
            (deliveryFields.deliveryAddress.trim() ||
              deliveryFields.locality.trim() ||
              deliveryFields.postalCode.trim() ||
              deliveryFields.apartment?.trim() ||
              deliveryFields.deliveryNotes?.trim()) && (
              <div className="cart-checkout-review__address">
                {deliveryFields.deliveryAddress.trim() ? (
                  <p className="cart-checkout-review__address-line">
                    {deliveryFields.deliveryAddress.trim()}
                  </p>
                ) : null}
                {deliveryFields.locality.trim() ? (
                  <p className="cart-checkout-review__address-detail">
                    {deliveryFields.locality.trim()}
                  </p>
                ) : null}
                {deliveryFields.postalCode.trim() ? (
                  <p className="cart-checkout-review__address-detail">
                    {deliveryFields.postalCode.trim()}
                  </p>
                ) : null}
                {deliveryFields.apartment?.trim() ? (
                  <p className="cart-checkout-review__address-detail">
                    {deliveryFields.apartment.trim()}
                  </p>
                ) : null}
                {deliveryFields.deliveryNotes?.trim() ? (
                  <p className="cart-checkout-review__address-detail">
                    {deliveryFields.deliveryNotes.trim()}
                  </p>
                ) : null}
              </div>
            )
          ) : (
            <p className="cart-checkout-review__pickup-note">
              Dirección exacta y horario a coordinar por WhatsApp.
            </p>
          )}
        </section>

        <PreparationTimeNotice variant="important" />

        <CheckoutStepActions error={error} className="cart-checkout-step__footer--confirm">
          <button type="button" className="cart-drawer__checkout-secondary" onClick={onBack}>
            Volver a entrega
          </button>
          <a
            href={whatsappLink}
            className="cart-drawer__checkout"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
          >
            Enviar pedido por WhatsApp
          </a>
        </CheckoutStepActions>

        <div className="cart-checkout-confirm__logo">
          <img src="/images/logo-vitta-negro.png" alt="VITTA" />
        </div>
      </div>
    </div>
  );
}
