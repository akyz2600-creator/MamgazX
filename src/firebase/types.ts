import type { Timestamp } from 'firebase/firestore';
import type { MangaFormat, MangaStatus } from '../types/manga';

/**
 * Forma de los documentos en Firestore (estructura inicial, Fase 4A).
 *
 * Son tipos de ALMACENAMIENTO, distintos de los tipos de interfaz de `src/types/manga.ts`
 * (que usan fechas ISO y llevan los capítulos dentro del manga). La conversión de un tipo a
 * otro se escribirá en la Fase 4B; los tipos de interfaz no cambian.
 *
 * Reglas de la estructura:
 *  - Las imágenes NO se guardan en Firebase: viven en Cloudflare R2 y aquí solo hay su URL y metadatos.
 *  - Firestore rechaza `undefined`: los campos opcionales sin valor se guardan como `null`
 *    (los de `ImageRef` se omiten). Todos los campos de cada documento deben existir.
 *  - Las fechas son `Timestamp` de Firestore.
 *  - `firestore.rules` valida estos campos al escribir; si cambias un tipo, cambia también las reglas.
 */

/** Imagen alojada en Cloudflare R2. */
export interface ImageRef {
  /** URL pública completa de la imagen. */
  url: string;
  width?: number;
  height?: number;
}

/** Página de un capítulo: imagen más su posición (empieza en 1). */
export interface ChapterPageDoc extends ImageRef {
  number: number;
}

/**
 * `mangas/{slug}`. El id del documento ES el slug: garantiza que sea único y permite
 * abrir un manga con una lectura directa, sin consulta. `slug` se repite como campo
 * y las reglas exigen que coincida con el id.
 */
export interface MangaDoc {
  title: string;
  alternativeTitle: string | null;
  slug: string;
  synopsis: string;
  /** Presente en el modelo actual de la interfaz (`manga` | `manhwa`). */
  format: MangaFormat;
  coverImage: ImageRef | null;
  /** Slugs de `genres/{slug}`. */
  genres: string[];
  status: MangaStatus;
  /** Contador de lecturas. Los visitantes no pueden escribirlo (ver ARCHITECTURE.md, sección 10). */
  views: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  /** Fecha del capítulo publicado más reciente; `null` mientras no haya capítulos. */
  lastChapterAt: Timestamp | null;
  isPublished: boolean;
}

/**
 * `mangas/{slug}/chapters/{chapterId}`. Convención de id: el número con 3 dígitos
 * (`chapterDocId(10.5)` → `010.5`), igual que las carpetas de imágenes.
 */
export interface ChapterDoc {
  /** Puede ser decimal (10.5). */
  number: number;
  title: string | null;
  publishedAt: Timestamp;
  pages: ChapterPageDoc[];
  isPublished: boolean;
}

/** `genres/{slug}`. El id del documento es el slug (mismos ids que `src/data/genres.ts`). */
export interface GenreDoc {
  name: string;
  slug: string;
  description: string | null;
}

/** `siteConfig/main`: configuración general del sitio (lectura pública: nada secreto aquí). */
export interface SiteConfigDoc {
  siteName: string;
  tagline: string;
  language: string;
  /** URL pública base de Cloudflare R2 (se rellena en la fase de R2). */
  contentBaseUrl: string | null;
  updatedAt: Timestamp;
}
