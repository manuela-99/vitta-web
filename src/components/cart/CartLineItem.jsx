import { formatPrice } from '../../utils/price';
import { canOfferSinTaccOption } from '../../utils/preparation';
import { shouldShowPresentationInCart } from '../../utils/cartDisplay';

export default function CartLineItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onSinTaccChange,
}) {
  const showSinTaccOption = canOfferSinTaccOption(item);
  const showPresentation = shouldShowPresentationInCart(item);
  const minQuantity = item.minQuantity ?? 1;
  const checkboxId = `cart-sin-tacc-${item.productId}`;

  return (
    <li className="cart-drawer__item">
      <div className="cart-item__head">
        <div className="cart-item__title-block">
          <p className="cart-drawer__item-name">{item.name}</p>
          {showPresentation && (
            <p className="cart-item__size">
              <span className="cart-num cart-num--sm">{item.presentationLabel}</span>
            </p>
          )}
        </div>
        <p className="cart-item__line-price menu-price cart-num cart-num--md">
          {formatPrice(item.subtotal)}
        </p>
      </div>

      <div className="cart-item__actions-row">
        <div className="cart-item__qty-group">
          <span className="cart-item__qty-label">Cantidad</span>
          <div className="cart-qty cart-qty--drawer">
            <button
              type="button"
              className="cart-qty__btn"
              onClick={onDecrement}
              aria-label={`Reducir ${item.name}`}
              disabled={item.quantity <= minQuantity}
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
            <span className="cart-item__sin-tacc-label">Sin TACC</span>
          </label>
        )}

        <button
          type="button"
          className="cart-drawer__remove"
          onClick={onRemove}
          aria-label={`Eliminar ${item.name}`}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
