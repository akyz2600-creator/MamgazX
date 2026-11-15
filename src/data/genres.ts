/**
 * Catálogo de géneros. Es la ÚNICA lista de géneros del proyecto.
 *
 * Cada manga guarda solo los `id` de sus géneros; el nombre visible se obtiene de aquí.
 * Así un género se reutiliza en todos los mangas, se corrige en un solo lugar y,
 * en el futuro, sirve para filtrar el catálogo (`manga.genres.includes(id)`).
 *
 * Para añadir un género, agrégalo a esta lista: `GenreId` se actualiza solo y TypeScript
 * avisará si algún manga usa un id que no existe.
 */
export interface Genre {
  id: string;
  name: string;
}

export const GENRES = [
  { id: 'accion', name: 'Acción' },
  { id: 'aventura', name: 'Aventura' },
  { id: 'fantasia', name: 'Fantasía' },
  { id: 'romance', name: 'Romance' },
  { id: 'drama', name: 'Drama' },
  { id: 'comedia', name: 'Comedia' },
  { id: 'misterio', name: 'Misterio' },
  { id: 'terror', name: 'Terror' },
  { id: 'ciencia-ficcion', name: 'Ciencia ficción' },
] as const satisfies readonly Genre[];

export type GenreId = (typeof GENRES)[number]['id'];
