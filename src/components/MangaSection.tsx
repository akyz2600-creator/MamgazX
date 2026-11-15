import type { Manga } from '../types/manga';
import { EmptyState } from './EmptyState';
import { SparkIcon } from './icons';
import { MangaCard } from './MangaCard';
import styles from './MangaSection.module.css';

interface MangaSectionProps {
  /** Identificador de la sección; sirve de ancla para la navegación. */
  id: string;
  title: string;
  description?: string;
  mangas: Manga[];
  /** Mensaje que se muestra si `mangas` está vacío. */
  empty: { title: string; text: string; ghosts?: boolean };
}

/** Sección con título y una cuadrícula de tarjetas. Añadir mangas no requiere cambiar nada aquí. */
export function MangaSection({ id, title, description, mangas, empty }: MangaSectionProps) {
  const headingId = `${id}-titulo`;

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </header>

      {mangas.length > 0 ? (
        <ul className={styles.grid}>
          {mangas.map((manga) => (
            <li key={manga.slug}>
              <MangaCard manga={manga} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={<SparkIcon />} {...empty} />
      )}
    </section>
  );
}
