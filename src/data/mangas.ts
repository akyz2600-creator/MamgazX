import type { Manga } from '../types/manga';

/**
 * ⚠️ DATOS DE EJEMPLO — NO SON UNA OBRA REAL.
 *
 * Este es el ÚNICO lugar con datos de mangas. Para publicar el primer manga:
 *  1. Reemplaza el objeto de ejemplo por los datos reales (quita `isExample`).
 *  2. Copia las imágenes a `public/content/mangas/{slug}/` (ver `public/content/README.md`).
 * Ningún componente necesita cambios.
 */
export const mangas: Manga[] = [
  {
    slug: 'titulo-de-ejemplo',
    title: 'Título de ejemplo',
    description:
      'Sinopsis de ejemplo. Aquí aparecerá un resumen breve de la historia cuando se publique el primer manga.',
    format: 'manga',
    status: 'ongoing',
    genres: ['Acción', 'Aventura'],
    chapters: [
      { number: 1, title: 'Capítulo de ejemplo', pageCount: 0, publishedAt: '2026-11-01' },
      { number: 2, title: 'Capítulo de ejemplo', pageCount: 0, publishedAt: '2026-11-08' },
      { number: 3, title: 'Capítulo de ejemplo', pageCount: 0, publishedAt: '2026-11-13' },
    ],
    isExample: true,
  },
];

/** Slug del manga que aparece en el banner principal. Si no existe, se usa el más reciente. */
export const featuredSlug: string | undefined = 'titulo-de-ejemplo';

/**
 * Slugs de los mangas populares, en orden.
 * Se deja vacío a propósito: todavía no hay estadísticas reales y no se inventan rankings.
 */
export const popularSlugs: string[] = [];
