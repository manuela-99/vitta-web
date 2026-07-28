import { useRevealOnce } from '../hooks/useRevealOnce';
import { contact } from '../data/siteContent';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_LINK } from '../data/whatsapp';
import { renderTextLines } from '../utils/renderTextLines';
import WhatsAppButton from './WhatsAppButton';

export default function Contact() {
  const sectionRef = useRevealOnce(0);

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
    <>
      <section
        id="contacto"
        ref={sectionRef}
        className="contact"
        aria-label="Contacto"
      >
        <div className="contact__overlay" aria-hidden="true" />

        <div className="contact__inner">
          <h2 className="contact__title script-title">{contact.title}</h2>
          <p className="contact__body">{renderTextLines(contact.bodyLines)}</p>
          <WhatsAppButton className="contact__whatsapp-btn">
            <span className="contact__whatsapp-label">{contact.cta}</span>
          </WhatsAppButton>
        </div>
      </section>

      <footer className="site-footer" aria-label="Pie de página">
        <div className="site-footer__inner">
          <div className="site-footer__main">
            <div className="site-footer__brand">
              <p className="site-footer__wordmark">VITTA</p>
              <p className="site-footer__location">Buenos Aires, Argentina</p>
              <p className="site-footer__whatsapp">
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </p>
              <p className="site-footer__instagram">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  {INSTAGRAM_HANDLE}
                </a>
              </p>
            </div>

            <a href="#" className="site-footer__back-top" onClick={scrollToTop}>
              <span className="site-footer__back-top-desktop">
                <span className="site-footer__back-top-line">VOLVER</span>
                <span className="site-footer__back-top-line">
                  ARRIBA{' '}
                  <span className="site-footer__back-top-arrow" aria-hidden="true">
                    ↑
                  </span>
                </span>
              </span>
              <span className="site-footer__back-top-mobile">
                VOLVER ARRIBA{' '}
                <span className="site-footer__back-top-arrow" aria-hidden="true">
                  ↑
                </span>
              </span>
            </a>
          </div>

          <div className="site-footer__divider" aria-hidden="true" />

          <p className="site-footer__copyright">© 2026 Vitta. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
