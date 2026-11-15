# MangazX

Plataforma web moderna para leer **manga y manhwa en español**, gratis y sin necesidad de registrarse.

> Estado actual: **Fase 1 — Fundamentos del proyecto**. Todavía no existe catálogo, lector ni diseño definitivo.

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
| Netlify (plan gratuito) | Publicación futura |

Restricciones: proyecto gratuito; sin Cloudflare, Firebase, Supabase ni servicios de pago; dependencias mínimas.

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
│   ├── components/             Componentes reutilizables
│   ├── config/                 Configuración global (site.ts)
│   ├── data/                   Datos de los mangas (catálogo)
│   ├── pages/                  Páginas (una por ruta)
│   ├── styles/                 Estilos globales y tokens de diseño
│   ├── types/                  Tipos de TypeScript del dominio
│   ├── App.tsx                 Componente raíz (provisional en Fase 1)
│   ├── main.tsx                Punto de entrada
│   └── vite-env.d.ts
├── ARCHITECTURE.md             Arquitectura del proyecto
├── README.md
├── index.html
├── netlify.toml                Configuración de Netlify
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Identidad visual

Documentada aquí; se implementará en fases posteriores. Los valores iniciales están en `src/styles/tokens.css`.

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

## Plan de fases

| Fase | Contenido | Estado |
| --- | --- | --- |
| 1 | Fundamentos: estructura, configuración y documentación | Completada |
| 2 | Datos del manga y catálogo | Pendiente |
| 3 | Página de detalles del manga | Pendiente |
| 4 | Lector de capítulos | Pendiente |
| 5 | Diseño visual definitivo y responsive | Pendiente |
| 6 | Panel de administración privado | Pendiente |
| 7 | Publicación en Netlify | Pendiente |

El orden y contenido de las fases siguientes es una propuesta y se confirmará antes de empezar cada una.

## Documentación relacionada

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)
- [public/content/README.md](public/content/README.md)
