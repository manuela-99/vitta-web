import { useRevealOnce } from '../hooks/useRevealOnce';

export default function Reveal({
  as: Component = 'div',
  className = '',
  delay = 0,
  children,
  ...props
}) {
  const ref = useRevealOnce(delay);

  return (
    <Component ref={ref} className={`reveal ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
