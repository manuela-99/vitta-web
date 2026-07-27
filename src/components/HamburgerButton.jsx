import { useEffect, useCallback } from 'react';

export default function HamburgerButton({ isOpen, onToggle, variant = 'light' }) {
  return (
    <button
      type="button"
      className={`hamburger ${isOpen ? 'hamburger--open' : ''} ${variant === 'dark' ? 'hamburger--dark' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={isOpen}
    >
      <span className="hamburger__line" />
      <span className="hamburger__line" />
      <span className="hamburger__line" />
    </button>
  );
}

export function useMenuLock(isOpen) {
  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isOpen]);
}

export function useEscapeKey(isOpen, onClose) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);
}
