import { formatCartItemSummary, getSinTaccUnits } from '../../utils/cartItem';
import { shouldShowPresentationInCart } from '../../utils/cartDisplay';
import { canOfferSinTaccOption, isPastasProduct } from '../../utils/preparation';

const PASTAS_SIN_TACC_NOTICE = 'Versi\u00f3n Sin TACC no disponible.';

export default function CartLineItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onUnitSinTaccChange,
}) {
  const showSinTaccOption = canOfferSinTaccOption(item);
  const showPastasSinTaccNotice = isPastasProduct(item);
  const showPresentation = shouldShowPresentationInCart(item);
  const minQuantity = item.minQuantity ?? 1;
  const sinTaccUnits = getSinTaccUnits(item);

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
          {showPastasSinTaccNotice ? (
            <p className="cart-item__sin-tacc-unavailable">{PASTAS_SIN_TACC_NOTICE}</p>
          ) : null}
        </div>
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

        <button
          type="button"
          className="cart-drawer__remove"
          onClick={onRemove}
          aria-label={`Eliminar ${item.name}`}
        >
          Eliminar
        </button>
      </div>

      {showSinTaccOption && item.quantity > 0 ? (
        <ul className="cart-item__unit-list">
          {sinTaccUnits.map((isSinTacc, index) => {
            const checkboxId = `cart-sin-tacc-${item.productId}-${index}`;

            return (
              <li key={checkboxId} className="cart-item__unit-row">
                <span className="cart-item__unit-label">Unidad {index + 1}</span>
                <label className="cart-item__sin-tacc" htmlFor={checkboxId}>
                  <input
                    id={checkboxId}
                    type="checkbox"
                    className="cart-item__sin-tacc-input"
                    checked={isSinTacc}
                    onChange={(event) => onUnitSinTaccChange(index, event.target.checked)}
                  />
                  <span className="cart-item__sin-tacc-box" aria-hidden="true">
                    {isSinTacc && <span className="cart-item__sin-tacc-check">✓</span>}
                  </span>
                  <span className="cart-item__sin-tacc-label">Sin TACC</span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="cart-item__summary menu-price cart-num cart-num--md">
        {formatCartItemSummary(item)}
      </p>
    </li>
  );
}
