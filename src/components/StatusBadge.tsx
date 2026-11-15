import { cx } from '../lib/classNames';
import { STATUS_LABELS } from '../lib/manga';
import type { MangaStatus } from '../types/manga';
import styles from './StatusBadge.module.css';

/** Estado de publicación de un manga (en emisión, finalizado, en pausa). */
export function StatusBadge({ status }: { status: MangaStatus }) {
  return (
    <span className={cx(styles.badge, styles[status])}>
      <span className={styles.dot} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
