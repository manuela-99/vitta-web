import Reveal from './Reveal';

export default function ViandasPromoBanner() {
  return (
    <section
      className="viandas-promo chapter-section chapter-section--dark frame-border frame-border--black"
      aria-label={'Promoci\u00f3n Viandas'}
    >
      <div className="viandas-promo__inner menu-section__inner">
        <Reveal className="viandas-promo__content" delay={0}>
          <p className="viandas-promo__eyebrow">PROMO VIANDAS</p>
          <h2 className="viandas-promo__title script-title">{'Arm\u00e1 tu semana'}</h2>
          <p className="viandas-promo__text">
            {
              'Combin\u00e1 tus platos favoritos con nuestras guarniciones y acced\u00e9 a un descuento especial.'
            }
          </p>

          <div className="viandas-promo__offers">
            <article className="viandas-promo__offer">
              <p className="viandas-promo__offer-label menu-price editorial-num">5 platos + 5 guarniciones</p>
              <p className="viandas-promo__offer-value menu-price editorial-num">10% OFF</p>
            </article>
            <article className="viandas-promo__offer">
              <p className="viandas-promo__offer-label menu-price editorial-num">10 platos + 10 guarniciones</p>
              <p className="viandas-promo__offer-value menu-price editorial-num">15% OFF</p>
            </article>
          </div>

          <p className="viandas-promo__note">
            <span className="viandas-promo__note-lead">
              {'Las ensaladas tambi\u00e9n cuentan como guarnici\u00f3n.'}
            </span>{' '}
            El descuento se aplica autom{'\u00e1'}ticamente en el carrito y no incluye el costo de env{'\u00edo'}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
