import { useState, useCallback, useEffect } from 'react';
import SiteHeader from './components/SiteHeader';
import NavOverlay from './components/NavOverlay';
import HeroPhilosophy from './components/HeroPhilosophy';
import Services from './components/Services';
import Events from './components/Events';
import ViandasIntro from './components/ViandasIntro';
import ViandasMenu from './components/ViandasMenu';
import FreezerIntro from './components/FreezerIntro';
import FreezerMenu from './components/FreezerMenu';
import Contact from './components/Contact';
import CartDrawer from './components/cart/CartDrawer';
import { useMenuLock, useEscapeKey } from './components/HamburgerButton';
import { useHeroIntro } from './hooks/useRevealOnce';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVariant, setHeaderVariant] = useState('light');

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  useMenuLock(menuOpen);
  useEscapeKey(menuOpen, closeMenu);
  useHeroIntro();

  const handleNavigate = useCallback((href) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const atSection = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= 80 && rect.bottom > 80;
    };

    if (
      atSection('.hero-philosophy') ||
      atSection('.services') ||
      atSection('.freezer-intro') ||
      atSection('.menu-section--dark') ||
      atSection('.contact') ||
      atSection('.site-footer')
    ) {
      setHeaderVariant('light');
    } else {
      setHeaderVariant('dark');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <SiteHeader
        isMenuOpen={menuOpen}
        onToggleMenu={toggleMenu}
        variant={headerVariant}
      />
      <NavOverlay
        isOpen={menuOpen}
        onClose={closeMenu}
        onNavigate={handleNavigate}
      />
      <CartDrawer />
      <main>
        <HeroPhilosophy />
        <Services />
        <Events />
        <ViandasIntro />
        <ViandasMenu />
        <FreezerIntro />
        <FreezerMenu />
        <Contact />
      </main>
    </>
  );
}

export default App;
