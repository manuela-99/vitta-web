import { navLinks } from '../data/siteContent';
import { useCart } from '../context/CartContext';

export default function NavOverlay({ isOpen, onClose, onNavigate }) {
  const { totalItems, openCart } = useCart();
  const sectionLinks = navLinks.slice(0, -1);
  const contactLink = navLinks[navLinks.length - 1];

  const handleClick = (href) => {
    onNavigate(href);
    onClose();
  };

  const handleCartClick = (event) => {
    event.preventDefault();
    openCart();
    onClose();
  };

  const handleHome = (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

  return (
    <nav
      className={`nav-overlay ${isOpen ? 'nav-overlay--open' : ''}`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <a
        href="#"
        className="header-logo nav-overlay__logo"
        aria-label="VITTA — Inicio"
        onClick={handleHome}
      >
        <img src="/images/logo-vitta-negro.png" alt="VITTA" />
      </a>
      <ul className="nav-overlay__list" onClick={(e) => e.stopPropagation()}>
        {sectionLinks.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="nav-overlay__link"
              onClick={(e) => {
                e.preventDefault();
                handleClick(href);
              }}
            >
              {label}
            </a>
          </li>
        ))}

        <li>
          <a
            href="#"
            className="nav-overlay__link"
            onClick={handleCartClick}
          >
            CARRITO
            {totalItems > 0 ? (
              <>
                {' ('}
                <span className="cart-num">{totalItems.toLocaleString('es-AR')}</span>
                {')'}
              </>
            ) : (
              ''
            )}
          </a>
        </li>

        <li key={contactLink.href}>
          <a
            href={contactLink.href}
            className="nav-overlay__link"
            onClick={(e) => {
              e.preventDefault();
              handleClick(contactLink.href);
            }}
          >
            {contactLink.label}
          </a>
        </li>
      </ul>
    </nav>
  );
}
