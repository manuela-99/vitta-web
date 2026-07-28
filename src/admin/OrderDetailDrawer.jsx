import { useEffect, useState } from 'react';
import { getStoredDeliveryLabel, isShippingDelivery } from '../constants/delivery.js';
import {
  getStatusUpdatePayload,
  getVisibleStatusId,
  getVisibleStatusLabel,
  getVisibleStatusOptionLabel,
  PAYMENT_METHOD_LABELS,
  VISIBLE_STATUS_OPTIONS,
} from '../constants/orderStatus.js';
import {
  buildCustomerWhatsAppLink,
  fetchOrderById,
  formatCustomerName,
  formatOrderDate,
  formatOrderNumber,
  getOrderUpdatedAt,
  updateOrder,
} from '../utils/adminOrders.js';
import { formatPrice } from '../utils/price.js';

function DetailRow({ label, value }) {
  if (value == null || value === '') return null;

  return (
    <div className="admin-detail__row">
      <span className="admin-detail__label">{label}</span>
      <span className="admin-detail__value">{value}</span>
    </div>
  );
}

function StatusBadge({ label }) {
  return <span className="admin-badge">{label}</span>;
}

export default function OrderDetailDrawer({ orderId, isOpen, onClose, onOrderUpdated }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleStatus, setVisibleStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusError, setStatusError] = useState('');

  useEffect(() => {
    if (!isOpen || !orderId) return undefined;

    let active = true;

    async function loadOrder() {
      setLoading(true);
      setError('');
      setStatusMessage('');
      setStatusError('');

      const { data, error: fetchError } = await fetchOrderById(orderId);

      if (!active) return;

      if (fetchError || !data) {
        setError('No pudimos cargar este pedido.');
        setOrder(null);
      } else {
        setOrder(data);
        setVisibleStatus(getVisibleStatusId(data));
      }

      setLoading(false);
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [isOpen, orderId]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.classList.add('admin-drawer-open');
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.classList.remove('admin-drawer-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const handleVisibleStatusChange = async (event) => {
    const nextVisibleStatus = event.target.value;
    if (!order || nextVisibleStatus === visibleStatus || savingStatus) return;

    const previousVisibleStatus = visibleStatus;
    const payload = getStatusUpdatePayload(nextVisibleStatus, order.payment_status);

    if (!payload) return;

    setVisibleStatus(nextVisibleStatus);
    setSavingStatus(true);
    setStatusMessage('Guardando\u2026');
    setStatusError('');

    const result = await updateOrder(order.id, payload);

    if (!result.ok) {
      setVisibleStatus(previousVisibleStatus);
      setStatusError('No pudimos actualizar el estado del pedido.');
      setStatusMessage('');
      setSavingStatus(false);
      return;
    }

    const updatedOrder = {
      ...order,
      ...(payload.order_status ? { order_status: payload.order_status } : {}),
      ...(payload.payment_status ? { payment_status: payload.payment_status } : {}),
    };

    setOrder(updatedOrder);
    setVisibleStatus(getVisibleStatusId(updatedOrder));
    onOrderUpdated(updatedOrder);
    setStatusMessage('Estado actualizado');
    setSavingStatus(false);
  };

  if (!isOpen) return null;

  const orderNumber = order ? formatOrderNumber(order) : '';
  const whatsappLink = order ? buildCustomerWhatsAppLink(order, orderNumber) : '';
  const isShipping = isShippingDelivery(order?.delivery_method);

  return (
    <div className={`admin-drawer${isOpen ? ' admin-drawer--open' : ''}`} role="presentation">
      <button type="button" className="admin-drawer__backdrop" onClick={onClose} aria-label="Cerrar detalle" />
      <aside className="admin-drawer__panel" role="dialog" aria-modal="true" aria-label="Detalle del pedido">
        <header className="admin-drawer__header">
          <div>
            <p className="admin-drawer__eyebrow">Detalle del pedido</p>
            <h2 className="admin-drawer__title">{order ? `Pedido ${orderNumber}` : 'Pedido'}</h2>
            {order ? <p className="admin-drawer__meta">{formatOrderDate(order.created_at)}</p> : null}
          </div>
          <button type="button" className="admin-drawer__close" onClick={onClose} aria-label="Cerrar">
            x
          </button>
        </header>

        <div className="admin-drawer__body">
          {loading ? <p className="admin-loading">{'Cargando pedido\u2026'}</p> : null}
          {error ? <p className="admin-error admin-error--panel" role="alert">{error}</p> : null}

          {!loading && !error && order ? (
            <>
              <section className="admin-detail">
                <h3 className="admin-detail__heading">Cliente</h3>
                <DetailRow label="Nombre y apellido" value={formatCustomerName(order)} />
                <DetailRow label={'Tel\u00e9fono'} value={order.customer_phone} />
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-button admin-button--secondary"
                  >
                    Abrir WhatsApp
                  </a>
                ) : null}
              </section>

              <section className="admin-detail">
                <h3 className="admin-detail__heading">Productos</h3>
                <ul className="admin-items">
                  {order.items.map((item, index) => (
                    <li key={`${item.productId ?? index}-${item.name}-${index}`} className="admin-items__row">
                      <div className="admin-items__content">
                        <p className="admin-items__name">
                          {item.name}
                          {item.sinTacc ? ' - Sin TACC' : ''}
                        </p>
                        {item.presentationLabel ? (
                          <p className="admin-items__meta">{item.presentationLabel}</p>
                        ) : null}
                        <p className="admin-items__meta">Cantidad: {item.quantity}</p>
                        {item.unitPrice != null ? (
                          <p className="admin-items__meta">Precio unitario: {formatPrice(item.unitPrice)}</p>
                        ) : null}
                      </div>
                      <span className="admin-items__price">{formatPrice(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>
                {order.notes ? (
                  <div className="admin-detail__notes">
                    <span className="admin-detail__label">Aclaraciones generales</span>
                    <p className="admin-detail__value">{order.notes}</p>
                  </div>
                ) : null}
              </section>

              <section className="admin-detail">
                <h3 className="admin-detail__heading">Entrega</h3>
                {isShipping ? (
                  <>
                    <DetailRow
                      label="Modalidad"
                      value={getStoredDeliveryLabel(order.delivery_method, order.delivery_fee)}
                    />
                    <DetailRow label={'Direcci\u00f3n'} value={order.delivery_address} />
                    <DetailRow label="Localidad" value={order.locality} />
                    <DetailRow label={'C\u00f3digo postal'} value={order.postal_code} />
                    <DetailRow label="Piso o departamento" value={order.apartment} />
                    <DetailRow label="Referencias de entrega" value={order.delivery_notes} />
                  </>
                ) : (
                  <DetailRow
                    label="Modalidad"
                    value={getStoredDeliveryLabel(order.delivery_method, order.delivery_fee)}
                  />
                )}
              </section>

              <section className="admin-detail">
                <h3 className="admin-detail__heading">Totales</h3>
                <div className="admin-summary">
                  <div className="admin-summary__row">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="admin-summary__row">
                    <span>{'Env\u00edo'}</span>
                    <span>{order.delivery_fee > 0 ? formatPrice(order.delivery_fee) : 'Sin cargo'}</span>
                  </div>
                  <div className="admin-summary__row admin-summary__row--total">
                    <span>Total final</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </section>

              <section className="admin-detail">
                <h3 className="admin-detail__heading">Pago</h3>
                <DetailRow
                  label="Forma de pago"
                  value={PAYMENT_METHOD_LABELS[order.payment_method] ?? 'Transferencia'}
                />
              </section>

              <section className="admin-detail">
                <h3 className="admin-detail__heading">Estado del pedido</h3>
                <div className="admin-detail__row">
                  <span className="admin-detail__label">Estado actual</span>
                  <StatusBadge label={getVisibleStatusLabel(order)} />
                </div>
                <DetailRow label={'\u00daltima actualizaci\u00f3n'} value={formatOrderDate(getOrderUpdatedAt(order))} />

                <label className="admin-field admin-field--spaced">
                  <span className="admin-field__label">Estado del pedido</span>
                  <select
                    className="admin-field__input"
                    value={visibleStatus}
                    onChange={handleVisibleStatusChange}
                    disabled={savingStatus}
                  >
                    {VISIBLE_STATUS_OPTIONS.map((statusId) => (
                      <option key={statusId} value={statusId}>
                        {getVisibleStatusOptionLabel(statusId)}
                      </option>
                    ))}
                  </select>
                </label>

                {statusError ? (
                  <p className="admin-error" role="alert">
                    {statusError}
                  </p>
                ) : null}
                {statusMessage ? (
                  <p className={statusError ? 'admin-error' : 'admin-success'} role="status">
                    {statusMessage}
                  </p>
                ) : null}
              </section>
            </>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
