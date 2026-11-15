export interface NavItem {
  label: string;
  href: string;
}

/**
 * Navegación principal.
 * Provisional: mientras no existan las páginas de catálogo y capítulos, los enlaces
 * llevan a secciones de la página de inicio (anclas). Pasarán a rutas reales más adelante.
 */
export const primaryNav: readonly NavItem[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Últimos capítulos', href: '#ultimos-mangas' },
];
