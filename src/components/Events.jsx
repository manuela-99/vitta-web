import { events } from '../data/siteContent';
import { WHATSAPP_LINK } from '../data/whatsapp';

export default function Events() {
  return (
    <section id="eventos" className="events chapter-section chapter-panel" aria-label="Eventos">
      <div className="chapter-panel__inner panel-frame">
        <div className="events__layout">
          <div className="events__content">
            <h2 className="events__title script-title">{events.title}</h2>
            <p className="events__lead">{events.paragraphs[0]}</p>
            <p className="events__accent">{events.paragraphs[1]}</p>
            <a
              href={WHATSAPP_LINK}
              className="events__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              {events.cta}
            </a>
          </div>
          <div className="events__media" aria-hidden="true">
            <img
              className="events__illustration"
              src="/assets/eventos.png"
              alt=""
              width={736}
              height={920}
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
