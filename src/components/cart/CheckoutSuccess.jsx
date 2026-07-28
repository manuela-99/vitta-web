export default function CheckoutSuccess({ onClose }) {
  return (
    <div className="cart-drawer__confirmation">
      <p className="cart-drawer__confirmation-lead">Pedido enviado por WhatsApp</p>
      <p className="cart-drawer__confirmation-note">
        Te abrimos la conversación con Vitta. Enviá el mensaje con el detalle del pedido y
        aguardá los datos para realizar la transferencia. El pedido queda pendiente de pago hasta
        recibir el comprobante.
      </p>
      <button type="button" className="cart-drawer__checkout" onClick={onClose}>
        Cerrar
      </button>
    </div>
  );
}
