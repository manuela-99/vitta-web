import HamburgerButton from './HamburgerButton';
import CartIconButton from './cart/CartIconButton';

export default function SiteHeader({ isMenuOpen, onToggleMenu, variant = 'light' }) {
  const logoSrc =
    variant === 'light' ? '/images/logo-vitta-claro.png' : '/images/logo-vitta-negro.png';

  return (
    <header className="site-header">
      <a href="#" className="header-logo" aria-label="VITTA — Inicio">
        <img src={logoSrc} alt="VITTA" />
      </a>
      <div className="site-header__actions">
        <CartIconButton variant={variant} />
        <HamburgerButton isOpen={isMenuOpen} onToggle={onToggleMenu} variant={variant} />
      </div>
    </header>
  );
}
