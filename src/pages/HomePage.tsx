import { HeroBanner } from '../components/HeroBanner';
import { MangaSection } from '../components/MangaSection';
import { routes } from '../config/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getPopularMangas, sortMangas } from '../lib/manga';
import type { Manga } from '../types/manga';
import styles from './HomePage.module.css';

interface HomePageProps {
  mangas: Manga[];
  featuredSlug: string | undefined;
}

/** Cuántas tarjetas muestra cada sección del inicio (el catálogo muestra todas). */
const HOME_LIMIT = 6;

/** Página de inicio: banner destacado + "Últimos mangas" + "Populares". */
export function HomePage({ mangas, featuredSlug }: HomePageProps) {
  useDocumentTitle();
  const latest = sortMangas(mangas, 'recent');
  const featured = mangas.find((manga) => manga.slug === featuredSlug) ?? latest[0];
  const popular = getPopularMangas(mangas, HOME_LIMIT);
  const popularIsDemo = popular.some((manga) => manga.isExample);

  return (
    <>
      <HeroBanner manga={featured} />

      <div className={`container ${styles.sections}`}>
        <MangaSection
          id="ultimos-mangas"
          title="Últimos mangas"
          description="Lo más reciente publicado en MangazX."
          mangas={latest.slice(0, HOME_LIMIT)}
          action={{ label: 'Ver catálogo', to: routes.catalog }}
          empty={{
            title: 'Aún no hay mangas publicados',
            text: 'Estamos preparando el primer título. Vuelve pronto.',
          }}
        />

        <MangaSection
          id="populares"
          title="Populares"
          {...(popularIsDemo ? { description: 'Las lecturas son datos de demostración, no estadísticas reales.' } : {})}
          mangas={popular}
          showViews
          {...(popular.length > 0 ? { action: { label: 'Ver más', to: routes.catalogByPopularity } } : {})}
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
