import { useEffect, useState } from 'react';

const HOLD_MS = 4000;
const FADE_MS = 1000;
const CYCLE_MS = HOLD_MS + FADE_MS;

export const SERVICE_IMAGE_START_DELAYS = {
  eventos: 0,
  viandas: 700,
  freezer: 1400,
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export default function ServiceImageCrossfade({ item, startDelay = 0 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const images = [
    {
      src: item.image,
      alt: item.alt,
      className: 'service-block__image-layer--primary',
      decorative: false,
    },
    {
      src: item.secondaryImage,
      alt: '',
      className: 'service-block__image-layer--secondary',
      decorative: true,
    },
  ];

  useEffect(() => {
    [item.image, item.secondaryImage].forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  }, [item.image, item.secondaryImage]);

  useEffect(() => {
    if (prefersReducedMotion || !item.secondaryImage) return undefined;

    let cancelled = false;
    let holdTimeoutId = null;
    let startTimeoutId = null;

    const clearHoldTimeout = () => {
      if (holdTimeoutId !== null) {
        window.clearTimeout(holdTimeoutId);
        holdTimeoutId = null;
      }
    };

    const scheduleNextToggle = (isFirstHold = false) => {
      clearHoldTimeout();
      if (cancelled || document.hidden) return;

      const delay = isFirstHold ? HOLD_MS : CYCLE_MS;

      holdTimeoutId = window.setTimeout(() => {
        if (cancelled || document.hidden) return;
        setActiveIndex((prev) => 1 - prev);
        scheduleNextToggle(false);
      }, delay);
    };

    const begin = () => {
      if (cancelled) return;
      scheduleNextToggle(true);
    };

    startTimeoutId = window.setTimeout(begin, startDelay);

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearHoldTimeout();
        return;
      }
      if (!cancelled) {
        scheduleNextToggle(true);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimeoutId);
      clearHoldTimeout();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [item.secondaryImage, prefersReducedMotion, startDelay]);

  if (prefersReducedMotion || !item.secondaryImage) {
    return (
      <img
        className="service-block__image-layer service-block__image-layer--primary is-active"
        src={item.image}
        alt={item.alt}
      />
    );
  }

  return images.map((image, index) => (
    <img
      key={image.src}
      className={`service-block__image-layer ${image.className} ${
        index === activeIndex ? 'is-active' : 'is-inactive'
      }`}
      src={image.src}
      alt={image.alt}
      aria-hidden={image.decorative || undefined}
      decoding="async"
    />
  ));
}
