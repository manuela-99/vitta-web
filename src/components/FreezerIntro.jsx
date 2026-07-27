import { freezerGlutenInfo, freezerIntro } from '../data/siteContent';
import SinTaccInfoBlock from './SinTaccInfoBlock';

export default function FreezerIntro() {
  return (
    <section
      id="freezer-ready"
      className="freezer-intro chapter-section chapter-section--dark frame-border frame-border--black"
      aria-label="Freezer Ready"
    >
      <div className="freezer-intro__inner chapter-section__inner">
        <header className="freezer-intro__header">
          <h2 className="chapter-section__title script-title freezer-intro__title">{freezerIntro.title}</h2>
          <p className="chapter-section__lead freezer-intro__lead">
            {freezerIntro.subtitleLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? (
                  <>
                    <br aria-hidden="true" />
                    {line}
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </p>
        </header>

        <div className="freezer-intro__minimums">
          {freezerIntro.items.map((item) => (
            <article key={item.name} className="freezer-intro__minimums-row">
              <h3 className="freezer-intro__minimums-name">{item.name}</h3>
              <p className="freezer-intro__minimums-note">
                Pedido mínimo:{' '}
                <span className="editorial-num editorial-num--oldstyle">{item.minimum}</span>
              </p>
            </article>
          ))}
        </div>

        <SinTaccInfoBlock
          title={freezerGlutenInfo.title}
          body={freezerGlutenInfo.body}
          variant="dark"
          layout="compact"
        />
      </div>
    </section>
  );
}
