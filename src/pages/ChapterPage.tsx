import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { BookIcon } from '../components/icons';
import { routes } from '../config/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate } from '../lib/format';
import { getAdjacentChapters } from '../lib/manga';
import type { Chapter, Manga } from '../types/manga';
import styles from './ChapterPage.module.css';

interface ChapterPageProps {
  manga: Manga;
  chapter: Chapter;
}

/**
 * Página del capítulo. El lector todavía no existe: esta página deja lista la URL
 * (`/manga/{slug}/capitulo/{número}`) y la navegación entre capítulos, y lo avisa claramente.
 */
export function ChapterPage({ manga, chapter }: ChapterPageProps) {
  useDocumentTitle(`${manga.title} · Capítulo ${chapter.number}`);
  const { previous, next } = getAdjacentChapters(manga, chapter.number);

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: routes.home },
          { label: 'Catálogo', to: routes.catalog },
          { label: manga.title, to: routes.manga(manga.slug) },
          { label: `Capítulo ${chapter.number}` },
        ]}
      />

      <header className={styles.header}>
        <h1 className={styles.title}>
          {manga.title} <span className={styles.chapter}>· Capítulo {chapter.number}</span>
        </h1>
        {chapter.title && <p className={styles.chapterTitle}>{chapter.title}</p>}
        <p className={styles.date}>
          Publicado el <time dateTime={chapter.publishedAt}>{formatDate(chapter.publishedAt)}</time>
        </p>
      </header>

      <EmptyState
        icon={<BookIcon />}
        title="El lector estará disponible próximamente"
        text="Aquí se mostrarán las páginas del capítulo cuando el lector esté listo."
      />

      <nav className={styles.pager} aria-label="Navegación entre capítulos">
        <div className={styles.slot}>
          {previous && (
            <Button variant="secondary" to={routes.chapter(manga.slug, previous.number)}>
              <span aria-hidden="true">←</span> Capítulo {previous.number}
            </Button>
          )}
        </div>
        <Button variant="secondary" to={routes.manga(manga.slug)}>
          Ver ficha
        </Button>
        <div className={`${styles.slot} ${styles.end}`}>
          {next && (
            <Button to={routes.chapter(manga.slug, next.number)}>
              Capítulo {next.number} <span aria-hidden="true">→</span>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
