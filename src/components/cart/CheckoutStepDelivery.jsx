import DeliverySection from './DeliverySection';
import CheckoutStepActions from './CheckoutStepActions';

export default function CheckoutStepDelivery({
  deliveryMethod,
  deliveryFields,
  fieldErrors,
  onMethodChange,
  onFieldChange,
  onBack,
  onContinue,
  error,
}) {
  return (
    <div className="cart-checkout-step">
      <div className="cart-checkout-step__content">
        <DeliverySection
          deliveryMethod={deliveryMethod}
          deliveryFields={deliveryFields}
          fieldErrors={fieldErrors}
          onMethodChange={onMethodChange}
          onFieldChange={onFieldChange}
        />
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
