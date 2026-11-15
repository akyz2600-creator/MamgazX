# Arquitectura de MangazX

Este documento explica cómo está organizado el proyecto y cómo debe crecer. Está pensado para que cualquier persona (o IA) pueda añadir funciones sin romper la estructura.

> Estado: **Fase 2**. Existe la página de inicio (encabezado, buscador, banner, secciones, pie) con datos de ejemplo. Todavía no hay lector, página de detalles ni panel de administración.

## 1. Principios

1. **Catálogo, no un solo manga.** El código nunca menciona un manga concreto. Un manga es un dato (`Manga`), no una parte del código.
2. **Datos separados de la interfaz.** Los componentes reciben datos; no los definen.
3. **Sitio estático.** Sin servidor ni base de datos: todo se sirve como archivos desde Netlify (plan gratuito).
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
│   ├── lib/              Funciones puras sobre los datos
│   ├── pages/            Páginas (una por ruta)
│   ├── styles/           Estilos globales y tokens
│   ├── types/            Tipos de TypeScript del dominio
│   ├── App.tsx           Componente raíz
│   └── main.tsx          Punto de entrada
├── index.html            HTML base de Vite
├── netlify.toml          Configuración de publicación
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 3. Responsabilidades de cada carpeta

| Carpeta | Responsabilidad | Qué NO debe contener |
| --- | --- | --- |
| `src/components/` | Piezas de interfaz reutilizables y sin lógica de rutas (botones, tarjetas, barras). | Datos de mangas; llamadas de carga de datos propias. |
| `src/lib/` | Funciones puras y testeables sobre los datos (`searchMangas`, `getLatestChapter`, `getCoverUrl`…). | JSX, estado de React o acceso a datos globales. |
| `src/pages/` | Una página por ruta. Une datos y componentes. | Estilos o piezas que se reutilicen en más de una página (van a `components/`). |
| `src/data/` | Datos del catálogo: lista de mangas y sus capítulos, tipados con `Manga`. | Componentes o lógica de interfaz. |
| `src/types/` | Tipos e interfaces del dominio (`Manga`, `Chapter`). Sin dependencias de React. | Valores o funciones con efectos. |
| `src/config/` | Valores globales compartidos (`siteConfig`: nombre, idioma, ruta base de imágenes). | Datos de mangas concretos. |
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

- `Manga`: `slug`, `title`, `description`, `format` (`manga` | `manhwa`), `status`, `genres`, `chapters`; opcionales `cover` e `isExample`.
- `Chapter`: `number`, `pageCount`, y opcionales `title` y `publishedAt`.

Las rutas de las imágenes **no se guardan** en los datos: se calculan a partir de `slug`, `chapter.number`, el número de página y `siteConfig.contentBasePath`. Así no hay que listar ~20 capítulos × decenas de páginas a mano, y mover las imágenes (por ejemplo, a otro alojamiento) solo exige cambiar `contentBasePath`.

### 4.3 Cómo se añadirá un manga nuevo

1. Elegir un `slug` (minúsculas, números y guiones) que no cambiará.
2. Crear `public/content/mangas/{slug}/` con la portada y los capítulos siguiendo la convención.
3. Añadir un objeto `Manga` al catálogo en `src/data/`.
4. No se modifica ningún componente ni página.

Si un cambio de código es necesario para añadir un manga, la arquitectura está fallando y hay que corregirla.

### 4.4 Escala y límites

Con un manga de ~20 capítulos, un catálogo en archivos TypeScript es suficiente. Si el catálogo crece mucho o se necesita editarlo sin tocar el repositorio, se reevaluará en la fase del panel de administración (sin Firebase, Supabase ni Cloudflare, según las restricciones del proyecto).

## 5. Criterios para incorporar nuevos módulos

Antes de añadir una función, carpeta o dependencia, responder:

1. **¿Pertenece a la fase actual?** Si no, no se hace sin autorización.
2. **¿Resuelve un problema que existe hoy?** Si es "por si acaso", no se hace.
3. **¿Existe ya una carpeta responsable?** Usarla antes de crear otra.
4. **¿Depende de un manga concreto?** Si sí, es un dato y va en `src/data/`, no en el código.
5. **¿Es gratuito y compatible con las restricciones?** Sin Cloudflare, Firebase, Supabase ni servicios de pago.
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
| 2. Diseño e inicio ✅ | Tokens, componentes base, `HomePage`, buscador local y datos de ejemplo en `src/data/mangas.ts`. |
| 3. Detalle del manga | Primera necesidad de enrutado (ver D-007) y sustitución de los datos de ejemplo por los reales. |
| 4. Lector | Componentes de lectura en `components/` y su página en `pages/`. |
| 5. Administración | Se decide cómo editar el catálogo respetando las restricciones de coste. |
| 6. Publicación | Netlify, usando `netlify.toml`. |

## 8. Componentes de la página de inicio (Fase 2)

```text
App
├── Header ── Logo, navegación, SearchBox (+ menú móvil)
├── main > HomePage
│   ├── HeroBanner ── Cover, StatusBadge, Button
│   └── MangaSection (×2: "Últimos mangas" y "Populares")
│       └── MangaCard ── Cover, StatusBadge     (o EmptyState si no hay datos)
└── Footer ── Logo
```

- Los datos entran por `App` (`src/data/mangas.ts`) y bajan por props: ningún componente importa datos por su cuenta.
- `MangaCard` y `MangaSection` aceptan cualquier `Manga`; añadir títulos no exige tocarlos.
- "Populares" no inventa estadísticas: se alimenta de `popularSlugs` (vacío hasta que existan datos reales) y muestra un estado vacío.
- `Button` con `comingSoon` deja preparados "Leer ahora" y "Ver detalles" sin fingir que funcionan.
