import type { GenreId } from '../data/genres';

/** Tipos del dominio. Sin dependencias de React. */

export type MangaFormat = 'manga' | 'manhwa';

/** En publicación o finalizado. */
export type MangaStatus = 'ongoing' | 'completed';

export interface Chapter {
  id: string;
  /** Número de capítulo (puede ser decimal, p. ej. 10.5). Único dentro de un manga. */
  number: number;
  title?: string;
  /** Fecha de publicación en formato ISO `AAAA-MM-DD`. */
  publishedAt: string;
  /**
   * Cantidad de páginas. Las imágenes no se listan: se calculan por convención
   * (`{slug}/chapters/{capítulo}/{página}.webp`, ver ARCHITECTURE.md).
   */
  pages: number;
}

export interface Manga {
  id: string;
  /** Identificador estable para la URL (`/manga/{slug}`) y la carpeta de imágenes. */
  slug: string;
  title: string;
  alternativeTitle?: string;
  synopsis: string;
  format: MangaFormat;
  status: MangaStatus;
  /** Ids del catálogo de géneros (`src/data/genres.ts`). */
  genres: GenreId[];
  /**
   * Archivo de portada dentro de `public/content/mangas/{slug}/` (p. ej. `cover.webp`).
   * Si falta, la interfaz muestra una portada provisional.
   */
  coverImage?: string;
  chapters: Chapter[];
  /** Contador de lecturas. Debe provenir de un sistema real de estadísticas (fase futura). */
  views: number;
  /** Fechas ISO `AAAA-MM-DD`. */
  createdAt: string;
  updatedAt: string;
  /** Fecha del capítulo más reciente; `null` si aún no hay capítulos. Se deriva de `chapters`. */
  lastChapterAt: string | null;
  /** `true` en datos de demostración (incluidas las lecturas). Se elimina con los datos reales. */
  isExample?: boolean;
}
