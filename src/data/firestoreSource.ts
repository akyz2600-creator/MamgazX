import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import type { QueryConstraint, QueryDocumentSnapshot } from 'firebase/firestore';
import { getDb } from '../firebase/client';
import { chaptersCollectionPath, COLLECTIONS } from '../firebase/collections';
import type { ChapterDoc, GenreDoc, MangaDoc } from '../firebase/types';
import type { Chapter, Manga } from '../types/manga';
import { GENRES, type GenreId } from './genres';

/**
 * Lectura de datos REALES desde Firestore (Fase 4B). Solo lectura.
 *
 * - Todas las consultas incluyen `where('isPublished', '==', true)`: las reglas
 *   (`firestore.rules`) rechazan cualquier consulta de visitantes que no lo haga.
 * - Los índices usados están en `firestore.indexes.json` y deben estar publicados.
 * - Convierte los documentos de almacenamiento (`MangaDoc`, `ChapterDoc`, con `Timestamp`)
 *   a los tipos de interfaz (`Manga`, `Chapter`, con fechas ISO). Los componentes no cambian.
 * - Los datos de demostración viven aparte en `src/data/mangas.ts`; este archivo nunca los usa.
 */

/** Tope de mangas por consulta de listado (limita las lecturas; sube si el catálogo crece). */
const MAX_LISTED = 200;

export type MangaOrder = 'recent' | 'popular';

/* ---------- Conversión ---------- */

const KNOWN_GENRES = new Set<string>(GENRES.map((genre) => genre.id));

function isGenreId(id: string): id is GenreId {
  return KNOWN_GENRES.has(id);
}

/** `Timestamp` → `AAAA-MM-DD` (fecha local, como en el resto de la interfaz). */
function toIsoDate(value: { toDate(): Date }): string {
  const date = value.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function hasTimestamp(value: unknown): value is { toDate(): Date } {
  return typeof value === 'object' && value !== null && typeof (value as { toDate?: unknown }).toDate === 'function';
}

/** Devuelve `null` (y avisa en consola) si el documento no tiene la forma esperada. */
function toManga(snapshot: QueryDocumentSnapshot, chapters: Chapter[]): Manga | null {
  const data = snapshot.data() as MangaDoc;
  if (!hasTimestamp(data.createdAt) || !hasTimestamp(data.updatedAt) || !data.title || !data.slug) {
    console.warn(`[MangazX] Se omite mangas/${snapshot.id}: faltan campos obligatorios.`);
    return null;
  }
  return {
    id: snapshot.id,
    slug: data.slug,
    title: data.title,
    ...(data.alternativeTitle ? { alternativeTitle: data.alternativeTitle } : {}),
    synopsis: data.synopsis ?? '',
    format: data.format,
    status: data.status,
    genres: (data.genres ?? []).filter(isGenreId),
    ...(data.coverImage?.url ? { coverImage: data.coverImage.url } : {}),
    chapters,
    views: data.views ?? 0,
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
    lastChapterAt: hasTimestamp(data.lastChapterAt) ? toIsoDate(data.lastChapterAt) : null,
  };
}

function toChapter(snapshot: QueryDocumentSnapshot): Chapter | null {
  const data = snapshot.data() as ChapterDoc;
  if (typeof data.number !== 'number' || !hasTimestamp(data.publishedAt)) {
    console.warn(`[MangazX] Se omite un capítulo (${snapshot.ref.path}): faltan campos obligatorios.`);
    return null;
  }
  return {
    id: snapshot.id,
    number: data.number,
    ...(data.title ? { title: data.title } : {}),
    publishedAt: toIsoDate(data.publishedAt),
    pages: data.pages?.length ?? 0,
  };
}

/* ---------- Capítulos ---------- */

async function queryChapters(slug: string, ...extra: QueryConstraint[]): Promise<Chapter[]> {
  const snapshot = await getDocs(
    query(
      collection(getDb(), chaptersCollectionPath(slug)),
      where('isPublished', '==', true),
      orderBy('number', 'desc'),
      ...extra,
    ),
  );
  return snapshot.docs.flatMap((doc) => toChapter(doc) ?? []);
}

/** Capítulos publicados de un manga, del más nuevo al más antiguo. */
export function getPublishedChapters(slug: string): Promise<Chapter[]> {
  return queryChapters(slug);
}

/* ---------- Mangas ---------- */

/**
 * Mangas publicados, por "recientes" (último capítulo) o "populares" (lecturas).
 * Cada manga lleva solo su capítulo más reciente en `chapters` (suficiente para tarjetas,
 * buscador y banner: 1 lectura extra por manga). La lista completa se pide con `getMangaBySlug`.
 */
export async function listPublishedMangas(order: MangaOrder = 'recent', max: number = MAX_LISTED): Promise<Manga[]> {
  const sorting =
    order === 'popular'
      ? [orderBy('views', 'desc'), orderBy('lastChapterAt', 'desc')]
      : [orderBy('lastChapterAt', 'desc')];
  const snapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.mangas), where('isPublished', '==', true), ...sorting, limit(max)),
  );
  const mangas = await Promise.all(
    snapshot.docs.map(async (doc) => toManga(doc, await queryChapters(doc.id, limit(1)))),
  );
  return mangas.flatMap((manga) => manga ?? []);
}

/**
 * Un manga publicado con TODOS sus capítulos publicados, o `null` si no existe o no está publicado.
 * Se busca con una consulta (no con `getDoc`): para un visitante, un documento inexistente o
 * no publicado provocaría un error de permisos en lugar de un resultado vacío.
 */
export async function getMangaBySlug(slug: string): Promise<Manga | null> {
  const snapshot = await getDocs(
    query(
      collection(getDb(), COLLECTIONS.mangas),
      where('slug', '==', slug),
      where('isPublished', '==', true),
      limit(1),
    ),
  );
  const doc = snapshot.docs[0];
  return doc ? toManga(doc, await getPublishedChapters(doc.id)) : null;
}

/* ---------- Géneros ---------- */

/** Catálogo de géneros guardado en Firestore, ordenado por nombre. */
export async function listGenres(): Promise<GenreDoc[]> {
  const snapshot = await getDocs(collection(getDb(), COLLECTIONS.genres));
  return snapshot.docs
    .map((doc) => doc.data() as GenreDoc)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
