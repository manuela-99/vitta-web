import { viandasIntro, viandasGlutenInfo } from '../data/siteContent';
import SinTaccInfoBlock from './SinTaccInfoBlock';
import Reveal from './Reveal';
import { renderTextLines } from '../utils/renderTextLines';

function withEditorialNumerals(text) {
  const parts = text.split(/(\d+)/g);

  return parts.map((part, index) =>
    /^\d+$/.test(part) ? (
      <span key={index} className="editorial-num editorial-num--oldstyle">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function renderFactNote(text) {
  const emphasis = 'retornables';
  const index = text.toLowerCase().lastIndexOf(emphasis);
  if (index === -1) return withEditorialNumerals(text);

  const before = text.slice(0, index);
  const emphasized = text.slice(index, index + emphasis.length);
  const after = text.slice(index + emphasis.length);

  return (
    <>
      {withEditorialNumerals(before)}
      <strong>{emphasized}</strong>
      {after}
    </>
  );
}

function FactBlock({ heading, body, bodyLines, children }) {
  const renderBody = (text) => withEditorialNumerals(text);

  return (
    <article className="viandas-intro__fact">
      <h3 className="viandas-intro__fact-heading">{heading}</h3>
      <div className="viandas-intro__fact-rule" aria-hidden="true" />
      <p className="viandas-intro__fact-body">
        {bodyLines?.length
          ? renderTextLines(bodyLines, renderBody)
          : renderBody(body)}
      </p>
      {children}
    </article>
  );
}

export default function ViandasIntro() {
  const [portionsBlock, preparacionBlock, entregaBlock, conservacionBlock] = viandasIntro.blocks;

  return (
    <section id="viandas" className="viandas-intro chapter-section chapter-panel" aria-label="Viandas">
      <div className="chapter-panel__inner panel-frame">
        <Reveal as="header" className="viandas-intro__header">
          <h2 className="chapter-panel__title script-title viandas-intro__title">{viandasIntro.title}</h2>
          <p className="chapter-panel__lead viandas-intro__lead">
            {renderTextLines(viandasIntro.subtitleLines)}
          </p>
        </Reveal>

        <Reveal className="viandas-intro__facts" delay={100}>
          <FactBlock
            heading={portionsBlock.heading}
            body={portionsBlock.body}
          >
            <div className="viandas-intro__portions-detail">
              {portionsBlock.detail.map((item) => (
                <p key={item.weight} className="viandas-intro__portions-line">
                  <span className="editorial-num editorial-num--oldstyle">{item.weight}</span>
                  {' · '}
                  {item.label}
                </p>
              ))}
            </div>
          </FactBlock>

          <FactBlock
            heading={preparacionBlock.heading}
            body={preparacionBlock.body}
          />

          <FactBlock
            heading={entregaBlock.heading}
            body={entregaBlock.body}
          >
            {entregaBlock.note ? (
              <p className="viandas-intro__fact-note">{renderFactNote(entregaBlock.note)}</p>
            ) : null}
          </FactBlock>

          <FactBlock
            heading={conservacionBlock.heading}
            body={conservacionBlock.body}
          />
        </Reveal>

        <Reveal delay={180}>
          <SinTaccInfoBlock
            title={viandasGlutenInfo.title}
            body={viandasGlutenInfo.body}
            layout="compact"
          />
        </Reveal>
      </div>
    </section>
  );
}
