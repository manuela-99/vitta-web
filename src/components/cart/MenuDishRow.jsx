import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice, formatWeight } from '../../utils/price';

function CartSummary({ product, quantity }) {
  if (product.gramsPerUnit) {
    const totalGrams = product.gramsPerUnit * quantity;
    return (
      <>
        <span className="cart-num cart-num--sm">{product.presentationLabel}</span>
        {' × '}
        <span className="cart-num cart-num--md">{quantity}</span>
        {' = '}
        <span className="cart-num cart-num--sm">{formatWeight(totalGrams)}</span>
      </>
    );
  }

  if (product.portionsPerUnit) {
    const totalPortions = product.portionsPerUnit * quantity;
    return (
      <>
        <span className="cart-num cart-num--sm">{product.presentationLabel}</span>
        {' × '}
        <span className="cart-num cart-num--md">{quantity}</span>
        {' = '}
        <span className="cart-num cart-num--md">{totalPortions}</span> porciones
      </>
    );
  }

  return (
    <>
      <span className="cart-num cart-num--sm">{product.presentationLabel}</span>
      {' × '}
      <span className="cart-num cart-num--md">{quantity}</span>
    </>
  );
}

function getViandasSizeHint(product) {
  if (product.gramsPerUnit === 250) {
    return `${product.presentationLabel} · individual`;
  }
  if (product.gramsPerUnit === 500) {
    return `${product.presentationLabel} · para compartir`;
  }
  return null;
}

function ViandasDishPanel({
  products,
  selectedId,
  selectedProduct,
  quantity,
  minQuantity,
  onSelect,
  onDecrement,
  onIncrement,
  onAdd,
}) {
  const hasMultiplePresentations = products.length > 1;
  const sizeHint = hasMultiplePresentations ? getViandasSizeHint(selectedProduct) : null;
  const subtotal = selectedProduct.unitPrice * quantity;

  return (
    <div
      className={`menu-dish-row__panel menu-dish-row__panel--viandas${
        !hasMultiplePresentations ? ' menu-dish-row__panel--viandas-single' : ''
      }`}
    >
      {hasMultiplePresentations ? (
        <div className="menu-dish-panel__size-block">
          <div className="menu-dish-panel__segmented" role="group" aria-label="Tamaño">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`menu-dish-panel__segment${
                  selectedId === product.id ? ' menu-dish-panel__segment--selected' : ''
                }`}
                onClick={() => onSelect(product.id)}
                aria-pressed={selectedId === product.id}
              >
                <span className="menu-dish-panel__segment-size cart-num cart-num--sm">
                  {product.presentationLabel}
                </span>
                <span className="menu-dish-panel__segment-price menu-price cart-num cart-num--md">
                  {product.unitPriceLabel}
                </span>
              </button>
            ))}
          </div>

          {sizeHint && <p className="menu-dish-panel__size-hint">{sizeHint}</p>}
        </div>
      ) : (
        <p className="menu-dish-panel__presentation-info">{selectedProduct.presentationLabel}</p>
      )}

      <div className="menu-dish-panel__qty-row">
        <span className="menu-dish-panel__qty-label">Cantidad</span>
        <div className="menu-dish-panel__qty cart-qty">
          <button
            type="button"
            className="cart-qty__btn"
            onClick={onDecrement}
            aria-label="Reducir cantidad"
            disabled={quantity <= minQuantity}
          >
            −
          </button>
          <span className="cart-qty__value">{quantity}</span>
          <button
            type="button"
            className="cart-qty__btn"
            onClick={onIncrement}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      <button type="button" className="menu-dish-panel__add menu-dish-panel__add--viandas" onClick={onAdd}>
        Agregar · <span className="menu-price cart-num cart-num--md">{formatPrice(subtotal)}</span>
      </button>
    </div>
  );
}

function DefaultDishPanel({
  products,
  selectedId,
  selectedProduct,
  quantity,
  minQuantity,
  panelLabel,
  hasMultiplePresentations,
  onSelect,
  onDecrement,
  onIncrement,
  onAdd,
}) {
  const subtotal = selectedProduct.unitPrice * quantity;

  return (
    <div className="menu-dish-row__panel">
      {hasMultiplePresentations && panelLabel && (
        <>
          <p className="menu-dish-panel__label">{panelLabel}</p>
          <div className="menu-dish-panel__options">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`menu-dish-panel__option${
                  selectedId === product.id ? ' menu-dish-panel__option--selected' : ''
                }`}
                onClick={() => onSelect(product.id)}
              >
                <span className="cart-num cart-num--sm">{product.presentationLabel}</span>
                {' · '}
                <span className="menu-price cart-num cart-num--md">{product.unitPriceLabel}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {!hasMultiplePresentations && (
        <p className="menu-dish-panel__single">
          <span className="cart-num cart-num--sm">{selectedProduct.presentationLabel}</span>
          {' · '}
          <span className="menu-price cart-num cart-num--md">{selectedProduct.unitPriceLabel}</span>
        </p>
      )}

      <p className="menu-dish-panel__label">Cantidad</p>
      <div className="menu-dish-panel__qty cart-qty">
        <button
          type="button"
          className="cart-qty__btn"
          onClick={onDecrement}
          aria-label="Reducir cantidad"
          disabled={quantity <= minQuantity}
        >
          −
        </button>
        <span className="cart-qty__value">{quantity}</span>
        <button
          type="button"
          className="cart-qty__btn"
          onClick={onIncrement}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      <p className="menu-dish-panel__summary">
        <CartSummary product={selectedProduct} quantity={quantity} />
      </p>

      <button type="button" className="menu-dish-panel__add" onClick={onAdd}>
        Agregar al carrito ·{' '}
        <span className="menu-price cart-num cart-num--md">{formatPrice(subtotal)}</span>
      </button>
    </div>
  );
}

export default function MenuDishRow({ name, products, dark = false, layout = 'default' }) {
  const { addProduct } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const isViandasLayout = layout === 'viandas';

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    setSelectedId(products[0]?.id ?? '');
    setQuantity(products[0]?.minQuantity ?? 1);
    return undefined;
  }, [isOpen, products]);

  useEffect(() => {
    if (!showAdded) return undefined;
    const timer = window.setTimeout(() => setShowAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [showAdded]);

  if (!selectedProduct) return null;

  const minQuantity = selectedProduct.minQuantity ?? 1;
  const panelLabel = selectedProduct.panelLabel;
  const hasMultiplePresentations = products.length > 1;

  const handleAdd = () => {
    addProduct(selectedProduct.id, quantity);
    setShowAdded(true);
    setIsOpen(false);
    setQuantity(minQuantity);
  };

  const handleToggle = () => {
    if (showAdded) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <li
      className={`menu-dish-row${dark ? ' menu-dish-row--dark' : ''}${
        isViandasLayout ? ' menu-dish-row--viandas' : ''
      }`}
    >
      {isViandasLayout ? (
        showAdded ? (
          <div className="menu-dish-row__head menu-dish-row__head--viandas">
            <span className="menu-dish-row__name menu-item-name">{name}</span>
            <span className="menu-dish-row__added" aria-live="polite">
              ✓ Agregado
            </span>
          </div>
        ) : (
          <button
            type="button"
            className="menu-dish-row__head menu-dish-row__head--viandas"
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? `Cerrar opciones de ${name}` : `Agregar ${name}`}
          >
            <span className="menu-dish-row__name menu-item-name">{name}</span>
            <span className="menu-dish-row__toggle" aria-hidden="true">
              +
            </span>
          </button>
        )
      ) : (
        <div className="menu-dish-row__head">
          <span className="menu-dish-row__name menu-item-name">{name}</span>
          {showAdded ? (
            <span className="menu-dish-row__added" aria-live="polite">
              ✓ Agregado
            </span>
          ) : (
            <button
              type="button"
              className="menu-dish-row__toggle"
              onClick={handleToggle}
              aria-expanded={isOpen}
              aria-label={isOpen ? `Cerrar opciones de ${name}` : `Agregar ${name}`}
            >
              +
            </button>
          )}
        </div>
      )}

      <div
        className={`menu-dish-row__panel-anim${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="menu-dish-row__panel-anim-inner">
          {isViandasLayout ? (
            <ViandasDishPanel
              products={products}
              selectedId={selectedId}
              selectedProduct={selectedProduct}
              quantity={quantity}
              minQuantity={minQuantity}
              onSelect={setSelectedId}
              onDecrement={() => setQuantity((prev) => Math.max(minQuantity, prev - 1))}
              onIncrement={() => setQuantity((prev) => prev + 1)}
              onAdd={handleAdd}
            />
          ) : (
            <DefaultDishPanel
              products={products}
              selectedId={selectedId}
              selectedProduct={selectedProduct}
              quantity={quantity}
              panelLabel={panelLabel}
              hasMultiplePresentations={hasMultiplePresentations}
              minQuantity={minQuantity}
              onSelect={setSelectedId}
              onDecrement={() => setQuantity((prev) => Math.max(minQuantity, prev - 1))}
              onIncrement={() => setQuantity((prev) => prev + 1)}
              onAdd={handleAdd}
            />
          )}
        </div>
      </div>
    </li>
  );
}
