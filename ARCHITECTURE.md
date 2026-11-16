# Arquitectura de MangazX

Este documento explica cómo está organizado el proyecto y cómo debe crecer. Está pensado para que cualquier persona (o IA) pueda añadir funciones sin romper la estructura.

> Estado: **Fase 4A**. Hay inicio, catálogo, fichas y lista de capítulos con datos de demostración, y la infraestructura de Firebase está preparada (sección 10) pero aún no conectada a la interfaz. El lector de imágenes y el panel de administración aún no existen.

## 1. Principios

1. **Catálogo, no un solo manga.** El código nunca menciona un manga concreto. Un manga es un dato (`Manga`), no una parte del código.
2. **Datos separados de la interfaz.** Los componentes reciben datos; no los definen.
3. **Sitio estático con datos en Firestore.** No hay servidor propio. Hoy todo se sirve como archivos; desde la Fase 4 el catálogo vivirá en Firestore y las imágenes en Cloudflare R2, con publicación en Cloudflare Pages (D-023). Los lectores nunca necesitan cuenta.
4. **Simplicidad primero.** Se añade una dependencia o una capa de abstracción solo cuando hay una necesidad real, no una posible.

## 2. Organización del proyecto

```text
mangazx/
├── docs/                 Documentación técnica adicional
├── public/               Archivos que se publican tal cual
│   └── content/mangas/   Imágenes de mangas y capítulos
├── src/
│   ├── assets/           Recursos que importa el código
│   ├── components/       Componentes reutilizables
│   ├── config/           Configuración global
│   ├── data/             Datos del catálogo
│   ├── firebase/         Firebase: inicialización, tipos de documentos, colecciones
│   ├── hooks/            Hooks de React reutilizables
│   ├── lib/              Funciones puras sobre los datos
│   ├── pages/            Páginas (una por ruta)
│   ├── router/           Enrutador mínimo propio
│   ├── styles/           Estilos globales y tokens
│   ├── types/            Tipos de TypeScript del dominio
│   ├── App.tsx           Componente raíz
│   └── main.tsx          Punto de entrada
├── .env.example          Plantilla de variables de entorno (Firebase)
├── firebase.json         Rutas de reglas e índices de Firestore
├── firestore.rules       Reglas de seguridad de Firestore
├── firestore.indexes.json  Índices de Firestore
├── index.html            HTML base de Vite
├── netlify.toml          Configuración antigua de publicación (sin uso, ver D-023)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 3. Responsabilidades de cada carpeta

| Carpeta | Responsabilidad | Qué NO debe contener |
| --- | --- | --- |
| `src/components/` | Piezas de interfaz reutilizables y sin lógica de rutas (botones, tarjetas, barras). | Datos de mangas; llamadas de carga de datos propias. |
| `src/firebase/` | Único lugar que inicializa Firebase (`client.ts`), tipos de los documentos de Firestore (`types.ts`) y nombres de colecciones (`collections.ts`). | Componentes, JSX o estado de React. Las imágenes no van a Firebase (van a R2). |
| `src/hooks/` | Hooks de React reutilizables y sin datos propios (`useDocumentTitle`). | Lógica específica de una sola página. |
| `src/router/` | Enrutador (History API), `Link`, `useLocation`, `useNavigate`. Único lugar que toca `window.history`. | Conocimiento de las páginas o de los datos. |
| `src/lib/` | Funciones puras y testeables sobre los datos (`searchMangas`, `getLatestChapter`, `getCoverUrl`…). | JSX, estado de React o acceso a datos globales. |
| `src/pages/` | Una página por ruta. Une datos y componentes. | Estilos o piezas que se reutilicen en más de una página (van a `components/`). |
| `src/data/` | Datos del catálogo: `mangas.ts` (hoy de demostración) y `genres.ts` (catálogo de géneros). | Componentes o lógica de interfaz. |
| `src/types/` | Tipos e interfaces del dominio (`Manga`, `Chapter`). Sin dependencias de React. | Valores o funciones con efectos. |
| `src/config/` | Valores globales compartidos: `siteConfig`, `routes` (forma de las URL) y `navigation`. | Datos de mangas concretos. |
| `src/styles/` | `tokens.css` (variables de diseño) y `global.css` (reset y base). | Reglas específicas de un componente: van en su `Componente.module.css` (ver D-010). |
| `src/assets/` | Recursos que importa el código y que Vite procesa (logo, íconos). | Imágenes de capítulos. |
| `public/` | Archivos estáticos que se copian sin procesar (favicon, imágenes de contenido). | Código fuente. |
| `docs/` | Decisiones técnicas y guías. | Documentación duplicada del README. |

## 4. Mangas, capítulos e imágenes

### 4.1 Estructura de imágenes

Las imágenes viven en `public/content/mangas/`, organizadas por manga, capítulo y número de página:

```text
public/content/mangas/
└── {slug}/                    identificador único del manga
    ├── cover.webp             portada
    └── chapters/
        ├── 001/               capítulo (3 dígitos)
        │   ├── 001.webp       página (3 dígitos)
        │   ├── 002.webp
        │   └── ...
        └── 002/
```

URL final de una página: `/content/mangas/{slug}/chapters/{capítulo}/{página}.webp`.

### 4.2 Modelo de datos

Definido en `src/types/manga.ts`:

- `Manga`: `id`, `slug`, `title`, `alternativeTitle?`, `synopsis`, `format` (`manga` | `manhwa`), `status` (`ongoing` | `completed`), `genres` (ids), `coverImage?`, `chapters`, `views`, `createdAt`, `updatedAt`, `lastChapterAt`, y `isExample?` (marca los datos de demostración).
- `Chapter`: `id`, `number`, `title?`, `publishedAt`, `pages` (cantidad de páginas).
- Géneros: `src/data/genres.ts` es la única lista. Cada manga guarda solo los `id`; `GenreId` se deriva de esa lista, así que un género inexistente no compila. Sirve para mostrar varios géneros por manga y, en el futuro, para filtrar (`manga.genres.includes(id)`).

**Fechas derivadas.** `lastChapterAt` y `updatedAt` no se escriben a mano: `createManga()` (`src/lib/manga.ts`) los calcula a partir de `chapters`. Al añadir un capítulo, la "última actualización" se corrige sola. `updatedAt` nunca es anterior al último capítulo.

**Lecturas.** `views` es el contador de lecturas. Hoy contiene cifras de demostración (marcadas en la interfaz). "Populares" solo considera mangas con `views > 0`. Cuando exista un sistema real de estadísticas, solo cambia el origen de este número.

Las rutas de las imágenes **no se guardan** en los datos: se calculan a partir de `slug`, `chapter.number`, el número de página y `siteConfig.contentBasePath`. Así no hay que listar ~20 capítulos × decenas de páginas a mano, y mover las imágenes solo exige cambiar `contentBasePath`.

### 4.3 Cómo se añadirá un manga nuevo

1. Elegir un `slug` (minúsculas, números y guiones) que no cambiará.
2. Crear `public/content/mangas/{slug}/` con la portada y los capítulos siguiendo la convención.
3. Añadir un objeto `Manga` al catálogo en `src/data/`.
4. No se modifica ningún componente ni página.

Si un cambio de código es necesario para añadir un manga, la arquitectura está fallando y hay que corregirla.

### 4.4 Escala y límites

Con un manga de ~20 capítulos, un catálogo en archivos TypeScript sería suficiente. Se decidió pasar a Firestore (D-023) para poder editar el catálogo sin tocar el repositorio cuando exista el panel de administración. Hasta la Fase 4B la interfaz sigue usando los datos de demostración de `src/data/`.

## 5. Criterios para incorporar nuevos módulos

Antes de añadir una función, carpeta o dependencia, responder:

1. **¿Pertenece a la fase actual?** Si no, no se hace sin autorización.
2. **¿Resuelve un problema que existe hoy?** Si es "por si acaso", no se hace.
3. **¿Existe ya una carpeta responsable?** Usarla antes de crear otra.
4. **¿Depende de un manga concreto?** Si sí, es un dato y va en `src/data/`, no en el código.
5. **¿Es gratuito y compatible con las restricciones?** Solo Firestore, Cloudflare R2 y Cloudflare Pages (D-023); sin Supabase, Firebase Storage ni servicios de pago.
6. **¿Hay una solución con React, TypeScript, Vite o la plataforma web?** Preferirla a una librería nueva.
7. **¿Se documentó?** Las decisiones relevantes se anotan en `docs/DECISIONS.md`.

Cuando un módulo crezca y necesite varios archivos propios, se puede agrupar en una subcarpeta dentro de la carpeta correspondiente (por ejemplo, `components/reader/`). No se crea una carpeta nueva en la raíz de `src/` sin documentarlo.

## 6. Reglas para evitar complejidad innecesaria

- **TypeScript estricto.** Sin `any`; si es inevitable, con un comentario que lo justifique.
- **Sin abstracciones prematuras.** Se extrae código común cuando se repite por tercera vez, no antes.
- **Sin duplicación.** Un valor compartido tiene un único lugar (`config/` o `styles/tokens.css`).
- **Componentes pequeños y con una sola responsabilidad.**
- **Estado local por defecto.** No se añade una librería de estado global mientras `useState` y las props basten.
- **Sin dependencias sin justificación.** Cada una se anota en `docs/DECISIONS.md` con su motivo.
- **Nombres claros**, en inglés para el código y en español para los textos visibles al lector.
- **Nada de lógica de negocio en `main.tsx` ni en `App.tsx`** más allá de montar la aplicación.
- **Antes de entregar:** `npm run build` debe pasar sin errores ni advertencias de tipos.

## 7. Evolución prevista

| Fase | Impacto en la arquitectura |
| --- | --- |
| 2. Diseño e inicio ✅ | Tokens, componentes base, `HomePage`, buscador local. |
| 3. Catálogo ✅ | Enrutador propio, `CatalogPage`, `MangaPage`, `ChapterPage` (lector preparado), géneros, orden por recientes/populares, modelo de datos ampliado. |
| 4A. Firebase ✅ | `src/firebase/`, variables de entorno, estructura de Firestore, reglas e índices. La interfaz no cambia. |
| 4B. Lectura desde Firestore | Capa de lectura en `src/data/` y conversor a los tipos de interfaz; datos de demostración como alternativa. |
| 5. Lector | Sustituye el aviso de `ChapterPage` por las imágenes; datos reales del primer manga. |
| 6. Administración | Autenticación del administrador (`/admins/{uid}`), panel privado y subida de imágenes a R2. |
| 7. Publicación | Cloudflare Pages (definir variables `VITE_FIREBASE_*` y la redirección de SPA; `netlify.toml` ya no aplica). |

Las fases 5 a 7 son una propuesta por confirmar (D-027).

## 8. Rutas y páginas

| URL | Página | Notas |
| --- | --- | --- |
| `/` | `HomePage` | Banner destacado, "Últimos mangas" y "Populares". |
| `/catalogo` | `CatalogPage` | Orden: `?orden=populares` (por defecto, más recientes). El orden vive en la URL. |
| `/manga/{slug}` | `MangaPage` | Ficha: portada, títulos, estado, géneros, datos, sinopsis y capítulos. |
| `/manga/{slug}/capitulo/{n}` | `ChapterPage` | Lector **preparado**: URL y navegación anterior/siguiente listas; avisa que el lector aún no existe. |
| cualquier otra | `NotFoundPage` | También para mangas o capítulos inexistentes. |

- `src/config/routes.ts` es el único lugar que conoce la forma de las URL (`routes.manga(slug)`, `matchRoute(pathname)`). El resto del código no escribe rutas a mano.
- `Link` es un `<a href>` real (se puede abrir en otra pestaña); un clic simple navega sin recargar.
- Los datos entran por `App` y bajan por props: ninguna página ni componente importa datos por su cuenta.

## 9. Componentes

```text
App (RouterProvider)
├── Header ── Logo, navegación, SearchBox (+ menú móvil)
├── main
│   ├── HomePage ── HeroBanner, MangaSection ×2 (MangaGrid → MangaCard)
│   ├── CatalogPage ── SegmentedControl, MangaGrid
│   ├── MangaPage ── Breadcrumb, Cover, StatusBadge, Button, ChapterList
│   ├── ChapterPage ── Breadcrumb, EmptyState, Button
│   └── NotFoundPage ── EmptyState, Button
└── Footer ── Logo
```

- `MangaCard` y `MangaGrid` aceptan cualquier `Manga`; añadir títulos no exige tocarlos. La tarjeta abre la ficha.
- `Button` con `to` es un enlace con aspecto de botón; con `comingSoon` queda preparado para una función que aún no existe sin fingir que funciona.
- `EmptyState` cubre todas las secciones sin contenido (sin mangas, sin capítulos, populares sin datos).

## 10. Firestore (Fase 4A)

Definido en `src/firebase/types.ts`; reglas en `firestore.rules`; índices en `firestore.indexes.json`. Decisiones en D-023 a D-026.

```text
mangas/{slug}                     MangaDoc (id = slug)
└── chapters/{chapterId}          ChapterDoc (id = número con 3 dígitos: 001, 010.5)
genres/{slug}                     GenreDoc
siteConfig/main                   SiteConfigDoc
admins/{uid}                      Marca de administrador (se crea a mano en la consola)
```

- **Imágenes:** solo se guardan URLs y metadatos (`{ url, width?, height? }`) de Cloudflare R2. Nada de Firebase Storage.
- **Tipos de almacenamiento ≠ tipos de interfaz:** Firestore usa `Timestamp`, `null` en vez de `undefined` y capítulos en subcolección; la interfaz usa `Manga` con fechas ISO y capítulos embebidos. Un conversor (Fase 4B) los une.
- **Lectura de visitantes:** solo mangas y capítulos con `isPublished == true` (y capítulos de mangas publicados). Las consultas deben incluir `where('isPublished', '==', true)`; las reglas no filtran, rechazan.
- **Escritura:** solo administradores, es decir, UID con documento en `admins/{uid}`. Estar autenticado no basta. La autenticación se implementa en una fase posterior.
- **Contador `views`:** los visitantes no pueden escribirlo. Una cifra real de lecturas requerirá otra solución (p. ej. una función en la nube o un servicio de estadísticas) sin abrir escritura pública.
- **Alcance de las consultas con reglas actuales:** no hay consultas de grupo de colecciones (`chapters` de todos los mangas); si hacen falta (p. ej. "últimos capítulos" global), se amplían reglas e índices.
