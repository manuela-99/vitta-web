export default function PaymentInfoBox() {
  return (
    <aside className="cart-drawer__payment-info" aria-labelledby="cart-payment-heading">
      <h3 id="cart-payment-heading" className="cart-drawer__payment-info-heading">
        Pago únicamente por transferencia
      </h3>
      <p className="cart-drawer__payment-info-text">
        Una vez enviado el pedido, te contactaremos por WhatsApp con los datos para realizar la
        transferencia. El pedido se confirmará cuando recibamos el comprobante de pago.
      </p>
    </aside>
  );
}
