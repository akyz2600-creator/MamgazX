/**
 * Rutas de la aplicación: constructores de URL y reconocimiento de la URL actual.
 * Es el único lugar que conoce la forma de las URL; el resto del código usa `routes`.
 *
 *   /                                       Inicio
 *   /catalogo                               Catálogo (?orden=populares)
 *   /manga/{slug}                           Ficha del manga
 *   /manga/{slug}/capitulo/{número}         Lector (preparado, aún sin imágenes)
 */

const encode = encodeURIComponent;

export const routes = {
  home: '/',
  catalog: '/catalogo',
  catalogByPopularity: '/catalogo?orden=populares',
  latest: '/#ultimos-mangas',
  manga: (slug: string) => `/manga/${encode(slug)}`,
  chapter: (slug: string, number: number) => `/manga/${encode(slug)}/capitulo/${number}`,
} as const;

export type Route =
  | { name: 'home' }
  | { name: 'catalog' }
  | { name: 'manga'; slug: string }
  | { name: 'chapter'; slug: string; number: number }
  | { name: 'notFound' };

function safeDecode(part: string): string {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

/** Reconoce una ruta a partir del `pathname`. Tolera la barra final. */
export function matchRoute(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean).map(safeDecode);
  const [first, slug, third, fourth] = parts;

  if (parts.length === 0) return { name: 'home' };
  if (parts.length === 1 && first === 'catalogo') return { name: 'catalog' };
  if (parts.length === 2 && first === 'manga' && slug) return { name: 'manga', slug };
  if (parts.length === 4 && first === 'manga' && slug && third === 'capitulo' && fourth) {
    const number = Number(fourth);
    if (Number.isFinite(number)) return { name: 'chapter', slug, number };
  }
  return { name: 'notFound' };
}
