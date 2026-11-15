import { routes } from './routes';

export interface NavItem {
  label: string;
  href: string;
  /** Indica en qué rutas el enlace se marca como activo. Si falta, nunca se marca. */
  isActive?: (pathname: string) => boolean;
}

/** Navegación principal (encabezado y pie de página). */
export const primaryNav: readonly NavItem[] = [
  { label: 'Inicio', href: routes.home, isActive: (pathname) => pathname === '/' },
  {
    label: 'Catálogo',
    href: routes.catalog,
    isActive: (pathname) => pathname.startsWith('/catalogo') || pathname.startsWith('/manga'),
  },
  // Lleva a la sección "Últimos mangas" del inicio; no es una página aparte.
  { label: 'Últimos capítulos', href: routes.latest },
];
