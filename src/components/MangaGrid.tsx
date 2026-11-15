import type { Manga } from '../types/manga';
import { MangaCard } from './MangaCard';
import { ViewsBadge } from './ViewsBadge';
import styles from './MangaGrid.module.css';

interface MangaGridProps {
  mangas: Manga[];
  /** Muestra el contador de lecturas en cada tarjeta (para vistas ordenadas por popularidad). */
  showViews?: boolean;
}

/** Cuadrícula adaptable de tarjetas. La usan el inicio y el catálogo. */
export function MangaGrid({ mangas, showViews }: MangaGridProps) {
  return (
    <ul className={styles.grid}>
      {mangas.map((manga) => (
        <li key={manga.id}>
          <MangaCard
            manga={manga}
            indicator={showViews && manga.views > 0 ? <ViewsBadge views={manga.views} demo={manga.isExample} /> : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
