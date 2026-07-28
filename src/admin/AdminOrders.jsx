import { useCallback, useEffect, useMemo, useState } from 'react';
import { DELIVERY_LABELS, DELIVERY_METHODS } from '../constants/delivery.js';
import {
  getOrderFilters,
  getVisibleStatusLabel,
  matchesOrderFilter,
  ORDER_COUNTERS,
} from '../constants/orderStatus.js';
import OrderDetailDrawer from './OrderDetailDrawer.jsx';
import {
  fetchOrders,
  formatCustomerName,
  formatOrderDate,
  formatOrderNumber,
  normalizeOrder,
} from '../utils/adminOrders.js';
import { formatPrice } from '../utils/price.js';

function StatusBadge({ label }) {
  return <span className="admin-badge">{label}</span>;
}

function DeliveryLabel({ deliveryMethod }) {
  if (deliveryMethod === DELIVERY_METHODS.PICKUP) {
    return <span className="admin-delivery-label">Retiro por Beccar</span>;
  }

  return <span className="admin-delivery-label">{DELIVERY_LABELS[deliveryMethod] ?? deliveryMethod}</span>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await fetchOrders();

    if (fetchError) {
      setError('No pudimos cargar los pedidos. Verifica tu sesion e intenta nuevamente.');
      setOrders([]);
    } else {
      setOrders(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const orderFilters = useMemo(() => getOrderFilters(orders), [orders]);

  const counters = useMemo(
    () =>
      ORDER_COUNTERS.map((counter) => ({
        ...counter,
        count: orders.filter(counter.matches).length,
      })),
    [orders],
  );

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesOrderFilter(order, activeFilter)),
    [orders, activeFilter],
  );

  const handleOpenOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseOrder = () => {
    setSelectedOrderId(null);
  };

  const handleOrderUpdated = (updatedOrder) => {
    const normalized = normalizeOrder(updatedOrder);
    setOrders((current) =>
      current.map((order) => (order.id === normalized.id ? { ...order, ...normalized } : order)),
    );
  };

  if (loading) {
    return <p className="admin-loading">Cargando pedidos...</p>;
  }

  if (error) {
    return <p className="admin-error admin-error--panel" role="alert">{error}</p>;
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h1 className="admin-panel__title">Pedidos</h1>
          <p className="admin-panel__meta">{orders.length} pedidos en total</p>
        </div>
      </div>

      <div className="admin-counters">
        {counters.map((counter) => (
          <div key={counter.id} className="admin-counter">
            <span className="admin-counter__value">{counter.count}</span>
            <span className="admin-counter__label">{counter.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-filters" role="tablist" aria-label="Filtrar pedidos">
        {orderFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.id}
            className={`admin-filter${activeFilter === filter.id ? ' admin-filter--active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="admin-empty">No hay pedidos para este filtro.</p>
      ) : (
        <>
          <div className="admin-table-wrap admin-table-wrap--desktop">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha y hora</th>
                  <th>Cliente</th>
                  <th>Telefono</th>
                  <th>Entrega</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const orderNumber = formatOrderNumber(order);

                  return (
                    <tr
                      key={order.id}
                      className="admin-table__row"
                      onClick={() => handleOpenOrder(order.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleOpenOrder(order.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Ver pedido ${orderNumber}`}
                    >
                      <td className="admin-table__order">{orderNumber}</td>
                      <td className="admin-table__date">{formatOrderDate(order.created_at)}</td>
                      <td className="admin-table__customer">{formatCustomerName(order)}</td>
                      <td className="admin-table__phone">{order.customer_phone}</td>
                      <td className="admin-table__delivery">
                        <DeliveryLabel deliveryMethod={order.delivery_method} />
                      </td>
                      <td className="admin-table__price">{formatPrice(order.total)}</td>
                      <td>
                        <StatusBadge label={getVisibleStatusLabel(order)} />
                      </td>
                      <td className="admin-table__actions">
                        <button
                          type="button"
                          className="admin-link-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenOrder(order.id);
                          }}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-cards admin-cards--mobile">
            {filteredOrders.map((order) => {
              const orderNumber = formatOrderNumber(order);

              return (
                <article
                  key={order.id}
                  className="admin-card"
                  onClick={() => handleOpenOrder(order.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleOpenOrder(order.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver pedido ${orderNumber}`}
                >
                  <div className="admin-card__head">
                    <div>
                      <p className="admin-card__number">{orderNumber}</p>
                      <p className="admin-card__date">{formatOrderDate(order.created_at)}</p>
                    </div>
                    <p className="admin-card__total">{formatPrice(order.total)}</p>
                  </div>
                  <p className="admin-card__customer">{formatCustomerName(order)}</p>
                  <p className="admin-card__delivery">
                    <DeliveryLabel deliveryMethod={order.delivery_method} />
                  </p>
                  <div className="admin-card__badges">
                    <StatusBadge label={getVisibleStatusLabel(order)} />
                  </div>
                  <button
                    type="button"
                    className="admin-link-button admin-card__action"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenOrder(order.id);
                    }}
                  >
                    Ver detalle
                  </button>
                </article>
              );
            })}
          </div>
        </>
      )}

      <OrderDetailDrawer
        orderId={selectedOrderId}
        isOpen={Boolean(selectedOrderId)}
        onClose={handleCloseOrder}
        onOrderUpdated={handleOrderUpdated}
      />
    </section>
  );
}
