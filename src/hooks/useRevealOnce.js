import { useEffect, useRef } from 'react';

const REVEAL_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export { REVEAL_EASE };

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useRevealOnce(delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    element.style.setProperty('--reveal-delay', `${delay}ms`);

    if (prefersReducedMotion()) {
      element.classList.add('is-revealed');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px',
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

export function useHeroIntro() {
  useEffect(() => {
    const hero = document.querySelector('.hero-philosophy');
    if (!hero || hero.classList.contains('hero-intro--done')) return undefined;

    if (prefersReducedMotion()) {
      hero.classList.add('hero-intro--active', 'hero-intro--done');
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      hero.classList.add('hero-intro--active');
    });

    const timer = window.setTimeout(() => {
      hero.classList.add('hero-intro--done');
    }, 2200);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);
}
