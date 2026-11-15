import { siteConfig } from '../config/site';
import { GENRES } from '../data/genres';
import type { Chapter, Manga, MangaFormat, MangaStatus } from '../types/manga';
import { parseDate } from './format';

/** Utilidades puras sobre los datos de manga. Sin React ni efectos secundarios. */

export const STATUS_LABELS: Record<MangaStatus, string> = {
  ongoing: 'En publicación',
  completed: 'Finalizado',
};

export const FORMAT_LABELS: Record<MangaFormat, string> = {
  manga: 'Manga',
  manhwa: 'Manhwa',
};

/** Días durante los que algo nuevo cuenta como "reciente". */
const RECENT_DAYS = 14;
const DAY_MS = 86_400_000;

/* ---------- Creación ---------- */

export type MangaInput = Omit<Manga, 'lastChapterAt' | 'updatedAt'> & { updatedAt?: string };

/**
 * Crea un `Manga` calculando las fechas que dependen de los capítulos.
 * `lastChapterAt` siempre se deriva de `chapters`, por lo que se actualiza solo al añadir un capítulo.
 */
export function createManga(input: MangaInput): Manga {
  const lastChapterAt = input.chapters.reduce<string | null>(
    (latest, chapter) => (latest === null || chapter.publishedAt > latest ? chapter.publishedAt : latest),
    null,
  );
  // La ficha nunca puede estar "actualizada" antes que su último capítulo: se toma la fecha más reciente.
  const updatedAt = [input.updatedAt, lastChapterAt, input.createdAt].reduce<string>(
    (latest, date) => (date && date > latest ? date : latest),
    input.createdAt,
  );
  return { ...input, lastChapterAt, updatedAt };
}

/* ---------- Capítulos ---------- */

function chaptersAscending(manga: Manga): Chapter[] {
  return [...manga.chapters].sort((a, b) => a.number - b.number);
}

/** Capítulos del más nuevo al más antiguo. */
export function getChaptersNewestFirst(manga: Manga): Chapter[] {
  return chaptersAscending(manga).reverse();
}

export function getFirstChapter(manga: Manga): Chapter | undefined {
  return chaptersAscending(manga)[0];
}

export function getLatestChapter(manga: Manga): Chapter | undefined {
  return chaptersAscending(manga).at(-1);
}

export function getChapterByNumber(manga: Manga, number: number): Chapter | undefined {
  return manga.chapters.find((chapter) => chapter.number === number);
}

/** Capítulo anterior y siguiente (por número), para la navegación del lector. */
export function getAdjacentChapters(
  manga: Manga,
  number: number,
): { previous: Chapter | undefined; next: Chapter | undefined } {
  const ordered = chaptersAscending(manga);
  const index = ordered.findIndex((chapter) => chapter.number === number);
  if (index === -1) return { previous: undefined, next: undefined };
  return { previous: ordered[index - 1], next: ordered[index + 1] };
}

/* ---------- Fechas ---------- */

/**
 * ¿La fecha cae dentro de los últimos RECENT_DAYS días? Se cuentan días de calendario
 * (no horas), así el resultado no cambia según la hora del día ni por el cambio de horario.
 */
export function isRecentDate(iso: string | null | undefined, now: Date = new Date()): boolean {
  if (!iso) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsedDays = Math.round((today.getTime() - parseDate(iso).getTime()) / DAY_MS);
  return elapsedDays >= 0 && elapsedDays <= RECENT_DAYS;
}

export function isRecentlyUpdated(manga: Manga, now: Date = new Date()): boolean {
  return isRecentDate(manga.lastChapterAt, now);
}

/* ---------- Presentación ---------- */

/** URL pública de la portada, o `undefined` si el manga aún no tiene portada. */
export function getCoverUrl(manga: Manga): string | undefined {
  return manga.coverImage ? `${siteConfig.contentBasePath}/${manga.slug}/${manga.coverImage}` : undefined;
}

/** Nombres visibles de los géneros de un manga, en el orden en que se declararon. */
export function getGenreNames(manga: Manga): string[] {
  return manga.genres.flatMap((id) => GENRES.find((genre) => genre.id === id)?.name ?? []);
}

/* ---------- Orden ---------- */

export type SortOrder = 'recent' | 'popular';

export const SORT_LABELS: Record<SortOrder, string> = {
  recent: 'Más recientes',
  popular: 'Más populares',
};

/** Fecha por la que se ordena "más recientes": último capítulo o, si no hay, alta del manga. */
function recencyKey(manga: Manga): string {
  return manga.lastChapterAt ?? manga.createdAt;
}

/** Devuelve una copia ordenada. En empate de lecturas gana el más reciente. */
export function sortMangas(mangas: Manga[], order: SortOrder): Manga[] {
  const byRecent = (a: Manga, b: Manga) => recencyKey(b).localeCompare(recencyKey(a));
  return [...mangas].sort(order === 'popular' ? (a, b) => b.views - a.views || byRecent(a, b) : byRecent);
}

/** Mangas con lecturas registradas, de más a menos leídos. Sin lecturas no hay "populares". */
export function getPopularMangas(mangas: Manga[], limit?: number): Manga[] {
  const popular = sortMangas(
    mangas.filter((manga) => manga.views > 0),
    'popular',
  );
  return limit === undefined ? popular : popular.slice(0, limit);
}

/* ---------- Búsqueda ---------- */

/** Minúsculas y sin acentos, para que "accion" encuentre "Acción". */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

/** Busca por nombre (título y título alternativo). Todas las palabras escritas deben aparecer. */
export function searchMangas(mangas: Manga[], query: string): Manga[] {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return mangas.filter((manga) => {
    const names = normalizeText(`${manga.title} ${manga.alternativeTitle ?? ''}`);
    return words.every((word) => names.includes(word));
  });
}
