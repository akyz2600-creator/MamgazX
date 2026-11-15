/** Configuración global del sitio. Un único lugar para valores compartidos. */
export const siteConfig = {
  name: 'MangazX',
  tagline: 'Lee manga y manhwa en español, gratis y sin registrarte.',
  language: 'es',
  /**
   * Ruta pública base donde viven las imágenes de los mangas.
   * Corresponde a la carpeta `public/content/mangas/`.
   * Estructura: {contentBasePath}/{slug}/chapters/{capítulo}/{página}.webp
   */
  contentBasePath: '/content/mangas',
} as const;
