import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { matchRoute } from './config/routes';
import { featuredSlug, useCatalog, useMangaDetail } from './hooks/useCatalog';
import { getChapterByNumber } from './lib/manga';
import { CatalogPage } from './pages/CatalogPage';
import { ChapterPage } from './pages/ChapterPage';
import { HomePage } from './pages/HomePage';
import { MangaPage } from './pages/MangaPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouterProvider, useLocation } from './router/router';

/**
 * Estructura general del sitio: encabezado, página según la URL y pie.
 * Los datos se cargan aquí (demostración o Firestore, ver `hooks/useCatalog.ts`) y se pasan
 * hacia abajo por props, de modo que las páginas y los componentes no dependen de dónde vengan.
 */
function Shell() {
  const { pathname } = useLocation();
  const route = matchRoute(pathname);
  const catalog = useCatalog();
  const detail = useMangaDetail(route.name === 'manga' || route.name === 'chapter' ? route.slug : undefined);
  const mangas = catalog.status === 'ready' ? catalog.data : [];

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
        return catalog.status === 'ready' ? (
          <HomePage mangas={catalog.data} featuredSlug={featuredSlug} />
        ) : (
          <Status state={catalog} />
        );
      case 'catalog':
        return catalog.status === 'ready' ? <CatalogPage mangas={catalog.data} /> : <Status state={catalog} />;
      case 'manga': {
        if (detail.status !== 'ready') return <Status state={detail} />;
        const manga = detail.data;
        return manga ? (
          <MangaPage manga={manga} />
        ) : (
          <NotFoundPage title="Manga no encontrado" text="Este manga no existe o ya no está disponible." />
        );
      }
      case 'chapter': {
        if (detail.status !== 'ready') return <Status state={detail} />;
        const manga = detail.data;
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

/** Mensaje de carga o de error mientras los datos no están listos. */
function Status({ state }: { state: { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready' } }) {
  return (
    <div className="container">
      {state.status === 'error' ? (
        <EmptyState title="No se pudieron cargar los datos" text={state.message} />
      ) : (
        <EmptyState title="Cargando…" text="Estamos preparando el contenido." />
      )}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
