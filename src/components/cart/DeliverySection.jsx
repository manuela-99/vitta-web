import { DELIVERY_FEE, DELIVERY_METHODS } from '../../constants/delivery';
import { formatPrice } from '../../utils/price';

const DELIVERY_HINT = 'Completá tus datos para continuar';

const DELIVERY_OPTIONS = [
  {
    value: DELIVERY_METHODS.PICKUP,
    title: 'Retiro sin cargo por Béccar',
    description:
      'Cuando tu pedido esté listo, te enviaremos la dirección exacta y el horario de retiro por WhatsApp.',
  },
  {
    value: DELIVERY_METHODS.DELIVERY,
    title: 'Envío a domicilio',
    price: DELIVERY_FEE,
    description:
      'Completá los datos de entrega. Cuando tu pedido esté listo, coordinaremos el envío por WhatsApp.',
  },
];

const PICKUP_FIELD_CONFIG = [
  { key: 'recipientName', label: 'Nombre y apellido', required: true },
  { key: 'recipientPhone', label: 'Teléfono', required: true, type: 'tel' },
];

const CONTACT_FIELD_CONFIG = [
  { key: 'recipientName', label: 'Nombre y apellido', required: true },
  { key: 'recipientPhone', label: 'Teléfono', required: true, type: 'tel' },
];

const DELIVERY_ADDRESS_FIELD_CONFIG = [
  { key: 'deliveryAddress', label: 'Calle y número', required: true },
  { key: 'locality', label: 'Localidad', required: true },
  { key: 'postalCode', label: 'Código postal', required: true },
  { key: 'apartment', label: 'Piso o departamento (opcional)', required: false },
  { key: 'crossStreets', label: 'Entre calles (opcional)', required: false },
  { key: 'deliveryNotes', label: 'Indicaciones adicionales (opcional)', required: false, multiline: true },
];

function DeliveryFields({ fields, deliveryFields, onFieldChange, heading, fieldErrors = {} }) {
  return (
    <div className="cart-drawer__delivery-fields">
      {heading && <p className="cart-drawer__delivery-fields-heading">{heading}</p>}
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
  fieldErrors = {},
}) {
  const isPickup = deliveryMethod === DELIVERY_METHODS.PICKUP;
  const isDelivery = deliveryMethod === DELIVERY_METHODS.DELIVERY;
  const showHint = isPickup || isDelivery;

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
                  {option.price != null ? (
                    <>
                      {option.title}
                      {' — '}
                      <span className="menu-price cart-num cart-num--md">
                        {formatPrice(option.price)}
                      </span>
                    </>
                  ) : (
                    option.title
                  )}
                </span>
                <span className="cart-drawer__delivery-option-description">{option.description}</span>
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
        />
      )}

      {isDelivery && (
        <>
          <DeliveryFields
            fields={CONTACT_FIELD_CONFIG}
            deliveryFields={deliveryFields}
            onFieldChange={onFieldChange}
            fieldErrors={fieldErrors}
            heading="Datos de quien recibe"
          />
          <DeliveryFields
            fields={DELIVERY_ADDRESS_FIELD_CONFIG}
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
