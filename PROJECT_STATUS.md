# Estado del proyecto — MangazX

> Documento breve de seguimiento. El detalle técnico vive en [ARCHITECTURE.md](ARCHITECTURE.md) y [docs/DECISIONS.md](docs/DECISIONS.md); el uso, en [README.md](README.md).

**Fase actual:** 3 — Catálogo (terminada, con datos de demostración). **Siguiente:** 4 — Lector.

## Qué funciona hoy

| Fase | Resultado |
| --- | --- |
| 1 | Estructura, configuración y documentación. |
| 2 | Identidad visual, encabezado, buscador, banner, tarjetas, "Últimos mangas", "Populares", pie. |
| 3 | URL propias, catálogo con orden por recientes/populares, ficha de cada manga, lista de capítulos, géneros, estados, "última actualización" automática, páginas 404, lector **preparado**. |

Rutas: `/`, `/catalogo` (`?orden=populares`), `/manga/{slug}`, `/manga/{slug}/capitulo/{n}`. Detalle en ARCHITECTURE.md, sección 8.

## Fase 3: cambios

- **Archivos nuevos:** `src/router/router.tsx`, `src/config/routes.ts`, `src/data/genres.ts`, `src/lib/format.ts`, `src/hooks/useDocumentTitle.ts`; páginas `CatalogPage`, `MangaPage`, `ChapterPage`, `NotFoundPage` (con su CSS); componentes `Breadcrumb`, `ChapterList`, `MangaGrid`, `SegmentedControl`, `ViewsBadge` (con su CSS); este archivo.
- **Archivos modificados:** `App.tsx`, `HomePage`, `types/manga.ts`, `lib/manga.ts`, `data/mangas.ts`, `config/navigation.ts`, `styles/global.css`, y los componentes `Button`, `Footer`, `Header`, `HeroBanner`, `Logo`, `MangaCard`, `MangaSection`, `SearchBox`, `StatusBadge`, `icons`; README, ARCHITECTURE y DECISIONS.
- **Dependencias agregadas:** ninguna.
- **Configuración:** sin cambios (`package.json`, `tsconfig.json`, `vite.config.ts`, `netlify.toml`).

## Diferencias entre documentación anterior y código (resueltas)

- El modelo de la Fase 2 usaba `description`, `cover`, `pageCount` y el estado "En pausa"; la Fase 3 los reemplaza por `synopsis`, `coverImage`, `pages` y solo dos estados (D-017, D-019).
- D-007/D-011 aplazaban el enrutado; D-016 lo resuelve.

## Pendiente

- **Lector de capítulos:** mostrar las páginas. Hoy `/manga/{slug}/capitulo/{n}` avisa "El lector estará disponible próximamente" y ya tiene navegación anterior/siguiente.
- **Datos reales:** reemplazar los 4 mangas de demostración en `src/data/mangas.ts` y añadir las imágenes (ver `public/content/README.md`).
- **Estadísticas reales de lecturas:** hoy son cifras de demostración marcadas como tales.
- **Filtro por género:** el modelo está listo (`genres.ts`); no hay interfaz de filtrado.
- **Páginas legales y de contacto:** marcadas "Próximamente" en el pie.
- **Panel de administración y subida de imágenes:** fases posteriores.
- **Publicación en Netlify.**

## Decisión abierta

- **Firebase/Firestore:** la Fase 1 lo prohíbe y la Fase 3 sugiere una futura integración con Firestore. No se integró nada; hay que decidir antes del panel de administración (D-021).

## Problemas conocidos

- **Compilación con Vite sin verificar en el entorno de desarrollo de esta fase** (no permitía instalar paquetes). Se verificó con esbuild y Chromium, y los tipos con `tsc` estricto usando definiciones mínimas de React. Debe confirmarse con `npm install && npm run build`.
- El idioma de las cifras sigue el español genérico (`es`): 1240 se escribe sin punto; desde 5 cifras usa punto (12.400).
- Las portadas son marcadores generados: no hay imágenes reales.

## Próxima fase recomendada

**Fase 4 — Lector:** páginas del capítulo (imágenes por convención `{slug}/chapters/{n}/{página}.webp`), modo lectura cómodo en móvil, y reemplazar los datos de demostración por el primer manga real. Antes, decidir lo de Firebase si se quiere persistir lecturas.

## Cómo verificar

```bash
npm install
npm run build   # tipos + compilación
npm run dev     # abrir /, /catalogo, /manga/titulo-de-ejemplo
```
