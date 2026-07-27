import { formatPrice } from '../../utils/price';
import { canOfferSinTaccOption } from '../../utils/preparation';

export default function CartLineItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onSinTaccChange,
}) {
  const showSinTaccOption = canOfferSinTaccOption({ preparationMode: item.preparationMode });
  const checkboxId = `cart-sin-tacc-${item.productId}`;

  return (
    <li className="cart-drawer__item">
      <div className="cart-item__main">
        <p className="cart-drawer__item-name">{item.name}</p>
        <p className="cart-drawer__item-meta">
          <span className="cart-num cart-num--sm">{item.presentationLabel}</span>
          {' × '}
          <span className="cart-num cart-num--md">{item.quantity}</span>
        </p>
        {item.sinTacc && showSinTaccOption && (
          <p className="cart-item__prep-summary">Preparación: Sin TACC</p>
        )}
        <p className="cart-drawer__item-price menu-price cart-num cart-num--md">
          {formatPrice(item.subtotal)}
        </p>
      </div>

      <div className="cart-drawer__item-actions">
        <div className="cart-qty">
          <button
            type="button"
            className="cart-qty__btn"
            onClick={onDecrement}
            aria-label={`Reducir ${item.name}`}
          >
            −
          </button>
          <span className="cart-qty__value">{item.quantity}</span>
          <button
            type="button"
            className="cart-qty__btn"
            onClick={onIncrement}
            aria-label={`Aumentar ${item.name}`}
          >
            +
          </button>
        </div>
        <button type="button" className="cart-drawer__remove" onClick={onRemove}>
          Eliminar
        </button>
      </div>

      {showSinTaccOption && (
        <label className="cart-item__sin-tacc" htmlFor={checkboxId}>
          <input
            id={checkboxId}
            type="checkbox"
            className="cart-item__sin-tacc-input"
            checked={item.sinTacc}
            onChange={(event) => onSinTaccChange(event.target.checked)}
          />
          <span className="cart-item__sin-tacc-box" aria-hidden="true">
            {item.sinTacc && <span className="cart-item__sin-tacc-check">✓</span>}
          </span>
          <span className="cart-item__sin-tacc-label">Preparar Sin TACC</span>
        </label>
      )}
    </li>
  );
}
