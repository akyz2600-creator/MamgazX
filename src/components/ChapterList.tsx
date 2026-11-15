import { routes } from '../config/routes';
import { formatDate } from '../lib/format';
import { getChaptersNewestFirst, isRecentDate } from '../lib/manga';
import { Link } from '../router/router';
import type { Manga } from '../types/manga';
import { EmptyState } from './EmptyState';
import { BookIcon, ChevronRightIcon } from './icons';
import styles from './ChapterList.module.css';

/** Lista de capítulos de un manga, del más nuevo al más antiguo. Cada fila abre el lector del capítulo. */
export function ChapterList({ manga }: { manga: Manga }) {
  const chapters = getChaptersNewestFirst(manga);

  return (
    <section aria-labelledby="capitulos-titulo">
      <h2 id="capitulos-titulo" className={styles.title}>
        Capítulos
        <span className={styles.count}>{chapters.length}</span>
      </h2>

      {chapters.length > 0 ? (
        <ol className={styles.list}>
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link to={routes.chapter(manga.slug, chapter.number)} className={styles.row}>
                <span className={styles.main}>
                  <span className={styles.number}>Capítulo {chapter.number}</span>
                  {isRecentDate(chapter.publishedAt) && <span className={styles.new}>Nuevo</span>}
                  {chapter.title && <span className={styles.chapterTitle}>{chapter.title}</span>}
                </span>
                <time className={styles.date} dateTime={chapter.publishedAt}>
                  {formatDate(chapter.publishedAt)}
                </time>
                <ChevronRightIcon className={styles.chevron} width={18} height={18} />
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          icon={<BookIcon />}
          title="Aún no hay capítulos"
          text="Cuando se publique el primero, aparecerá aquí."
        />
      )}
    </section>
  );
}
