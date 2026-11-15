import { siteConfig } from './config/site';

/**
 * Pantalla provisional de la Fase 1.
 * Solo confirma que la cadena React + TypeScript + Vite funciona.
 * Se reemplazará cuando se desarrollen las páginas reales (Fase 2 en adelante).
 */
export default function App() {
  return (
    <main className="placeholder">
      <h1>{siteConfig.name}</h1>
      <p>{siteConfig.tagline}</p>
      <small>Fase 1 · Fundamentos del proyecto</small>
    </main>
  );
}
