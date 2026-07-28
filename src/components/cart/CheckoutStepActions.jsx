export default function CheckoutStepActions({ error, children, className = '' }) {
  const footerClassName = ['cart-drawer__step-footer', className].filter(Boolean).join(' ');

  return (
    <footer className={footerClassName}>
      {error && (
        <p className="cart-drawer__order-error" role="alert">
          {error}
        </p>
      )}
      <div className="cart-drawer__step-actions">{children}</div>
    </footer>
  );
}
