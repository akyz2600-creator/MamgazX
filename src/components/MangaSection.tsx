import type { Manga } from '../types/manga';
import { EmptyState } from './EmptyState';
import { SparkIcon } from './icons';
import { MangaGrid } from './MangaGrid';
import { Link } from '../router/router';
import styles from './MangaSection.module.css';

interface MangaSectionProps {
  /** Identificador de la sección; sirve de ancla para la navegación. */
  id: string;
  title: string;
  description?: string;
  mangas: Manga[];
  showViews?: boolean;
  /** Enlace opcional a la derecha del título (p. ej. "Ver catálogo"). */
  action?: { label: string; to: string };
  /** Mensaje que se muestra si `mangas` está vacío. */
  empty: { title: string; text: string; ghosts?: boolean };
}

/** Sección con título y una cuadrícula de tarjetas. Añadir mangas no requiere cambiar nada aquí. */
export function MangaSection({ id, title, description, mangas, showViews, action, empty }: MangaSectionProps) {
  const headingId = `${id}-titulo`;

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {action && (
          <Link to={action.to} className={styles.action}>
            {action.label}
          </Link>
        )}
      </header>

      {mangas.length > 0 ? (
        <MangaGrid mangas={mangas} showViews={showViews ?? false} />
      ) : (
        <EmptyState icon={<SparkIcon />} {...empty} />
      )}
    </section>
  );
}
