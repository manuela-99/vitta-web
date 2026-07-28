export default function PaymentInfoBox() {
  return (
    <aside className="cart-drawer__payment-info" aria-labelledby="cart-payment-heading">
      <h3 id="cart-payment-heading" className="cart-drawer__payment-info-heading">
        Pagá por transferencia
      </h3>
      <p className="cart-drawer__payment-info-text">
        Al enviar el pedido, se abrirá WhatsApp con el detalle de la compra y los datos para
        realizar el pago.
      </p>
      <p className="cart-drawer__payment-info-notice">
        El pedido se confirma al recibir el comprobante.
      </p>
    </aside>
  );
}
