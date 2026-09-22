import {
  DELIVERY_ORDERS_NOTICE_LINES,
  DELIVERY_ORDERS_NOTICE_TITLE,
  PREPARATION_TIME_IMPORTANT_HEADING,
  PREPARATION_TIME_IMPORTANT_SUFFIX,
} from '../../constants/checkout';

const PREPARATION_IMPORTANT_LEAD = 'El tiempo estimado de preparaci\u00f3n es de ';
const PREPARATION_HOURS = '48 a 72 horas h\u00e1biles.';

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
      <p className="cart-drawer__preparation-notice__heading cart-drawer__preparation-notice__heading--step">
        {DELIVERY_ORDERS_NOTICE_TITLE}
      </p>
      <div className="cart-drawer__preparation-notice__lines">
        {DELIVERY_ORDERS_NOTICE_LINES.map((line) => (
          <p key={line} className="cart-drawer__preparation-notice__line">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
