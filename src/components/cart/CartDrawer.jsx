import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/price';
import {
  buildOrderWhatsAppMessage,
  getOrderWhatsAppLink,
  validateCartForOrder,
} from '../../utils/whatsappOrder';
import CartLineItem from './CartLineItem';

const CART_CLOSE_MS = 520;

export default function CartDrawer() {
  const {
    items,
    orderNotes,
    isOpen,
    totalAmount,
    closeCart,
    incrementProduct,
    decrementProduct,
    removeProduct,
    setItemSinTacc,
    setOrderNotes,
  } = useCart();
  const [orderError, setOrderError] = useState('');
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => window.cancelAnimationFrame(frame);
    }

    setIsAnimating(false);
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (isAnimating || isOpen || !isRendered) return undefined;
    const timer = window.setTimeout(() => setIsRendered(false), CART_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [isAnimating, isOpen, isRendered]);

  useEffect(() => {
    document.body.classList.toggle('cart-open', isRendered);
    return () => document.body.classList.remove('cart-open');
  }, [isRendered]);

  useEffect(() => {
    if (!isRendered) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRendered, closeCart]);

  useEffect(() => {
    if (isOpen) setOrderError('');
  }, [isOpen, items]);

  if (!isRendered) return null;

  const handleViewMenu = () => {
    closeCart();
    const target = document.querySelector('#viandas');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    const validation = validateCartForOrder(items);
    if (!validation.valid) {
      if (validation.reason === 'empty') {
        setOrderError('Tu carrito está vacío.');
      }
      return;
    }

    const { message, totals } = buildOrderWhatsAppMessage(items, orderNotes);
    if (totals.totalAmount !== totalAmount) {
      setOrderError('No pudimos confirmar el total del pedido. Intentá nuevamente.');
      return;
    }

    window.open(getOrderWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const quantitySummaryValue =
    totalUnits === 1 ? (
      <>
        <span className="cart-num cart-num--sm">1</span> producto
      </>
    ) : (
      <>
        <span className="cart-num cart-num--sm">{totalUnits.toLocaleString('es-AR')}</span> productos
      </>
    );

  const renderCheckout = (className = '') => (
    <button
      type="button"
      className={`cart-drawer__checkout${className ? ` ${className}` : ''}`}
      onClick={handlePlaceOrder}
    >
      Realizar pedido
    </button>
  );

  return (
    <div
      className={`cart-drawer${isAnimating ? ' cart-drawer--visible cart-drawer--open' : ' cart-drawer--visible'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Carrito"
    >
      <button type="button" className="cart-drawer__backdrop" onClick={closeCart} aria-label="Cerrar carrito" />
      <aside className="cart-drawer__panel">
        <header className="cart-drawer__header">
          <h2 className="cart-drawer__title">Tu carrito</h2>
          <button type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Cerrar">
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p className="cart-drawer__empty-text">Tu carrito está vacío</p>
            <button type="button" className="cart-drawer__empty-link" onClick={handleViewMenu}>
              Ver menú
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__body">
              <div className="cart-drawer__items-col">
                <ul className="cart-drawer__list">
                  {items.map((item) => (
                    <CartLineItem
                      key={item.productId}
                      item={item}
                      onIncrement={() => incrementProduct(item.productId)}
                      onDecrement={() => decrementProduct(item.productId)}
                      onRemove={() => removeProduct(item.productId)}
                      onSinTaccChange={(value) => setItemSinTacc(item.productId, value)}
                    />
                  ))}
                </ul>

                <div className="cart-drawer__quantity-summary" aria-live="polite">
                  <span className="cart-drawer__quantity-summary-label">Cantidad de productos</span>
                  <span className="cart-drawer__quantity-summary-value">{quantitySummaryValue}</span>
                </div>
              </div>

              <div className="cart-drawer__sidebar">
                <div className="cart-drawer__order-notes">
                  <p className="cart-drawer__order-notes-heading">Aclaraciones</p>
                  <label className="cart-drawer__order-notes-label" htmlFor="cart-order-notes">
                    ¿Querés aclarar algo?
                  </label>
                  <textarea
                    id="cart-order-notes"
                    className="cart-drawer__order-notes-input"
                    value={orderNotes}
                    placeholder="Ej.: sin cebolla, salsa aparte o indicaciones generales."
                    onChange={(event) => setOrderNotes(event.target.value)}
                  />
                </div>

                <footer className="cart-drawer__footer">
                  <div className="cart-drawer__summary-total">
                    <span>Total</span>
                    <span className="menu-price cart-num cart-num--lg">{formatPrice(totalAmount)}</span>
                  </div>

                  <p className="cart-drawer__summary-note">
                    El pago y la entrega se coordinan por WhatsApp.
                  </p>

                  {orderError && (
                    <p className="cart-drawer__order-error" role="alert">
                      {orderError}
                    </p>
                  )}

                  <div className="cart-drawer__footer-actions">{renderCheckout()}</div>
                </footer>
              </div>
            </div>

            <div className="cart-drawer__mobile-bar">
              <div className="cart-drawer__mobile-total">
                <span className="cart-drawer__mobile-total-label">Total</span>
                <span className="menu-price cart-num cart-num--lg">{formatPrice(totalAmount)}</span>
              </div>
              {orderError && (
                <p className="cart-drawer__order-error cart-drawer__order-error--mobile" role="alert">
                  {orderError}
                </p>
              )}
              {renderCheckout()}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
