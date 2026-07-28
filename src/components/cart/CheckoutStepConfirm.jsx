import { DELIVERY_METHODS } from '../../constants/delivery';
import { canOfferSinTaccOption } from '../../utils/preparation';
import { shouldShowPresentationInCart } from '../../utils/cartDisplay';
import { formatPrice } from '../../utils/price';
import CheckoutStepActions from './CheckoutStepActions';

export default function CheckoutStepConfirm({
  items,
  orderNotes,
  deliveryMethod,
  deliveryFields,
  orderTotals,
  onBack,
  onSubmit,
  error,
  isSubmitting,
}) {
  const isDelivery = deliveryMethod === DELIVERY_METHODS.DELIVERY;

  return (
    <div className="cart-checkout-step">
      <div className="cart-checkout-step__content">
        <section className="cart-checkout-payment" aria-labelledby="cart-payment-heading">
          <h3 id="cart-payment-heading" className="cart-checkout-payment__title">
            Pago únicamente por transferencia
          </h3>
          <p className="cart-checkout-payment__text">
            Al enviar tu pedido, se abrirá una conversación de WhatsApp con todo el detalle de la
            compra. Te enviaremos por allí los datos para realizar la transferencia. Para confirmar
            el pedido, deberás enviarnos el comprobante de pago.
          </p>
          <p className="cart-checkout-payment__notice">
            El pedido se confirma únicamente después de recibir el comprobante de transferencia.
          </p>
        </section>

        <section className="cart-checkout-review" aria-labelledby="cart-review-heading">
          <h3 id="cart-review-heading" className="cart-checkout-review__heading">
            Resumen del pedido
          </h3>

          <ul className="cart-checkout-review__items">
            {items.map((item) => {
              const showPresentation = shouldShowPresentationInCart(item);
              const showSinTacc = item.sinTacc && canOfferSinTaccOption(item);

              return (
                <li key={item.productId} className="cart-checkout-review__item">
                  <div className="cart-checkout-review__item-head">
                    <span className="cart-checkout-review__item-name">
                      {item.name}
                      {showSinTacc ? ' — Sin TACC' : ''}
                    </span>
                    <span className="menu-price cart-num cart-checkout-review__item-price">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                  <p className="cart-checkout-review__item-meta">
                    {showPresentation && (
                      <>
                        <span>{item.presentationLabel}</span>
                        <span aria-hidden="true"> · </span>
                      </>
                    )}
                    Cantidad: {item.quantity}
                  </p>
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

          <div className="cart-drawer__order-summary cart-drawer__order-summary--review">
            <div className="cart-drawer__order-summary-row">
              <span>Subtotal</span>
              <span className="menu-price cart-num">{formatPrice(orderTotals.subtotal)}</span>
            </div>
            <div className="cart-drawer__order-summary-row">
              <span>Modalidad de entrega</span>
              <span>{isDelivery ? 'Envío a domicilio' : 'Retiro sin cargo por Béccar'}</span>
            </div>
            <div className="cart-drawer__order-summary-row">
              <span>Costo del envío</span>
              <span className="menu-price cart-num">
                {orderTotals.deliveryFee > 0
                  ? formatPrice(orderTotals.deliveryFee)
                  : 'Sin cargo'}
              </span>
            </div>
            <div className="cart-drawer__order-summary-row cart-drawer__order-summary-row--total">
              <span>Total final</span>
              <span className="menu-price cart-num cart-num--lg">
                {formatPrice(orderTotals.total)}
              </span>
            </div>
          </div>

          <div className="cart-checkout-review__contact">
            {isDelivery ? (
              <>
                <p className="cart-checkout-review__contact-heading">Datos de contacto</p>
                <p className="cart-checkout-review__contact-line">
                  <span>Nombre</span>
                  <span>{deliveryFields.recipientName.trim()}</span>
                </p>
                <p className="cart-checkout-review__contact-line">
                  <span>Teléfono</span>
                  <span>{deliveryFields.recipientPhone.trim()}</span>
                </p>
                <p className="cart-checkout-review__contact-line">
                  <span>Dirección</span>
                  <span>{deliveryFields.deliveryAddress.trim()}</span>
                </p>
                <p className="cart-checkout-review__contact-line">
                  <span>Localidad</span>
                  <span>{deliveryFields.locality.trim()}</span>
                </p>
                <p className="cart-checkout-review__contact-line">
                  <span>Código postal</span>
                  <span>{deliveryFields.postalCode.trim()}</span>
                </p>
                {deliveryFields.apartment?.trim() && (
                  <p className="cart-checkout-review__contact-line">
                    <span>Piso/departamento</span>
                    <span>{deliveryFields.apartment.trim()}</span>
                  </p>
                )}
                {deliveryFields.crossStreets?.trim() && (
                  <p className="cart-checkout-review__contact-line">
                    <span>Entre calles</span>
                    <span>{deliveryFields.crossStreets.trim()}</span>
                  </p>
                )}
                {deliveryFields.deliveryNotes?.trim() && (
                  <p className="cart-checkout-review__contact-line">
                    <span>Indicaciones</span>
                    <span>{deliveryFields.deliveryNotes.trim()}</span>
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="cart-checkout-review__contact-heading">Datos de contacto</p>
                <p className="cart-checkout-review__contact-line">
                  <span>Nombre y apellido</span>
                  <span>{deliveryFields.recipientName.trim()}</span>
                </p>
                <p className="cart-checkout-review__contact-line">
                  <span>Teléfono</span>
                  <span>{deliveryFields.recipientPhone.trim()}</span>
                </p>
                <p className="cart-checkout-review__pickup-note">
                  Retiro por Béccar. Dirección exacta y horario a coordinar por WhatsApp.
                </p>
              </>
            )}
          </div>

          <div className="cart-checkout-review__payment-status">
            <p className="cart-checkout-review__contact-line">
              <span>Forma de pago</span>
              <span>Transferencia</span>
            </p>
            <p className="cart-checkout-review__contact-line">
              <span>Estado</span>
              <span>Pendiente de pago</span>
            </p>
          </div>
        </section>
      </div>

      <CheckoutStepActions error={error}>
        <button type="button" className="cart-drawer__checkout-secondary" onClick={onBack}>
          Volver a entrega
        </button>
        <button
          type="button"
          className="cart-drawer__checkout"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando pedido…' : 'Enviar pedido por WhatsApp'}
        </button>
      </CheckoutStepActions>
    </div>
  );
}
