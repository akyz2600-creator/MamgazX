import { useEffect, useState } from 'react';
import { featuredSlug as demoFeaturedSlug, mangas as demoMangas } from '../data/mangas';
import { getMangaBySlug, listPublishedMangas } from '../data/firestoreSource';
import { isFirebaseConfigured } from '../firebase/client';
import type { Manga } from '../types/manga';

/**
 * Elige la fuente de datos y la entrega a la interfaz con su estado de carga.
 *
 * - `demo`: datos de ejemplo de `src/data/mangas.ts`. Se usan si Firebase no está configurado
 *   o si `VITE_USE_DEMO_DATA=true`. No hay espera.
 * - `firestore`: datos reales. Si falla o la colección está vacía NO se mezclan con los de
 *   demostración: se muestra el error o el estado vacío.
 */

export type Loadable<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

export const dataSource: 'demo' | 'firestore' =
  import.meta.env.VITE_USE_DEMO_DATA === 'true' || !isFirebaseConfigured ? 'demo' : 'firestore';

const usingDemo = dataSource === 'demo';

/** Destacado del banner: solo existe en demostración; con datos reales se usa el más reciente. */
export const featuredSlug: string | undefined = usingDemo ? demoFeaturedSlug : undefined;

const ERROR_MESSAGE = 'No pudimos cargar los mangas. Revisa tu conexión y recarga la página.';

function fail(error: unknown): { status: 'error'; message: string } {
  console.error('[MangazX] Error al leer Firestore:', error);
  return { status: 'error', message: ERROR_MESSAGE };
}

/** Mangas publicados para inicio, catálogo y buscador. Se carga una sola vez. */
export function useCatalog(): Loadable<Manga[]> {
  const [state, setState] = useState<Loadable<Manga[]>>(
    usingDemo ? { status: 'ready', data: demoMangas } : { status: 'loading' },
  );

  useEffect(() => {
    if (usingDemo) return;
    let cancelled = false;
    listPublishedMangas()
      .then((data) => !cancelled && setState({ status: 'ready', data }))
      .catch((error: unknown) => !cancelled && setState(fail(error)));
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Un manga con todos sus capítulos (ficha y lector). `data` es `null` si no existe. */
export function useMangaDetail(slug: string | undefined): Loadable<Manga | null> {
  const [loaded, setLoaded] = useState<{ slug: string; result: Loadable<Manga | null> } | null>(null);

  useEffect(() => {
    if (usingDemo || !slug) return;
    let cancelled = false;
    getMangaBySlug(slug)
      .then((data) => !cancelled && setLoaded({ slug, result: { status: 'ready', data } }))
      .catch((error: unknown) => !cancelled && setLoaded({ slug, result: fail(error) }));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) return { status: 'ready', data: null };
  if (usingDemo) return { status: 'ready', data: demoMangas.find((manga) => manga.slug === slug) ?? null };
  return loaded?.slug === slug ? loaded.result : { status: 'loading' };
}
