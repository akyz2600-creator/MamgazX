import { createManga } from '../lib/manga';
import type { Chapter, Manga } from '../types/manga';

/**
 * ⚠️ DATOS DE DEMOSTRACIÓN — NO SON OBRAS NI ESTADÍSTICAS REALES.
 *
 * Este es el ÚNICO lugar con datos de mangas (y el único que habrá que sustituir al integrar
 * una fuente real, p. ej. Firestore, en una fase futura). Los componentes solo reciben
 * objetos `Manga`; no saben de dónde vienen.
 *
 * Para publicar el primer manga real:
 *  1. Reemplaza estas entradas por los datos reales (sin `isExample`).
 *  2. Copia las imágenes a `public/content/mangas/{slug}/` (ver `public/content/README.md`).
 */

/** Genera capítulos de demostración, uno por semana, terminando en `lastDate`. */
function demoChapters(slug: string, count: number, lastDate: string): Chapter[] {
  const last = new Date(`${lastDate}T00:00:00Z`).getTime();
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const weeksBack = count - number;
    return {
      id: `${slug}-cap-${number}`,
      number,
      // Algunos con título y otros sin, para probar ambos casos.
      ...(number % 2 === 0 ? { title: 'Capítulo de ejemplo' } : {}),
      publishedAt: new Date(last - weeksBack * 7 * 86_400_000).toISOString().slice(0, 10),
      pages: 0, // sin imágenes todavía
    };
  });
}

const SYNOPSIS =
  'Sinopsis de ejemplo. Aquí aparecerá un resumen breve de la historia cuando se publique el primer manga. ' +
  'Este texto es solo de demostración y se reemplaza junto con el resto de los datos.';

export const mangas: Manga[] = [
  createManga({
    id: 'demo-1',
    slug: 'titulo-de-ejemplo',
    title: 'Título de ejemplo',
    alternativeTitle: 'Example Title',
    synopsis: SYNOPSIS,
    format: 'manga',
    status: 'ongoing',
    genres: ['accion', 'aventura'],
    chapters: demoChapters('titulo-de-ejemplo', 8, '2026-11-13'),
    views: 1240,
    createdAt: '2026-09-01',
    isExample: true,
  }),
  createManga({
    id: 'demo-2',
    slug: 'titulo-de-ejemplo-2',
    title: 'Título de ejemplo 2',
    synopsis: SYNOPSIS,
    format: 'manhwa',
    status: 'completed',
    genres: ['fantasia', 'drama'],
    chapters: demoChapters('titulo-de-ejemplo-2', 12, '2026-08-20'),
    views: 5200,
    createdAt: '2026-03-10',
    isExample: true,
  }),
  createManga({
    id: 'demo-3',
    slug: 'titulo-de-ejemplo-3',
    title: 'Título de ejemplo 3',
    synopsis: SYNOPSIS,
    format: 'manga',
    status: 'ongoing',
    genres: ['misterio', 'terror'],
    chapters: demoChapters('titulo-de-ejemplo-3', 5, '2026-11-09'),
    views: 2310,
    createdAt: '2026-10-05',
    isExample: true,
  }),
  // Sin capítulos: sirve para comprobar los estados vacíos.
  createManga({
    id: 'demo-4',
    slug: 'titulo-de-ejemplo-4',
    title: 'Título de ejemplo 4',
    synopsis: SYNOPSIS,
    format: 'manhwa',
    status: 'ongoing',
    genres: ['comedia', 'romance'],
    chapters: [],
    views: 0,
    createdAt: '2026-11-10',
    isExample: true,
  }),
];

/** Slug del manga que aparece en el banner principal. Si no existe, se usa el más reciente. */
export const featuredSlug: string | undefined = 'titulo-de-ejemplo';
