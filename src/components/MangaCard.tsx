import type { ReactNode } from 'react';
import { getCoverUrl, getLatestChapter, isRecentlyUpdated } from '../lib/manga';
import type { Manga } from '../types/manga';
import { Cover } from './Cover';
import { StatusBadge } from './StatusBadge';
import styles from './MangaCard.module.css';

interface MangaCardProps {
  manga: Manga;
  /** Espacio para un indicador de popularidad (visitas, puntuación…) cuando existan datos reales. */
  indicator?: ReactNode;
  /** Destino al pulsar la tarjeta. Sin `href` la tarjeta es solo informativa (aún no hay página de detalles). */
  href?: string;
}

/** Tarjeta reutilizable de manga. Funciona con cualquier `Manga`, sin depender de uno concreto. */
export function MangaCard({ manga, indicator, href }: MangaCardProps) {
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
          {href ? (
            <a href={href} className={styles.link}>
              {manga.title}
            </a>
          ) : (
            manga.title
          )}
        </h3>
        <p className={styles.genres}>{manga.genres.slice(0, 2).join(' · ')}</p>
        <div className={styles.meta}>
          <span className={styles.chapter}>{latest ? `Cap. ${latest.number}` : 'Sin capítulos'}</span>
          <StatusBadge status={manga.status} />
        </div>
      </div>
    </article>
  );
}
