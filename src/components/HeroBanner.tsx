import { routes } from '../config/routes';
import { FORMAT_LABELS, getCoverUrl, getFirstChapter, getGenreNames, getLatestChapter } from '../lib/manga';
import type { Manga } from '../types/manga';
import { Button } from './Button';
import { Cover } from './Cover';
import { BookIcon, InfoIcon } from './icons';
import { StatusBadge } from './StatusBadge';
import styles from './HeroBanner.module.css';

interface HeroBannerProps {
  /** Manga destacado. Si no hay ninguno, se muestra un mensaje de bienvenida. */
  manga: Manga | undefined;
}

const HINT_ID = 'hero-hint';

export function HeroBanner({ manga }: HeroBannerProps) {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-titulo">
      <div className={`container ${styles.inner}`}>
        {manga ? <Featured manga={manga} /> : <Welcome />}
      </div>
    </section>
  );
}

function Featured({ manga }: { manga: Manga }) {
  const latest = getLatestChapter(manga);
  const first = getFirstChapter(manga);

  return (
    <div className={styles.grid}>
      <div className={styles.coverWrap}>
        <Cover title={manga.title} src={getCoverUrl(manga)} className={styles.cover} />
      </div>

      {/* `.text` agrupa título, sinopsis y botones. En móvil se "disuelve" (display: contents) para que el título quede junto a la portada. */}
      <div className={styles.text}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>
            Destacado
            {manga.isExample && <span className={styles.example}>Datos de ejemplo</span>}
          </p>
          <h1 id="hero-titulo" className={styles.title}>
            {manga.title}
          </h1>
          <div className={styles.badges}>
            <StatusBadge status={manga.status} />
            <span className={styles.format}>{FORMAT_LABELS[manga.format]}</span>
            {latest && <span className={styles.format}>Último capítulo: {latest.number}</span>}
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.synopsis}>{manga.synopsis}</p>
          <ul className={styles.genres} aria-label="Géneros">
            {getGenreNames(manga).map((genre) => (
              <li key={genre} className={styles.genre}>
                {genre}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <div className={styles.buttons}>
            {first ? (
              <Button to={routes.chapter(manga.slug, first.number)} icon={<BookIcon />}>
                Leer ahora
              </Button>
            ) : (
              <Button comingSoon describedBy={HINT_ID} icon={<BookIcon />}>
                Leer ahora
              </Button>
            )}
            <Button variant="secondary" to={routes.manga(manga.slug)} icon={<InfoIcon />}>
              Ver detalles
            </Button>
          </div>
          {!first && (
            <p id={HINT_ID} className={styles.hint}>
              Aún no hay capítulos publicados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className={styles.welcome}>
      <h1 id="hero-titulo" className={styles.title}>
        Muy pronto, manga y manhwa en español
      </h1>
      <p className={styles.synopsis}>Estamos preparando el primer título. Vuelve pronto.</p>
    </div>
  );
}
