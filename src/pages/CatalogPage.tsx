import { useMemo } from 'react';
import { EmptyState } from '../components/EmptyState';
import { SparkIcon } from '../components/icons';
import { MangaGrid } from '../components/MangaGrid';
import { SegmentedControl } from '../components/SegmentedControl';
import { routes } from '../config/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SORT_LABELS, sortMangas, type SortOrder } from '../lib/manga';
import { useLocation, useNavigate } from '../router/router';
import type { Manga } from '../types/manga';
import styles from './CatalogPage.module.css';

const SORT_OPTIONS = (Object.keys(SORT_LABELS) as SortOrder[]).map((value) => ({
  value,
  label: SORT_LABELS[value],
}));

/** El orden vive en la URL (`?orden=populares`) para poder compartirlo o volver a él con "atrás". */
function readOrder(search: string): SortOrder {
  return new URLSearchParams(search).get('orden') === 'populares' ? 'popular' : 'recent';
}

/** Catálogo completo con orden por "más recientes" o "más populares". */
export function CatalogPage({ mangas }: { mangas: Manga[] }) {
  useDocumentTitle('Catálogo');
  const { search } = useLocation();
  const navigate = useNavigate();
  const order = readOrder(search);
  const sorted = useMemo(() => sortMangas(mangas, order), [mangas, order]);
  const hasDemoViews = order === 'popular' && sorted.some((manga) => manga.isExample && manga.views > 0);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Catálogo</h1>
        <p className={styles.count}>
          {mangas.length} {mangas.length === 1 ? 'título' : 'títulos'}
        </p>
      </header>

      <div className={styles.toolbar}>
        <SegmentedControl
          label="Ordenar por"
          options={SORT_OPTIONS}
          value={order}
          onChange={(next) =>
            navigate(next === 'popular' ? routes.catalogByPopularity : routes.catalog, { replace: true, scroll: false })
          }
        />
      </div>

      {hasDemoViews && (
        <p className={styles.note} role="note">
          Las lecturas son datos de demostración, no estadísticas reales.
        </p>
      )}

      {sorted.length > 0 ? (
        <MangaGrid mangas={sorted} showViews={order === 'popular'} />
      ) : (
        <EmptyState
          icon={<SparkIcon />}
          title="Aún no hay mangas en el catálogo"
          text="Estamos preparando el primer título. Vuelve pronto."
        />
      )}
    </div>
  );
}
