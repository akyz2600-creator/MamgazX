import { HeroBanner } from '../components/HeroBanner';
import { MangaSection } from '../components/MangaSection';
import { sortByLatestUpdate } from '../lib/manga';
import type { Manga } from '../types/manga';
import styles from './HomePage.module.css';

interface HomePageProps {
  mangas: Manga[];
  featuredSlug: string | undefined;
  popularSlugs: string[];
}

/** Página de inicio: banner destacado + "Últimos mangas" + "Populares". */
export function HomePage({ mangas, featuredSlug, popularSlugs }: HomePageProps) {
  const latest = sortByLatestUpdate(mangas);
  const featured = mangas.find((manga) => manga.slug === featuredSlug) ?? latest[0];
  const popular = popularSlugs
    .map((slug) => mangas.find((manga) => manga.slug === slug))
    .filter((manga): manga is Manga => manga !== undefined);

  return (
    <>
      <HeroBanner manga={featured} />

      <div id="catalogo" className={`container ${styles.sections}`}>
        <MangaSection
          id="ultimos-mangas"
          title="Últimos mangas"
          description="Lo más reciente publicado en MangazX."
          mangas={latest}
          empty={{
            title: 'Aún no hay mangas publicados',
            text: 'Estamos preparando el primer título. Vuelve pronto.',
          }}
        />

        <MangaSection
          id="populares"
          title="Populares"
          mangas={popular}
          empty={{
            title: 'Próximamente más títulos',
            text: 'Cuando haya más mangas y lectores, aquí aparecerán los más leídos.',
            ghosts: true,
          }}
        />
      </div>
    </>
  );
}
