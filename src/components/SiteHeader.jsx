import HamburgerButton from './HamburgerButton';
import CartIconButton from './cart/CartIconButton';

export default function SiteHeader({ isMenuOpen, onToggleMenu, variant = 'light' }) {
  const logoSrc =
    variant === 'light' ? '/images/logo-vitta-claro.png' : '/images/logo-vitta-negro.png';

  const handleHome = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <a href="#" className="header-logo" aria-label="VITTA — Inicio" onClick={handleHome}>
        <img src={logoSrc} alt="VITTA" />
      </a>
      <div className="site-header__actions">
        <CartIconButton variant={variant} />
        <HamburgerButton isOpen={isMenuOpen} onToggle={onToggleMenu} variant={variant} />
      </div>
    </header>
  );
}
