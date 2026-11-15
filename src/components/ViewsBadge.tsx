import { formatCompact, formatNumber } from '../lib/format';
import { EyeIcon } from './icons';
import styles from './ViewsBadge.module.css';

interface ViewsBadgeProps {
  views: number;
  /** `true` si el dato es de demostración; se refleja en el texto para lectores de pantalla. */
  demo?: boolean | undefined;
}

/** Contador de lecturas compacto (para la esquina de una tarjeta). */
export function ViewsBadge({ views, demo }: ViewsBadgeProps) {
  const label = `${formatNumber(views)} lecturas${demo ? ' (datos de demostración)' : ''}`;
  return (
    <span className={styles.badge} title={label} aria-label={label}>
      <EyeIcon width={13} height={13} />
      {formatCompact(views)}
    </span>
  );
}
