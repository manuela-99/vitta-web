import {
  PREPARATION_TIME_IMPORTANT_HEADING,
  PREPARATION_TIME_IMPORTANT_SUFFIX,
} from '../../constants/checkout';

const PREPARATION_STEP_PREFIX = 'Tiempo estimado de preparaci\u00f3n: ';
const PREPARATION_HOURS = '48 a 72 horas h\u00e1biles.';
const PREPARATION_IMPORTANT_LEAD = 'El tiempo estimado de preparaci\u00f3n es de ';

function PreparationHours({ className = '' }) {
  return (
    <strong className={['cart-drawer__preparation-notice__highlight', className].filter(Boolean).join(' ')}>
      {PREPARATION_HOURS.replace(/\.$/, '')}
    </strong>
  );
}

export default function PreparationTimeNotice({ className = '', variant = 'step' }) {
  const classes = ['cart-drawer__preparation-notice', className].filter(Boolean).join(' ');

  if (variant === 'important') {
    return (
      <div className={`${classes} cart-drawer__preparation-notice--important`}>
        <p className="cart-drawer__preparation-notice__heading">{PREPARATION_TIME_IMPORTANT_HEADING}</p>
        <p className="cart-drawer__preparation-notice__text">
          {PREPARATION_IMPORTANT_LEAD}
          <PreparationHours />.
          {' '}
          {PREPARATION_TIME_IMPORTANT_SUFFIX}
        </p>
      </div>
    );
  }

  return (
    <div className={`${classes} cart-drawer__preparation-notice--step`}>
      <p className="cart-drawer__preparation-notice__line">
        {PREPARATION_STEP_PREFIX}
        <PreparationHours />.
      </p>
    </div>
  );
}
