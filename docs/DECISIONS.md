# Decisiones técnicas

Registro de las decisiones relevantes del proyecto. Cada decisión nueva se añade al final con el siguiente número.

## D-001 · React + TypeScript + Vite

- **Decisión:** usar React, TypeScript (modo estricto) y Vite como base.
- **Motivo:** es lo pedido en el alcance del proyecto; Vite ofrece arranque rápido y una compilación estática ideal para Netlify.
- **Versiones:** React 19, Vite 7, TypeScript 5.9 (`~5.9.0`, fijado a la rama menor para evitar cambios inesperados de comportamiento del compilador).
- **Requisito derivado:** Node.js 20.19 o superior (requerido por Vite 7).

## D-002 · Dependencias mínimas

- **Decisión:** solo se instalan `react` y `react-dom` (producción) y `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react` y `@types/react-dom` (desarrollo).
- **Motivo:** menos dependencias significa menos mantenimiento, menos riesgo y un sitio más ligero.
- **No incluido a propósito:** librería de enrutado, de estado, de estilos, de componentes ni de iconos. Se evaluará cada una cuando exista una necesidad real (ver D-007).

## D-003 · Sitio estático sin backend

> Parcialmente reemplazada por D-023 (Fase 4A): se habilitan Firestore, R2 y Cloudflare Pages. Los lectores siguen sin cuenta.

- **Decisión:** la aplicación es una SPA estática; sin base de datos, servidor ni cuentas.
- **Motivo:** los lectores no necesitan registrarse, y las restricciones excluyen Cloudflare, Firebase, Supabase y servicios de pago. Un sitio estático en Netlify (plan gratuito) cumple todo.
- **Consecuencia:** el catálogo se guardará como datos dentro del repositorio. Se reevaluará en la fase del panel de administración.

## D-004 · Imágenes en `public/content/mangas/{slug}/chapters/{capítulo}/{página}.webp`

- **Decisión:** las imágenes viven en `public/`, organizadas por manga, capítulo y página, con números de 3 dígitos.
- **Motivo:** `public/` se copia sin procesar, por lo que no se generan cientos de importaciones; los 3 dígitos garantizan el orden alfabético correcto; WebP reduce el peso.
- **Alternativa descartada:** `src/assets/`, porque obligaría a importar cada imagen y Vite las procesaría una a una.
- **Consecuencia:** las rutas no se guardan en los datos, se calculan (ver `ARCHITECTURE.md`, sección 4.2).

## D-005 · Arquitectura independiente del manga

- **Decisión:** un manga es un dato (`Manga` en `src/types/manga.ts`) identificado por un `slug` estable; ningún componente lo referencia por nombre.
- **Motivo:** el catálogo debe ampliarse sin reconstruir el proyecto.

## D-006 · Identidad visual como tokens CSS

- **Decisión:** las directrices visuales se registran como variables CSS en `src/styles/tokens.css` (fondo `#070a14`, violeta `#8b5cf6`, azul neón `#22d3ee`).
- **Motivo:** en la Fase 1 solo se documentan las directrices; tener los valores en un único archivo evita duplicarlos y facilita el diseño definitivo.
- **Alcance:** la pantalla actual (`App.tsx`) es provisional y solo confirma que la cadena de herramientas funciona.

## D-007 · Decisiones aplazadas

Se deciden cuando su fase lo requiera, no antes:

| Tema | Fase | Nota |
| --- | --- | --- |
| Enrutado (p. ej. React Router) | 3 | Se justificará si la dependencia realmente aporta frente a una solución propia. |
| Estrategia de estilos de componentes (CSS global, CSS Modules, etc.) | 2–5 | Vite soporta CSS Modules sin dependencias adicionales. |
| Edición del catálogo / panel de administración | 6 | Debe respetar las restricciones de coste y de servicios. |

## D-008 · Configuración de Netlify preparada, no usada

- **Decisión:** `netlify.toml` define el comando de compilación (`npm run build`), la carpeta de publicación (`dist`), Node 22 y la redirección de SPA (`/*` → `/index.html`).
- **Motivo:** dejar lista la publicación futura. No se publica nada en la Fase 1.

## D-009 · Opciones estrictas de TypeScript

- **Decisión:** `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` e `isolatedModules` activados.
- **Motivo:** detectar errores pronto; `noUncheckedIndexedAccess` es especialmente útil para listas de capítulos y páginas.
- **Consecuencia:** `npm run build` ejecuta `tsc --noEmit` antes de `vite build`, de modo que un error de tipos impide generar la versión de producción.

## D-010 · Estilos con CSS Modules

- **Decisión:** cada componente tiene su `Componente.module.css`. Los valores compartidos salen de `src/styles/tokens.css`; `global.css` solo contiene reset, utilidades (`.container`, `.visually-hidden`) y accesibilidad.
- **Motivo:** Vite soporta CSS Modules sin dependencias nuevas; los nombres de clase quedan acotados al componente y no chocan entre sí. Resuelve el punto abierto de D-007.
- **Alternativas descartadas:** librerías de estilos o Tailwind (dependencias innecesarias para este tamaño de proyecto).

## D-011 · Sin librería de enrutado todavía

> Reemplazada por D-016 (Fase 3): ya hay varias páginas y se creó un enrutador propio.

- **Decisión:** la Fase 2 solo tiene la página de inicio; la navegación usa anclas (`#catalogo`, `#ultimos-mangas`) definidas en `src/config/navigation.ts`.
- **Motivo:** no hay otras páginas que justifiquen un enrutador (ver D-007). "Catálogo" y "Últimos capítulos" apuntan a secciones de la propia página y pasarán a rutas reales cuando existan.
- **Consecuencia:** no se simula ninguna página que no exista.

## D-012 · Datos de ejemplo claramente marcados

> Fase 3: ahora hay 4 entradas de demostración (ver D-020), todas con `isExample`.

- **Decisión:** `src/data/mangas.ts` contiene un único manga ficticio (`isExample: true`) y la interfaz muestra la etiqueta "Ejemplo" / "Datos de ejemplo".
- **Motivo:** no atribuir datos reales a una obra inexistente. Es el único archivo a reemplazar para publicar el primer manga.
- **Popularidad:** `popularSlugs` está vacío a propósito; no se inventan visitas, puntuaciones ni rankings.

## D-013 · Portada opcional con marcador

> Fase 3: el campo `cover` pasó a llamarse `coverImage` (ver D-017). El comportamiento es el mismo.

- **Decisión:** `Manga.cover` pasó a ser opcional. Sin portada, o si la imagen falla al cargar, `Cover` muestra un marcador generado (iniciales sobre degradado).
- **Motivo:** no inventar una portada definitiva y evitar imágenes rotas.

## D-014 · Buscador local

> Fase 3: además del título, busca en `alternativeTitle`, y los resultados enlazan a la ficha.

- **Decisión:** `searchMangas` (`src/lib/manga.ts`) filtra por título ignorando mayúsculas y acentos; todas las palabras escritas deben aparecer en el título. Sin backend ni librerías.
- **Alcance:** busca solo por nombre, como se pidió. Los resultados aún no enlazan a una página de detalles (se indica en el panel).

## D-015 · Accesibilidad y rendimiento base

- Objetivos táctiles de al menos 44 px, campos de 16 px (evita el zoom en móvil), enlace "Saltar al contenido", foco visible, `aria-current`, `prefers-reduced-motion` respetado, hover solo con `@media (hover: hover)`.
- Fuentes del sistema (sin descargas ni servicios externos), imágenes con `loading="lazy"` y proporción fija 2:3 para evitar saltos de diseño.

## D-016 · Enrutador propio, sin dependencias (Fase 3)

- **Decisión:** `src/router/router.tsx` implementa lo necesario con la API de historial del navegador: `RouterProvider`, `Link`, `useLocation`, `useNavigate`. Las URL son reales (`/manga/{slug}`), no con `#`.
- **Motivo:** hacen falta varias páginas con URL propia, pero la necesidad es pequeña (rutas fijas, sin rutas anidadas ni carga de datos por ruta). Evita una dependencia (regla de D-002) y no fue posible instalar paquetes en el entorno de desarrollo de esta fase.
- **Cómo funciona en Netlify:** la regla `/* → /index.html` de `netlify.toml` (D-008) hace que abrir directamente `/manga/...` funcione. Vite ya hace lo mismo en desarrollo.
- **Detalles cuidados:** `Link` es un `<a href>` real (Ctrl+clic abre otra pestaña), vuelve al inicio de la página al cambiar de página, baja a las anclas (`/#ultimos-mangas`) y no toca el scroll al cambiar el orden del catálogo.
- **Salida:** si el proyecto necesitara algo más complejo, se sustituye cambiando solo ese archivo y `src/config/routes.ts`.

## D-017 · Modelo de datos ampliado (Fase 3)

- **Decisión:** `Manga` y `Chapter` siguen la especificación de la fase: `id`, `slug`, `title`, `alternativeTitle`, `synopsis`, `coverImage`, `genres`, `status`, `chapters`, `views`, `createdAt`, `updatedAt`, `lastChapterAt`; capítulo con `id`, `number`, `title`, `publishedAt`, `pages`.
- **Renombrados respecto a la Fase 2:** `description` → `synopsis`, `cover` → `coverImage`, `pageCount` → `pages`.
- **Fechas derivadas:** `createManga()` calcula `lastChapterAt` (máximo `publishedAt`) y `updatedAt` (nunca anterior al último capítulo). Así, al añadir un capítulo la "última actualización" cambia sola y no puede quedar desfasada.
- **Capítulos:** "primero", "último" y el orden se calculan por `number`, no por la posición en la lista.
- **Independiente del proveedor de datos:** los tipos no dependen de ningún servicio. Ver D-021.

## D-018 · Catálogo de géneros reutilizable

- **Decisión:** `src/data/genres.ts` es la única lista de géneros (9, los pedidos). Cada manga guarda solo ids; `GenreId` se deriva de la lista.
- **Motivo:** varios géneros por manga, nombres corregibles en un solo lugar y base para filtrar. Un id inexistente es un error de compilación.
- **Alcance:** el filtrado por género **no** se implementó (se pidió dejarlo preparado).

## D-019 · Estados de publicación

- **Decisión:** solo `ongoing` ("En publicación") y `completed` ("Finalizado"). Se eliminó "En pausa" y la etiqueta "En emisión" pasó a "En publicación", según la especificación.

## D-020 · Datos de demostración y popularidad

- **Decisión:** `src/data/mangas.ts` tiene 4 mangas de demostración (todos `isExample`), con distintos estados, géneros y lecturas. Uno no tiene capítulos, para probar los estados vacíos.
- **Por qué cuatro y no uno:** con un solo manga el orden por recientes/populares no se puede ver ni probar. Se borran junto con el resto de datos al publicar el primer manga real.
- **Popularidad:** `views` es el contador de lecturas. Sus valores son de demostración y la interfaz lo dice ("Dato de demostración", aviso en Populares y en el catálogo). "Populares" solo incluye mangas con `views > 0`; sin lecturas muestra el estado vacío. No se inventan estadísticas reales.
- **Orden:** "más populares" ordena por lecturas y desempata por el más reciente. "Más recientes" usa la fecha del último capítulo o, si no hay, la de alta. El orden vive en la URL (`?orden=populares`).

## D-021 · Contradicción pendiente: Firebase

> **Resuelta en la Fase 4A (D-023):** la restricción se levanta para Firestore, R2 y Cloudflare Pages.

- **Hallazgo:** la Fase 1 prohíbe Firebase, Supabase y Cloudflare; la Fase 3 habla de preparar una "futura integración con Firestore".
- **Qué se hizo:** no se integró ningún servicio y los datos quedaron separados de la interfaz (los componentes solo reciben objetos `Manga`), por lo que cambiar el origen de datos solo afecta a `src/data/` y a `App.tsx`.
- **Qué falta:** decidir, antes de la fase del panel de administración, si la restricción de la Fase 1 sigue vigente o se levanta para Firestore. Hasta entonces se mantiene la restricción original.

## D-022 · Hallazgos de calidad corregidos durante la Fase 3

- **Fechas "recientes":** se cuentan días de calendario, no horas, para que el indicador no cambie según la hora del día ni por el cambio de horario.
- **Listas `ol`:** el reset global ahora incluye `ol` (antes mostraban numeración y sangría).
- **Alturas de tarjeta:** todas las tarjetas de una fila miden lo mismo (`height: 100%`).

## D-023 · Se habilitan Firestore, Cloudflare R2 y Cloudflare Pages (Fase 4A)

> Resuelve D-021 y reemplaza la restricción de D-003 y del README ("sin Cloudflare, Firebase, Supabase ni servicios de pago").

- **Decisión:** los datos del catálogo (mangas, capítulos, géneros, configuración) irán a **Firebase Firestore**; las imágenes a **Cloudflare R2** (Firestore solo guarda URLs y metadatos); la publicación será en **Cloudflare Pages**. Los lectores siguen sin cuenta; la autenticación será solo para el administrador, en una fase posterior.
- **No se usan:** Supabase ni Firebase Storage.
- **Origen:** instrucción explícita del propietario del proyecto al iniciar la Fase 4A.
- **Consecuencias:** `netlify.toml` queda como configuración antigua sin uso (D-008); la publicación y la redirección de SPA en Cloudflare Pages se definen en la fase de publicación. El sitio actual sigue funcionando sin servicios externos mientras Firebase no esté configurado.

## D-024 · SDK de Firebase y módulo único de inicialización

- **Decisión:** dependencia `firebase ^13.3.0` (última versión estable consultada el 2026-11-16). `src/firebase/client.ts` es el único lugar que llama a `initializeApp`; el resto usa `getDb()` / `getFirebaseApp()`.
- **Configuración:** variables `VITE_FIREBASE_*` en `.env.local` (plantilla en `.env.example`). Son datos públicos; la seguridad la dan las reglas. `.gitignore` excluye `.env*` (salvo `.env.example`), cuentas de servicio y cachés de Firebase.
- **Inicialización perezosa:** importar el módulo no falla si faltan variables; `getDb()` lanza un error claro. `isFirebaseConfigured` permite usar los datos de demostración como alternativa.
- **Dependencia justificada (D-002):** solo se importan `firebase/app` y `firebase/firestore`; Firebase no entra en el bundle hasta que algo importe el módulo.
- **No instalado en el entorno de desarrollo de esta fase:** solo declarado en `package.json`; ver "Problemas conocidos" en PROJECT_STATUS.md.

## D-025 · Estructura de Firestore

- **Colecciones:** `mangas/{slug}` con subcolección `chapters/{chapterId}`, `genres/{slug}` y `siteConfig/main`. Detalle de campos en `src/firebase/types.ts`.
- **Id del manga = slug:** unicidad garantizada y lectura directa sin consulta. Las reglas exigen que el campo `slug` coincida con el id. El slug es estable (D-005); cambiarlo equivale a crear otro manga.
- **Id del capítulo = número con 3 dígitos** (`001`, `010.5`), igual que las carpetas de imágenes (`chapterDocId`).
- **Tipos de almacenamiento separados de los de interfaz:** `Timestamp` frente a fechas ISO, subcolección frente a `chapters` embebido. El conversor se escribe en la Fase 4B; los tipos de la interfaz no cambian.
- **Todos los campos existen siempre**; lo opcional se guarda como `null` (Firestore rechaza `undefined`). Así `lastChapterAt: null` permite ordenar por esa fecha también los mangas sin capítulos.
- **Campo añadido respecto a la lista pedida:** `format` (`manga` | `manhwa`), porque la interfaz actual lo usa.
- **Imágenes:** `coverImage` y cada página son `{ url, width?, height? }` con URL de R2.
- **Índices** (`firestore.indexes.json`): publicados por recientes, por populares (con desempate por reciente), por género + recientes, y capítulos publicados por número.

## D-026 · Seguridad de Firestore

- **Administrador = existe `/admins/{uid}`.** Un usuario autenticado cualquiera NO es administrador. El documento se crea a mano en la consola; las reglas prohíben crearlo desde la web. (Alternativa descartada por ahora: *custom claims*, que exigen el SDK de administrador o una función en la nube.)
- **Visitantes:** solo leen mangas publicados y capítulos publicados cuyo manga también lo esté; leen géneros y `siteConfig/main`; no escriben nada. Las consultas deben filtrar por `isPublished == true`.
- **Validación de escrituras de administrador:** conjunto exacto de campos y tipos para mangas y capítulos.
- **`views`:** los visitantes no pueden incrementarlo. Contarlo sin abrir escritura pública exige otra solución (fase posterior).
- **Todo lo no listado queda denegado.** No hay reglas abiertas.
- **Estado:** reglas sin probar en el emulador (no disponible en el entorno de la fase).

## D-027 · Numeración de fases

- **Decisión:** la Fase 4 pasa a ser "Firebase y datos" (4A preparación, 4B capa de lectura…). El lector, el panel de administración, R2 y la publicación en Cloudflare Pages se ordenan en fases posteriores, por confirmar con el propietario.
