import { useEffect, useRef, useState } from 'react';
import { CHECKOUT_STEPS } from '../../constants/checkout';
import { DELIVERY_METHODS, EMPTY_DELIVERY_FIELDS } from '../../constants/delivery';
import { useCart } from '../../context/CartContext';
import { saveOrder } from '../../utils/orderStorage';
import { submitOrderToSupabase } from '../../utils/orderSupabase';
import {
  buildOrderRecord,
  buildOrderWhatsAppMessage,
  computeOrderTotals,
  getCheckoutErrorMessage,
  getOrderWhatsAppLink,
  validateCartForOrder,
  validateCheckout,
} from '../../utils/whatsappOrder';
import CheckoutStepConfirm from './CheckoutStepConfirm';
import CheckoutStepDelivery from './CheckoutStepDelivery';
import CheckoutStepProducts from './CheckoutStepProducts';
import CheckoutSteps from './CheckoutSteps';
import CheckoutSuccess from './CheckoutSuccess';

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
    clearCart,
  } = useCart();

  const [orderError, setOrderError] = useState('');
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEPS.PRODUCTS);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryFields, setDeliveryFields] = useState(EMPTY_DELIVERY_FIELDS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [orderSent, setOrderSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);

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
    if (isOpen) {
      setOrderError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutStep(CHECKOUT_STEPS.PRODUCTS);
      setDeliveryMethod('');
      setDeliveryFields(EMPTY_DELIVERY_FIELDS);
      setFieldErrors({});
      setOrderSent(false);
      setIsSubmitting(false);
      hasSubmittedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (items.length === 0 && checkoutStep > CHECKOUT_STEPS.PRODUCTS && !orderSent) {
      setCheckoutStep(CHECKOUT_STEPS.PRODUCTS);
    }
  }, [items.length, checkoutStep, orderSent]);

  if (!isRendered) return null;

  const orderTotals = computeOrderTotals(items, deliveryMethod);
  const checkoutData = { deliveryMethod, deliveryFields };

  const handleViewMenu = () => {
    closeCart();
    const target = document.querySelector('#viandas');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    setOrderError('');
    setFieldErrors({});
  };

  const handleDeliveryFieldChange = (key, value) => {
    setDeliveryFields((current) => ({ ...current, [key]: value }));
    setOrderError('');
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleCloseAfterSuccess = () => {
    setOrderSent(false);
    closeCart();
  };

  const handleContinueToDelivery = () => {
    const validation = validateCartForOrder(items);
    if (!validation.valid) {
      setOrderError(getCheckoutErrorMessage(validation.reason));
      return;
    }
    setOrderError('');
    setCheckoutStep(CHECKOUT_STEPS.DELIVERY);
  };

  const handleContinueToConfirm = () => {
    const validation = validateCheckout(items, deliveryMethod, deliveryFields);
    if (!validation.valid) {
      if (validation.fieldErrors) {
        setFieldErrors(validation.fieldErrors);
        setOrderError('');
      } else {
        setFieldErrors({});
        setOrderError(getCheckoutErrorMessage(validation.reason, validation.message));
      }
      return;
    }
    setFieldErrors({});
    setOrderError('');
    setCheckoutStep(CHECKOUT_STEPS.CONFIRM);
  };

  const handlePlaceOrder = async () => {
    if (hasSubmittedRef.current || isSubmitting) return;

    const validation = validateCheckout(items, deliveryMethod, deliveryFields);
    if (!validation.valid) {
      if (validation.fieldErrors) {
        setFieldErrors(validation.fieldErrors);
        setOrderError('');
        setCheckoutStep(CHECKOUT_STEPS.DELIVERY);
      } else {
        setOrderError(getCheckoutErrorMessage(validation.reason, validation.message));
      }
      return;
    }

    const { message, totals } = buildOrderWhatsAppMessage(items, orderNotes, checkoutData);

    if (totals.total !== orderTotals.total) {
      setOrderError('No pudimos confirmar el total del pedido. Intentá nuevamente.');
      return;
    }

    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    setOrderError('');

    const whatsappWindow = window.open('about:blank', '_blank', 'noopener,noreferrer');
    const result = await submitOrderToSupabase(items, orderNotes, checkoutData);

    if (!result.ok) {
      whatsappWindow?.close();
      hasSubmittedRef.current = false;
      setIsSubmitting(false);
      setOrderError('No pudimos registrar tu pedido. Intentá nuevamente.');
      return;
    }

    const whatsappLink = getOrderWhatsAppLink(message);

    if (whatsappWindow) {
      whatsappWindow.location.href = whatsappLink;
    } else {
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    }

    const order = buildOrderRecord(items, orderNotes, checkoutData);
    saveOrder(order);

    clearCart();
    setOrderSent(true);
    setIsSubmitting(false);
    setOrderError('');
  };

  const getDrawerTitle = () => {
    if (orderSent) return 'Pedido enviado';
    if (checkoutStep === CHECKOUT_STEPS.DELIVERY) return 'Entrega';
    if (checkoutStep === CHECKOUT_STEPS.CONFIRM) return 'Confirmación';
    return 'Tu carrito';
  };

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
          <div className="cart-drawer__header-main">
            <h2 className="cart-drawer__title">{getDrawerTitle()}</h2>
            {!orderSent && items.length > 0 && <CheckoutSteps currentStep={checkoutStep} />}
          </div>
          <button type="button" className="cart-drawer__close" onClick={closeCart} aria-label="Cerrar">
            ×
          </button>
        </header>

        {orderSent ? (
          <div className="cart-drawer__body cart-drawer__body--checkout">
            <CheckoutSuccess onClose={handleCloseAfterSuccess} />
          </div>
        ) : items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p className="cart-drawer__empty-text">Tu carrito está vacío</p>
            <button type="button" className="cart-drawer__empty-link" onClick={handleViewMenu}>
              Ver menú
            </button>
          </div>
        ) : (
          <div className="cart-drawer__body cart-drawer__body--checkout">
            {checkoutStep === CHECKOUT_STEPS.PRODUCTS && (
              <CheckoutStepProducts
                items={items}
                orderNotes={orderNotes}
                subtotal={totalAmount}
                onIncrement={incrementProduct}
                onDecrement={decrementProduct}
                onRemove={removeProduct}
                onSinTaccChange={setItemSinTacc}
                onOrderNotesChange={setOrderNotes}
                onContinue={handleContinueToDelivery}
                error={orderError}
              />
            )}

            {checkoutStep === CHECKOUT_STEPS.DELIVERY && (
              <CheckoutStepDelivery
                deliveryMethod={deliveryMethod}
                deliveryFields={deliveryFields}
                fieldErrors={fieldErrors}
                onMethodChange={handleDeliveryMethodChange}
                onFieldChange={handleDeliveryFieldChange}
                onBack={() => {
                  setOrderError('');
                  setFieldErrors({});
                  setCheckoutStep(CHECKOUT_STEPS.PRODUCTS);
                }}
                onContinue={handleContinueToConfirm}
                error={orderError}
              />
            )}

            {checkoutStep === CHECKOUT_STEPS.CONFIRM && (
              <CheckoutStepConfirm
                items={items}
                orderNotes={orderNotes}
                deliveryMethod={deliveryMethod}
                deliveryFields={deliveryFields}
                orderTotals={orderTotals}
                onBack={() => {
                  setOrderError('');
                  setCheckoutStep(CHECKOUT_STEPS.DELIVERY);
                }}
                onSubmit={handlePlaceOrder}
                error={orderError}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
