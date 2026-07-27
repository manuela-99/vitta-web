export default function SinTaccInfoBlock({ title, body, variant = 'light', layout = 'split' }) {
  const iconSrc = variant === 'dark' ? '/images/sin-tacc-claro.png' : '/images/sin-tacc-negro.png';

  if (layout === 'compact') {
    return (
      <div className="viandas-intro__tacc viandas-intro__tacc--compact">
        <img
          src={iconSrc}
          alt="Sin TACC"
          className="sin-tacc-icon viandas-intro__tacc-icon"
        />
        <p className="viandas-intro__tacc-heading">{title}</p>
        <p className="viandas-intro__tacc-body">{body}</p>
      </div>
    );
  }

  return (
    <div className="viandas-intro__tacc">
      <div className="viandas-intro__tacc-heading">
        <span>{title}</span>
        <img
          src={iconSrc}
          alt="Sin TACC"
          className="sin-tacc-icon viandas-intro__tacc-icon"
        />
      </div>
      <p className="viandas-intro__tacc-body">{body}</p>
    </div>
  );
}
