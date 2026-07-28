export default function CheckoutStepActions({ error, children }) {
  return (
    <footer className="cart-drawer__step-footer">
      {error && (
        <p className="cart-drawer__order-error" role="alert">
          {error}
        </p>
      )}
      <div className="cart-drawer__step-actions">{children}</div>
    </footer>
  );
}
