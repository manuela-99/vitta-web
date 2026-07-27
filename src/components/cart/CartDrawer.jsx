import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice, formatWeight } from '../../utils/price';
import {
  buildOrderWhatsAppMessage,
  getOrderWhatsAppLink,
  validateCartForOrder,
} from '../../utils/whatsappOrder';
import CartLineItem from './CartLineItem';

export default function CartDrawer() {
  const {
    items,
    orderNotes,
    isOpen,
    totalItems,
    totalAmount,
    totalWeightGrams,
    closeCart,
    incrementProduct,
    decrementProduct,
    removeProduct,
    setItemSinTacc,
    setOrderNotes,
  } = useCart();
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    document.body.classList.toggle('cart-open', isOpen);
    return () => document.body.classList.remove('cart-open');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (isOpen) setOrderError('');
  }, [isOpen, items]);

  if (!isOpen) return null;

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

  const trimmedOrderNotes = orderNotes.trim();

  const productCountLabel =
    totalItems === 1 ? (
      <>
        <span className="cart-num cart-num--sm">1</span> producto
      </>
    ) : (
      <>
        <span className="cart-num cart-num--sm">{totalItems.toLocaleString('es-AR')}</span> productos
      </>
    );

  return (
    <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Carrito">
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

            <div className="cart-drawer__order-notes">
              <label className="cart-drawer__order-notes-label" htmlFor="cart-order-notes">
                ¿Querés aclarar algo sobre tu pedido?
              </label>
              <textarea
                id="cart-order-notes"
                className="cart-drawer__order-notes-input"
                rows={2}
                value={orderNotes}
                placeholder="Ej.: sin cebolla, salsa aparte, indicaciones generales…"
                onChange={(event) => setOrderNotes(event.target.value)}
              />
            </div>

            <footer className="cart-drawer__footer">
              <div className="cart-drawer__summary">
                <p className="cart-drawer__summary-title">Resumen del pedido</p>
                <p className="cart-drawer__summary-line">{productCountLabel}</p>
                {totalWeightGrams > 0 && (
                  <p className="cart-drawer__summary-line">
                    Peso total:{' '}
                    <span className="cart-num cart-num--sm">{formatWeight(totalWeightGrams)}</span>
                  </p>
                )}
                {trimmedOrderNotes && (
                  <p className="cart-drawer__summary-line cart-drawer__summary-notes">
                    Aclaraciones: {trimmedOrderNotes}
                  </p>
                )}
                <p className="cart-drawer__summary-total">
                  <span>Total</span>
                  <span className="menu-price cart-num cart-num--lg">{formatPrice(totalAmount)}</span>
                </p>
                <p className="cart-drawer__summary-note">
                  El pago y la entrega se coordinan por WhatsApp.
                </p>
              </div>

              {orderError && (
                <p className="cart-drawer__order-error" role="alert">
                  {orderError}
                </p>
              )}

              <button type="button" className="cart-drawer__checkout" onClick={handlePlaceOrder}>
                Realizar pedido
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
