import { CHECKOUT_STEP_LABELS } from '../../constants/checkout';

export default function CheckoutSteps({ currentStep }) {
  return (
    <nav className="cart-checkout-steps" aria-label="Pasos del pedido">
      <ol className="cart-checkout-steps__list">
        {CHECKOUT_STEP_LABELS.map(({ step, number: stepNumber, label }) => {
          const isComplete = step < currentStep;
          const isActive = step === currentStep;

          return (
            <li
              key={step}
              className={`cart-checkout-steps__item${
                isActive ? ' cart-checkout-steps__item--active' : ''
              }${isComplete ? ' cart-checkout-steps__item--complete' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="cart-checkout-steps__marker" aria-hidden="true">
                {isComplete ? '✓' : stepNumber}
              </span>
              <span className="cart-checkout-steps__label">
                {' — '}
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
