import { contact } from '../data/siteContent';
import WhatsAppButton from './WhatsAppButton';

export default function Contact() {
  const scrollToTop = (event) => {
    event.preventDefault();
    const hero = document.querySelector('.hero-philosophy');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contacto" className="contact" aria-label="Contacto">
      <div className="contact__overlay" aria-hidden="true" />

      <div className="contact__shell">
        <div className="contact__main">
          <div className="contact__inner">
            <h2 className="contact__title script-title">{contact.title}</h2>
            <p className="contact__body">{contact.body}</p>
            <WhatsAppButton className="contact__whatsapp-btn">
              <span className="contact__whatsapp-label">{contact.cta}</span>
              <span className="contact__whatsapp-arrow" aria-hidden="true">
                ↗
              </span>
            </WhatsAppButton>
          </div>
        </div>

        <footer className="contact__footer">
          <div className="contact__footer-rule" aria-hidden="true" />
          <div className="contact__footer-inner">
            <a
              href="#"
              className="contact__logo-link"
              aria-label="VITTA — Volver al inicio"
              onClick={scrollToTop}
            >
              <img src="/images/logo-vitta-claro.png" alt="VITTA" />
            </a>
            <a href="#" className="contact__back-top" onClick={scrollToTop}>
              <span>VOLVER ARRIBA</span>
              <span className="contact__back-top-arrow" aria-hidden="true">
                ↑
              </span>
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
