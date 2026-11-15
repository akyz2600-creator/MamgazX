import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { matchRoute } from './config/routes';
import { featuredSlug, mangas } from './data/mangas';
import { getChapterByNumber } from './lib/manga';
import { CatalogPage } from './pages/CatalogPage';
import { ChapterPage } from './pages/ChapterPage';
import { HomePage } from './pages/HomePage';
import { MangaPage } from './pages/MangaPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouterProvider, useLocation } from './router/router';

/**
 * Estructura general del sitio: encabezado, página según la URL y pie.
 * Los datos se cargan aquí y se pasan hacia abajo por props, de modo que las páginas y
 * los componentes no dependen de dónde vengan (hoy un archivo local; mañana, otra fuente).
 */
function Shell() {
  const { pathname } = useLocation();
  const route = matchRoute(pathname);

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header mangas={mangas} />
      <main id="contenido" tabIndex={-1}>
        {renderPage()}
      </main>
      <Footer />
    </>
  );

  function renderPage() {
    switch (route.name) {
      case 'home':
        return <HomePage mangas={mangas} featuredSlug={featuredSlug} />;
      case 'catalog':
        return <CatalogPage mangas={mangas} />;
      case 'manga': {
        const manga = mangas.find((item) => item.slug === route.slug);
        return manga ? (
          <MangaPage manga={manga} />
        ) : (
          <NotFoundPage title="Manga no encontrado" text="Este manga no existe o ya no está disponible." />
        );
      }
      case 'chapter': {
        const manga = mangas.find((item) => item.slug === route.slug);
        const chapter = manga && getChapterByNumber(manga, route.number);
        return manga && chapter ? (
          <ChapterPage manga={manga} chapter={chapter} />
        ) : (
          <NotFoundPage title="Capítulo no encontrado" text="Este capítulo no existe o ya no está disponible." />
        );
      }
      case 'notFound':
        return <NotFoundPage title="Página no encontrada" text="La dirección que buscas no existe." />;
    }
  }
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
