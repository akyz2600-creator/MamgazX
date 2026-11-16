# MangazX

Plataforma web moderna para leer **manga y manhwa en español**, gratis y sin necesidad de registrarse.

> Estado actual: **Fase 4A — Preparación de Firebase y Firestore** (código listo; falta la configuración real de Firebase). Hay inicio, catálogo con orden, fichas de manga y lista de capítulos, todavía con datos de demostración. El lector de imágenes y el panel de administración aún no existen. Ver [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Objetivo

Que cualquier visitante pueda leer manga y manhwa en español desde Android, tablet o PC, sin cuentas ni costos.

- Al inicio se publicará **un solo manga** (~20 capítulos).
- La arquitectura permite **añadir más mangas sin reconstruir el proyecto**.
- Los lectores no necesitan cuenta. Habrá un administrador privado en una fase posterior.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| React | Interfaz de usuario |
| TypeScript | Tipado estático |
| Vite | Servidor de desarrollo y compilación |
| GitHub | Repositorio y control de versiones |
| Firebase Firestore | Datos de mangas, capítulos y géneros (preparado en la Fase 4A, aún no conectado a la interfaz) |
| Cloudflare R2 | Imágenes de portadas y páginas (fase posterior) |
| Cloudflare Pages | Publicación futura |

Restricciones: proyecto gratuito; sin Supabase ni Firebase Storage (las imágenes irán a R2); dependencias mínimas. Ver D-023 en [docs/DECISIONS.md](docs/DECISIONS.md).

## Configuración de Firebase

1. Copia `.env.example` a `.env.local` (no se sube a GitHub) y completa los valores de la app web de tu proyecto de Firebase.
2. Publica las reglas: `npx firebase-tools deploy --only firestore:rules,firestore:indexes --project <ID_DEL_PROYECTO>`.
3. Sin esas variables el sitio sigue funcionando con los datos de demostración.

Más detalle en [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Requisitos

- Node.js **20.19 o superior** (recomendado 22).
- npm (incluido con Node.js).
- Git.

## Instalación

```bash
git clone <url-del-repositorio> mangazx
cd mangazx
npm install
```

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite |
| `npm run typecheck` | Comprueba los tipos de TypeScript sin generar archivos |
| `npm run build` | Comprueba tipos y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la compilación de producción |

## Estructura de carpetas

```text
mangazx/
├── docs/                       Documentación técnica adicional
│   └── DECISIONS.md            Decisiones técnicas y su justificación
├── public/                     Recursos estáticos (se publican sin procesar)
│   ├── favicon.svg
│   └── content/
│       ├── README.md           Convención de imágenes
│       └── mangas/             Imágenes: {slug}/chapters/{capítulo}/{página}.webp
├── src/
│   ├── assets/                 Recursos que importa el código (logos, íconos)
│   ├── components/             Componentes reutilizables (cada uno con su .module.css)
│   │   ├── Header, SearchBox, Logo, Footer, Breadcrumb
│   │   ├── HeroBanner, MangaSection, MangaGrid, MangaCard, Cover
│   │   ├── ChapterList, SegmentedControl, ViewsBadge
│   │   └── Button, StatusBadge, EmptyState, icons
│   ├── config/                 Configuración global (site.ts, navigation.ts, routes.ts)
│   ├── data/                   mangas.ts (DATOS DE DEMOSTRACIÓN) y genres.ts (catálogo de géneros)
│   ├── firebase/               Firebase: client.ts (inicialización), types.ts (documentos), collections.ts
│   ├── hooks/                  Hooks reutilizables (useDocumentTitle)
│   ├── lib/                    Funciones puras: orden, búsqueda, capítulos, fechas, formato
│   ├── pages/                  Páginas: Home, Catalog, Manga (ficha), Chapter, NotFound
│   ├── router/                 Enrutador mínimo propio (sin dependencias)
│   ├── styles/                 Estilos globales y tokens de diseño
│   ├── types/                  Tipos de TypeScript del dominio
│   ├── App.tsx                 Estructura general: encabezado, contenido y pie
│   ├── main.tsx                Punto de entrada
│   └── vite-env.d.ts
├── .env.example                Plantilla de variables de entorno (Firebase)
├── ARCHITECTURE.md             Arquitectura del proyecto
├── PROJECT_STATUS.md           Estado y seguimiento
├── README.md
├── firebase.json               Rutas de reglas e índices de Firestore
├── firestore.rules             Reglas de seguridad de Firestore
├── firestore.indexes.json      Índices de Firestore
├── index.html
├── netlify.toml                Configuración antigua de Netlify (sin uso, ver D-023)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Identidad visual

Implementada en la Fase 2. Todos los valores (colores, radios, sombras, medidas) viven en `src/styles/tokens.css`; los componentes no repiten valores literales.

- **Estilo:** moderno, geek, tecnológico, inspirado en plataformas de manga y cultura anime.
- **Tema:** oscuro, fondo negro azulado (`#070a14`).
- **Acentos:** violeta eléctrico (`#8b5cf6`) y azul neón (`#22d3ee`).
- **Adaptable:** Android, tablets y PC (diseño responsive, enfoque móvil primero).
- **Interfaz:** limpia, atractiva y fácil de navegar.

## Reglas de desarrollo

1. Trabajar por fases; no avanzar a otra fase sin autorización explícita.
2. TypeScript estricto: sin `any` salvo justificación comentada.
3. No añadir dependencias sin necesidad real; documentar la razón en `docs/DECISIONS.md`.
4. Mantener el proyecto gratuito (ver restricciones).
5. Evitar código duplicado y abstracciones prematuras.
6. Ningún componente ni página debe depender de un manga concreto.
7. Imágenes siempre bajo `public/content/mangas/` siguiendo la convención.
8. Documentar las decisiones técnicas relevantes.
9. Estilos de componentes con CSS Modules (`Componente.module.css`); valores compartidos solo desde `tokens.css`.
10. Los datos de ejemplo se marcan con `isExample` y viven únicamente en `src/data/mangas.ts`.

## Plan de fases

| Fase | Contenido | Estado |
| --- | --- | --- |
| 1 | Fundamentos: estructura, configuración y documentación | Completada |
| 2 | Diseño visual y página de inicio (con datos de ejemplo) | Completada |
| 3 | Catálogo: fichas, géneros, estados, capítulos y orden (datos de demostración) | Completada |
| 4A | Firebase y Firestore: SDK, variables de entorno, estructura, reglas e índices | Código listo; falta configurar el proyecto de Firebase |
| 4B | Lectura del catálogo desde Firestore (con los datos de demostración como alternativa) | Pendiente |
| 5 | Lector de capítulos (y datos reales del primer manga) | Pendiente |
| 6 | Autenticación del administrador, panel privado y subida de imágenes a R2 | Pendiente |
| 7 | Publicación en Cloudflare Pages | Pendiente |

El orden y contenido de las fases siguientes es una propuesta y se confirmará antes de empezar cada una.

## Documentación relacionada

- [PROJECT_STATUS.md](PROJECT_STATUS.md): estado actual, pendientes y problemas conocidos.
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)
- [public/content/README.md](public/content/README.md)
