import { useState } from 'react';
import { cx } from '../lib/classNames';
import styles from './Cover.module.css';

interface CoverProps {
  title: string;
  /** URL de la portada. Si falta o no carga, se muestra una portada provisional. */
  src?: string | undefined;
  className?: string;
}

function getInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/** Portada con proporción 2:3 fija. No inventa imágenes: sin portada, muestra un marcador. */
export function Cover({ title, src, className }: CoverProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cx(styles.cover, className)}>
      {src && !failed ? (
        <img
          className={styles.image}
          src={src}
          alt={`Portada de ${title}`}
          width={400}
          height={600}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={`Portada pendiente de ${title}`}>
          <span className={styles.initials}>{getInitials(title)}</span>
          <span className={styles.caption}>Portada pendiente</span>
        </div>
      )}
    </div>
  );
}
