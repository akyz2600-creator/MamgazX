import type { ReactNode } from 'react';
import { routes } from '../config/routes';
import { getCoverUrl, getGenreNames, getLatestChapter, isRecentlyUpdated } from '../lib/manga';
import { Link } from '../router/router';
import type { Manga } from '../types/manga';
import { Cover } from './Cover';
import { StatusBadge } from './StatusBadge';
import styles from './MangaCard.module.css';

interface MangaCardProps {
  manga: Manga;
  /** Espacio para un indicador en la esquina de la portada (p. ej. lecturas). */
  indicator?: ReactNode;
}

/** Tarjeta reutilizable de manga. Al pulsarla se abre su ficha. Funciona con cualquier `Manga`. */
export function MangaCard({ manga, indicator }: MangaCardProps) {
  const latest = getLatestChapter(manga);
  const recent = isRecentlyUpdated(manga);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Cover title={manga.title} src={getCoverUrl(manga)} className={styles.cover} />
        {recent && (
          <span className={styles.recent}>
            <span className={styles.pulse} aria-hidden="true" />
            Actualizado
          </span>
        )}
        {indicator && <div className={styles.indicator}>{indicator}</div>}
        {manga.isExample && <span className={styles.example}>Ejemplo</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={routes.manga(manga.slug)} className={styles.link}>
            {manga.title}
          </Link>
        </h3>
        <p className={styles.genres}>{getGenreNames(manga).slice(0, 2).join(' · ')}</p>
        <div className={styles.meta}>
          <span className={styles.chapter}>{latest ? `Cap. ${latest.number}` : 'Sin capítulos'}</span>
          <StatusBadge status={manga.status} />
        </div>
      </div>
    </article>
  );
}
