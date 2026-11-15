import { siteConfig } from '../config/site';
import type { Chapter, Manga, MangaFormat, MangaStatus } from '../types/manga';

/** Utilidades puras sobre los datos de manga. Sin React ni efectos secundarios. */

export const STATUS_LABELS: Record<MangaStatus, string> = {
  ongoing: 'En emisión',
  completed: 'Finalizado',
  hiatus: 'En pausa',
};

export const FORMAT_LABELS: Record<MangaFormat, string> = {
  manga: 'Manga',
  manhwa: 'Manhwa',
};

/** Días durante los que un capítulo nuevo cuenta como "actualización reciente". */
const RECENT_DAYS = 14;
const DAY_MS = 86_400_000;

export function getLatestChapter(manga: Manga): Chapter | undefined {
  return manga.chapters.reduce<Chapter | undefined>(
    (latest, chapter) => (!latest || chapter.number > latest.number ? chapter : latest),
    undefined,
  );
}

/** URL pública de la portada, o `undefined` si el manga aún no tiene portada. */
export function getCoverUrl(manga: Manga): string | undefined {
  return manga.cover ? `${siteConfig.contentBasePath}/${manga.slug}/${manga.cover}` : undefined;
}

export function isRecentlyUpdated(manga: Manga, now: Date = new Date()): boolean {
  const date = getLatestChapter(manga)?.publishedAt;
  if (!date) return false;
  const elapsedDays = (now.getTime() - new Date(`${date}T00:00:00`).getTime()) / DAY_MS;
  return elapsedDays >= 0 && elapsedDays <= RECENT_DAYS;
}

/** Más recientemente actualizados primero. Los que no tienen fecha van al final. */
export function sortByLatestUpdate(mangas: Manga[]): Manga[] {
  const dateOf = (manga: Manga) => getLatestChapter(manga)?.publishedAt ?? '';
  return [...mangas].sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
}

/** Minúsculas y sin acentos, para que "accion" encuentre "Acción". */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

/** Busca por nombre. Todas las palabras escritas deben aparecer en el título. */
export function searchMangas(mangas: Manga[], query: string): Manga[] {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return mangas.filter((manga) => {
    const title = normalizeText(manga.title);
    return words.every((word) => title.includes(word));
  });
}
