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

export default function MenuDishRow({ name, products, dark = false }) {
  const { addProduct } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    setSelectedId(products[0]?.id ?? '');
    setQuantity(1);
    return undefined;
  }, [isOpen, products]);

  useEffect(() => {
    if (!showAdded) return undefined;
    const timer = window.setTimeout(() => setShowAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [showAdded]);

  if (!selectedProduct) return null;

  const panelLabel = selectedProduct.panelLabel;
  const subtotal = selectedProduct.unitPrice * quantity;
  const hasMultiplePresentations = products.length > 1;

  const handleAdd = () => {
    addProduct(selectedProduct.id, quantity);
    setShowAdded(true);
    setIsOpen(false);
    setQuantity(1);
  };

  return (
    <li className={`menu-dish-row${dark ? ' menu-dish-row--dark' : ''}`}>
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
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? `Cerrar opciones de ${name}` : `Agregar ${name}`}
          >
            {isOpen ? '×' : '+'}
          </button>
        )}
      </div>

      {isOpen && (
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
                    onClick={() => setSelectedId(product.id)}
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
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              aria-label="Reducir cantidad"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="cart-qty__value">{quantity}</span>
            <button
              type="button"
              className="cart-qty__btn"
              onClick={() => setQuantity((prev) => prev + 1)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <p className="menu-dish-panel__summary">
            <CartSummary product={selectedProduct} quantity={quantity} />
          </p>

          <button type="button" className="menu-dish-panel__add" onClick={handleAdd}>
            Agregar al carrito ·{' '}
            <span className="menu-price cart-num cart-num--md">{formatPrice(subtotal)}</span>
          </button>
        </div>
      )}
    </li>
  );
}
