import { useEffect } from 'react';
import { services } from '../data/siteContent';
import Reveal from './Reveal';
import ServiceImageCrossfade, { SERVICE_IMAGE_START_DELAYS } from './ServiceImageCrossfade';

function ServiceBlock({ item, variant, delay = 0 }) {
  return (
    <Reveal
      as="article"
      className={`service-block service-block--${variant} service-block--${item.imageKey}`}
      delay={delay}
    >
      <div className="service-block__media">
        <a href={item.href} className="service-block__image-link">
          <div className="service-block__image">
            <ServiceImageCrossfade
              item={item}
              startDelay={SERVICE_IMAGE_START_DELAYS[item.imageKey] ?? 0}
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
    </Reveal>
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
        <Reveal as="header" className="services__header">
          <h2 className="services__title script-title">
            <span className="services__title-line">Tres formas</span>
            <span className="services__title-line">de acompañarte.</span>
          </h2>
          <p className="services__intro">{services.intro}</p>
        </Reveal>

        <div className="services__composition">
          <ServiceBlock item={eventos} variant="featured" delay={0} />

          <div className="services__stack">
            <ServiceBlock item={viandas} variant="compact" delay={100} />
            <ServiceBlock item={freezer} variant="compact" delay={200} />
          </div>
        </div>
      </div>
    </section>
  );
}
