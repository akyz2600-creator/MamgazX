import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { featuredSlug, mangas, popularSlugs } from './data/mangas';
import { HomePage } from './pages/HomePage';

/**
 * Estructura general del sitio. Los datos se cargan aquí y se pasan hacia abajo,
 * de modo que los componentes no dependen de dónde vengan.
 * Por ahora solo existe la página de inicio; el enrutado se decidirá con la página de detalles.
 */
export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header mangas={mangas} />
      <main id="contenido">
        <HomePage mangas={mangas} featuredSlug={featuredSlug} popularSlugs={popularSlugs} />
      </main>
      <Footer />
    </>
  );
}
