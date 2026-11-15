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
