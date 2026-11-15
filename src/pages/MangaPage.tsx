import { Breadcrumb } from '../components/Breadcrumb';
import { Button } from '../components/Button';
import { ChapterList } from '../components/ChapterList';
import { Cover } from '../components/Cover';
import { BookIcon } from '../components/icons';
import { StatusBadge } from '../components/StatusBadge';
import { routes } from '../config/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate, formatNumber } from '../lib/format';
import { FORMAT_LABELS, getCoverUrl, getFirstChapter, getGenreNames, getLatestChapter } from '../lib/manga';
import type { Manga } from '../types/manga';
import styles from './MangaPage.module.css';

/** Ficha individual de un manga: datos, estadísticas, sinopsis y lista de capítulos. */
export function MangaPage({ manga }: { manga: Manga }) {
  useDocumentTitle(manga.title);

  const first = getFirstChapter(manga);
  const latest = getLatestChapter(manga);

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: routes.home },
          { label: 'Catálogo', to: routes.catalog },
          { label: manga.title },
        ]}
      />

      <div className={styles.layout}>
        <div className={styles.coverWrap}>
          <Cover title={manga.title} src={getCoverUrl(manga)} className={styles.cover} />
        </div>

        {/* En móvil `.main` se "disuelve" (display: contents) para que el título quede junto a la portada. */}
        <div className={styles.main}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>
              {FORMAT_LABELS[manga.format]}
              {manga.isExample && <span className={styles.example}>Datos de ejemplo</span>}
            </p>
            <h1 className={styles.title}>{manga.title}</h1>
            {manga.alternativeTitle && <p className={styles.alternative}>{manga.alternativeTitle}</p>}
            <div>
              <StatusBadge status={manga.status} />
            </div>
          </div>

          <div className={styles.body}>
            {first && latest && (
              <div className={styles.actions}>
                <Button to={routes.chapter(manga.slug, first.number)} icon={<BookIcon />}>
                  Leer capítulo {first.number}
                </Button>
                {latest.number !== first.number && (
                  <Button variant="secondary" to={routes.chapter(manga.slug, latest.number)}>
                    Último: capítulo {latest.number}
                  </Button>
                )}
              </div>
            )}

            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>Capítulos</dt>
                <dd>{manga.chapters.length}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Última actualización</dt>
                <dd>
                  {manga.lastChapterAt ? (
                    <time dateTime={manga.lastChapterAt}>{formatDate(manga.lastChapterAt)}</time>
                  ) : (
                    'Sin capítulos aún'
                  )}
                </dd>
              </div>
              <div className={styles.stat}>
                <dt>Lecturas</dt>
                <dd>
                  {formatNumber(manga.views)}
                  {manga.isExample && <small className={styles.demo}>Dato de demostración</small>}
                </dd>
              </div>
            </dl>

            <ul className={styles.genres} aria-label="Géneros">
              {getGenreNames(manga).map((genre) => (
                <li key={genre} className={styles.genre}>
                  {genre}
                </li>
              ))}
            </ul>

            <section aria-labelledby="sinopsis-titulo">
              <h2 id="sinopsis-titulo" className={styles.sectionTitle}>
                Sinopsis
              </h2>
              <p className={styles.synopsis}>{manga.synopsis}</p>
            </section>
          </div>

          <div className={styles.chapters}>
            <ChapterList manga={manga} />
          </div>
        </div>
      </div>
    </div>
  );
}
