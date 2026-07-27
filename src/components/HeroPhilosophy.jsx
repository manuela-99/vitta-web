import { philosophy } from '../data/siteContent';

export default function HeroPhilosophy() {
  return (
    <section className="hero-philosophy frame-border frame-border--dark" aria-label="Portada y filosofía">
      <div className="hero-philosophy__bg" aria-hidden="true" />

      <div className="hero-philosophy__hero">
        <div className="hero-philosophy__logo-main">
          <img src="/images/logo-vitta-claro.png" alt="VITTA" />
        </div>
      </div>

      <div className="hero-philosophy__philosophy">
        <div className="hero-philosophy__inner">
          <div className="hero-philosophy__content">
            <h2 className="hero-philosophy__title script-title" aria-label="Somos lo que comemos">
              {philosophy.scriptTitleLines.map((line) => (
                <span key={line} className="hero-philosophy__title-line">
                  {line}
                </span>
              ))}
            </h2>
            <p className="hero-philosophy__body">{philosophy.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
