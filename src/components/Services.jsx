import { useEffect } from 'react';
import { services } from '../data/siteContent';

const ANIMATION_DELAYS = {
  featured: 0,
  compact: 1.2,
  compactSecond: 2.4,
};

function ServiceImageLayers({ item }) {
  return (
    <img
      className="service-block__image-layer service-block__image-layer--secondary"
      src={item.secondaryImage}
      alt=""
      aria-hidden="true"
    />
  );
}

function ServiceBlock({ item, variant, animationDelay = 0 }) {
  return (
    <article
      className={`service-block service-block--${variant} service-block--${item.imageKey}`}
      style={{ '--service-image-delay': `${animationDelay}s` }}
    >
      <div className="service-block__media">
        <a href={item.href} className="service-block__image-link">
          <div className="service-block__image">
            <ServiceImageLayers item={item} />
            <img
              className="service-block__image-layer service-block__image-layer--primary"
              src={item.image}
              alt={item.alt}
            />
          </div>
        </a>
      </div>

      <div className="service-block__head">
        <p className="service-block__number" aria-hidden="true">
          {item.number}
        </p>
        <h3 className="service-block__title">{item.title}</h3>
      </div>

      <div className="service-block__body">
        <p className="service-block__desc">
          {item.description.map((line, index) => (
            <span key={index}>
              {index > 0 ? (
                <>
                  <br className="service-block__desc-break" aria-hidden="true" />
                  {line}
                </>
              ) : (
                line
              )}
            </span>
          ))}
        </p>
        <a href={item.href} className="service-block__link text-link">
          SABER MÁS
        </a>
      </div>
    </article>
  );
}

export default function Services() {
  const [eventos, viandas, freezer] = services.items;

  useEffect(() => {
    services.items.forEach((item) => {
      [item.image, item.secondaryImage].forEach((src) => {
        if (!src) return;
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  return (
    <section className="services" aria-label="Servicios">
      <div className="services__inner">
        <header className="services__header">
          <h2 className="services__title script-title">
            <span className="services__title-line">Tres formas</span>
            <span className="services__title-line">de acompañarte.</span>
          </h2>
          <p className="services__intro">{services.intro}</p>
        </header>

        <div className="services__composition">
          <ServiceBlock item={eventos} variant="featured" animationDelay={ANIMATION_DELAYS.featured} />

          <div className="services__stack">
            <ServiceBlock item={viandas} variant="compact" animationDelay={ANIMATION_DELAYS.compact} />
            <ServiceBlock
              item={freezer}
              variant="compact"
              animationDelay={ANIMATION_DELAYS.compactSecond}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
