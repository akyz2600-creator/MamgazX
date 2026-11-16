/**
 * Nombres y rutas de las colecciones de Firestore. Son cadenas puras (sin importar Firebase)
 * para que ningún otro archivo escriba nombres de colección a mano.
 */
export const COLLECTIONS = {
  mangas: 'mangas',
  chapters: 'chapters',
  genres: 'genres',
  siteConfig: 'siteConfig',
  /** Lista de administradores autorizados (ver `firestore.rules`). */
  admins: 'admins',
} as const;

/** Id del único documento de configuración general: `siteConfig/main`. */
export const SITE_CONFIG_DOC_ID = 'main';

/** `mangas/{slug}` */
export const mangaDocPath = (slug: string): string => `${COLLECTIONS.mangas}/${slug}`;

/** `mangas/{slug}/chapters` */
export const chaptersCollectionPath = (slug: string): string =>
  `${COLLECTIONS.mangas}/${slug}/${COLLECTIONS.chapters}`;

/** Id de capítulo: número con 3 dígitos en la parte entera (`1` → `001`, `10.5` → `010.5`). */
export function chapterDocId(number: number): string {
  const [integer = '0', decimal] = String(number).split('.');
  const padded = integer.padStart(3, '0');
  return decimal ? `${padded}.${decimal}` : padded;
}
