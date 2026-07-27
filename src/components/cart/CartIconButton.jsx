import { useCart } from '../../context/CartContext';

function CartIcon() {
  return (
    <svg
      className="cart-icon__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7h15l-1.5 9h-11z" />
      <path d="M6 7 5 3H2" />
      <circle cx="9.5" cy="19.5" r="1.25" />
      <circle cx="16.5" cy="19.5" r="1.25" />
    </svg>
  );
}

export default function CartIconButton({ variant = 'light' }) {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      className={`cart-icon cart-icon--${variant}`}
      onClick={openCart}
      aria-label={`Abrir carrito${totalItems > 0 ? `, ${totalItems} unidades` : ''}`}
    >
      <CartIcon />
      {totalItems > 0 && (
        <span className="cart-icon__badge" aria-hidden="true">
          {totalItems}
        </span>
      )}
    </button>
  );
}
