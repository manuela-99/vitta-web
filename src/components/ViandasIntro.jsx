import { viandasIntro, viandasGlutenInfo } from '../data/siteContent';
import SinTaccInfoBlock from './SinTaccInfoBlock';

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

function FactBlock({ heading, body, bodyLines, children }) {
  const renderBody = (text) => withEditorialNumerals(text);

  return (
    <article className="viandas-intro__fact">
      <h3 className="viandas-intro__fact-heading">{heading}</h3>
      <div className="viandas-intro__fact-rule" aria-hidden="true" />
      <p className="viandas-intro__fact-body">
        {bodyLines ? (
          bodyLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? (
                <>
                  <br className="viandas-intro__fact-break" aria-hidden="true" />
                  {renderBody(line)}
                </>
              ) : (
                renderBody(line)
              )}
            </span>
          ))
        ) : (
          renderBody(body)
        )}
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
        <header className="viandas-intro__header">
          <h2 className="chapter-panel__title script-title viandas-intro__title">{viandasIntro.title}</h2>
          <p className="chapter-panel__lead viandas-intro__lead">
            {viandasIntro.subtitleLines.map((line, index) => (
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

        <div className="viandas-intro__facts">
          <FactBlock
            heading={portionsBlock.heading}
            body={portionsBlock.body}
            bodyLines={portionsBlock.bodyLines}
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
            bodyLines={preparacionBlock.bodyLines}
          />

          <FactBlock
            heading={entregaBlock.heading}
            body={entregaBlock.body}
            bodyLines={entregaBlock.bodyLines}
          >
            {entregaBlock.note ? (
              <p className="viandas-intro__fact-note">{withEditorialNumerals(entregaBlock.note)}</p>
            ) : null}
          </FactBlock>

          <FactBlock
            heading={conservacionBlock.heading}
            body={conservacionBlock.body}
            bodyLines={conservacionBlock.bodyLines}
          />
        </div>

        <SinTaccInfoBlock
          title={viandasGlutenInfo.title}
          body={viandasGlutenInfo.body}
          layout="compact"
        />
      </div>
    </section>
  );
}
