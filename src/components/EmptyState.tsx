import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  text: string;
  /** Muestra siluetas decorativas de tarjetas al fondo, para sugerir lo que llegará. */
  ghosts?: boolean;
}

/** Estado vacío reutilizable (secciones sin contenido todavía). */
export function EmptyState({ icon, title, text, ghosts }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      {ghosts && (
        <div className={styles.ghosts} aria-hidden="true">
          <span className={styles.ghost} />
          <span className={styles.ghost} />
          <span className={styles.ghost} />
          <span className={styles.ghost} />
        </div>
      )}
      <div className={styles.content}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
