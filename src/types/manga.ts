/** Tipos del dominio. No dependen de React ni de ningún servicio externo. */

export type MangaFormat = 'manga' | 'manhwa';

export type MangaStatus = 'ongoing' | 'completed' | 'hiatus';

export interface Chapter {
  /** Número del capítulo (1, 2, 3...). Determina la carpeta `001`, `002`, etc. */
  number: number;
  /** Título opcional del capítulo. */
  title?: string;
  /** Cantidad de páginas. Las imágenes se nombran `001.webp` … según este total. */
  pageCount: number;
  /** Fecha de publicación en formato ISO (AAAA-MM-DD). */
  publishedAt?: string;
}

export interface Manga {
  /** Identificador único y estable; nombre de su carpeta en `public/content/mangas/`. */
  slug: string;
  title: string;
  description: string;
  format: MangaFormat;
  status: MangaStatus;
  genres: string[];
  /**
   * Nombre del archivo de portada dentro de la carpeta del manga (p. ej. `cover.webp`).
   * Si falta, la interfaz muestra una portada provisional.
   */
  cover?: string;
  chapters: Chapter[];
  /** `true` en datos de ejemplo. La interfaz los marca como tales. Se elimina con los datos reales. */
  isExample?: boolean;
}
