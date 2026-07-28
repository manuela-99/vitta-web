import {
  DELIVERY_FEES,
  DELIVERY_METHODS,
} from '../../constants/delivery';
import { formatPrice } from '../../utils/price';

const DELIVERY_HINT = 'Completá tus datos para continuar';

const DELIVERY_OPTIONS = [
  {
    value: DELIVERY_METHODS.PICKUP,
    title: 'Retiro por Béccar',
    priceLabel: 'Sin cargo',
  },
  {
    value: DELIVERY_METHODS.NORTH_ZONE,
    title: 'Envío a Zona Norte',
    priceLabel: formatPrice(DELIVERY_FEES[DELIVERY_METHODS.NORTH_ZONE]),
  },
  {
    value: DELIVERY_METHODS.CABA,
    title: 'Envío a CABA',
    priceLabel: formatPrice(DELIVERY_FEES[DELIVERY_METHODS.CABA]),
  },
];

const PICKUP_FIELD_CONFIG = [
  { key: 'recipientName', label: 'Nombre y apellido', required: true },
  { key: 'recipientPhone', label: 'Teléfono', required: true, type: 'tel' },
];

const SHIPPING_CONTACT_FIELD_CONFIG = [
  { key: 'recipientName', label: 'Nombre y apellido', required: true },
  { key: 'recipientPhone', label: 'Teléfono', required: true, type: 'tel' },
];

const SHIPPING_ADDRESS_FIELD_CONFIG = [
  { key: 'deliveryAddress', label: 'Calle y número', required: true },
  { key: 'locality', label: 'Localidad o barrio', required: true },
  { key: 'postalCode', label: 'Código postal', required: true },
  { key: 'apartment', label: 'Piso o departamento (opcional)', required: false },
  {
    key: 'deliveryNotes',
    label: 'Referencias de entrega (opcional)',
    required: false,
    multiline: true,
  },
];

function DeliveryFields({
  fields,
  deliveryFields,
  onFieldChange,
  heading,
  headingAction,
  fieldErrors = {},
}) {
  return (
    <div className="cart-drawer__delivery-fields">
      {(heading || headingAction) && (
        <div className="cart-drawer__delivery-fields-head">
          {heading ? <p className="cart-drawer__delivery-fields-heading">{heading}</p> : null}
          {headingAction}
        </div>
      )}
      {fields.map((field) => {
        const fieldId = `cart-delivery-field-${field.key}`;
        const commonProps = {
          id: fieldId,
          className: field.multiline
            ? 'cart-drawer__delivery-textarea'
            : 'cart-drawer__delivery-input',
          value: deliveryFields[field.key] ?? '',
          onChange: (event) => onFieldChange(field.key, event.target.value),
          'aria-invalid': fieldErrors[field.key] ? true : undefined,
          'aria-describedby': fieldErrors[field.key] ? `${fieldId}-error` : undefined,
        };

        return (
          <div key={field.key} className="cart-drawer__delivery-field">
            <label className="cart-drawer__delivery-field-label" htmlFor={fieldId}>
              {field.label}
            </label>
            {field.multiline ? (
              <textarea {...commonProps} rows={3} />
            ) : (
              <input {...commonProps} type={field.type ?? 'text'} autoComplete="off" />
            )}
            {fieldErrors[field.key] ? (
              <p
                id={`${fieldId}-error`}
                className="cart-drawer__delivery-field-error"
                role="alert"
              >
                {fieldErrors[field.key]}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function DeliverySection({
  deliveryMethod,
  deliveryFields,
  onMethodChange,
  onFieldChange,
  onClearSavedData,
  hasSavedCheckoutData = false,
  fieldErrors = {},
}) {
  const isPickup = deliveryMethod === DELIVERY_METHODS.PICKUP;
  const isShipping =
    deliveryMethod === DELIVERY_METHODS.NORTH_ZONE ||
    deliveryMethod === DELIVERY_METHODS.CABA;
  const showHint = isPickup || isShipping;

  const clearSavedDataButton =
    hasSavedCheckoutData && onClearSavedData ? (
      <button
        type="button"
        className="cart-drawer__clear-saved-data"
        onClick={onClearSavedData}
      >
        Borrar datos guardados
      </button>
    ) : null;

  return (
    <section className="cart-drawer__delivery" aria-labelledby="cart-delivery-heading">
      <h3 id="cart-delivery-heading" className="cart-drawer__delivery-heading">
        ¿Cómo querés recibir tu pedido?
      </h3>

      <div className="cart-drawer__delivery-options" role="radiogroup" aria-labelledby="cart-delivery-heading">
        {DELIVERY_OPTIONS.map((option) => {
          const inputId = `cart-delivery-${option.value}`;
          const isSelected = deliveryMethod === option.value;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`cart-drawer__delivery-option${isSelected ? ' cart-drawer__delivery-option--selected' : ''}`}
            >
              <input
                id={inputId}
                type="radio"
                name="cart-delivery-method"
                className="cart-drawer__delivery-option-input"
                value={option.value}
                checked={isSelected}
                onChange={() => onMethodChange(option.value)}
              />
              <span className="cart-drawer__delivery-option-indicator" aria-hidden="true" />
              <span className="cart-drawer__delivery-option-content">
                <span className="cart-drawer__delivery-option-title">
                  {option.title}
                  {' · '}
                  <span className="menu-price cart-num cart-num--md">{option.priceLabel}</span>
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {showHint && <p className="cart-drawer__delivery-hint">{DELIVERY_HINT}</p>}

      {isPickup && (
        <DeliveryFields
          fields={PICKUP_FIELD_CONFIG}
          deliveryFields={deliveryFields}
          onFieldChange={onFieldChange}
          fieldErrors={fieldErrors}
          heading="Datos de contacto"
          headingAction={clearSavedDataButton}
        />
      )}

      {isShipping && (
        <>
          <DeliveryFields
            fields={SHIPPING_CONTACT_FIELD_CONFIG}
            deliveryFields={deliveryFields}
            onFieldChange={onFieldChange}
            fieldErrors={fieldErrors}
            heading="Datos de contacto"
            headingAction={clearSavedDataButton}
          />
          <DeliveryFields
            fields={SHIPPING_ADDRESS_FIELD_CONFIG}
            deliveryFields={deliveryFields}
            onFieldChange={onFieldChange}
            fieldErrors={fieldErrors}
            heading="Dirección de entrega"
          />
        </>
      )}
    </section>
  );
}
