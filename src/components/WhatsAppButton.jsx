import { WHATSAPP_LINK } from '../data/whatsapp';

export default function WhatsAppButton({ children, className = '' }) {
  const classes = ['whatsapp-btn', className].filter(Boolean).join(' ');

  return (
    <a
      href={WHATSAPP_LINK}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
