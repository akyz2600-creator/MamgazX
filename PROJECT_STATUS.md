# Estado del proyecto — MangazX

> Documento breve de seguimiento. El detalle técnico vive en [ARCHITECTURE.md](ARCHITECTURE.md) y [docs/DECISIONS.md](docs/DECISIONS.md); el uso, en [README.md](README.md).

**Fase actual:** 4A — Preparación de Firebase y Firestore (**terminada y verificada el 2026-11-16**). **Siguiente:** 4B — Capa de datos de solo lectura (por iniciar; esperar instrucciones del propietario).

## Qué funciona hoy

| Fase | Resultado |
| --- | --- |
| 1 | Estructura, configuración y documentación. |
| 2 | Identidad visual, encabezado, buscador, banner, tarjetas, "Últimos mangas", "Populares", pie. |
| 3 | URL propias, catálogo con orden por recientes/populares, ficha de cada manga, lista de capítulos, géneros, estados, "última actualización" automática, páginas 404, lector **preparado**. |
| 4A | Módulo de Firebase, variables de entorno, estructura de Firestore (tipos), reglas de seguridad e índices. **La interfaz no usa Firebase todavía**: sigue mostrando los datos de demostración. |

Rutas: `/`, `/catalogo` (`?orden=populares`), `/manga/{slug}`, `/manga/{slug}/capitulo/{n}`. Detalle en ARCHITECTURE.md, sección 8.

## Arquitectura prevista (decidida en la Fase 4A, ver D-023)

React + TypeScript + Vite · **Firestore** (mangas, capítulos, géneros, configuración) · **Cloudflare R2** (portadas y páginas; solo se guardan sus URLs en Firestore) · **Cloudflare Pages** (publicación) · lectores sin cuenta · autenticación solo para el administrador (fase posterior). Sin Supabase ni Firebase Storage.

## Fase 4A: cambios

- **Archivos nuevos:**
  - `src/firebase/client.ts` (único lugar que inicializa Firebase; inicialización perezosa), `src/firebase/types.ts` (documentos de Firestore), `src/firebase/collections.ts` (nombres/rutas de colecciones y `chapterDocId`).
  - `firestore.rules`, `firestore.indexes.json`, `firebase.json`.
  - `.env.example`.
- **Archivos modificados:** `package.json` (dependencia `firebase ^13.3.0`), `src/vite-env.d.ts` (tipos de las variables `VITE_FIREBASE_*`), `.gitignore` (credenciales y cachés de Firebase), y esta documentación (README, ARCHITECTURE, DECISIONS).
- **No se tocó:** ningún componente, página, estilo ni dato de la Fase 2/3. `src/firebase/` no lo importa nadie aún, así que el sitio funciona igual y Firebase no entra en el bundle.

## Hallazgos de la revisión inicial

- **Contradicción de la documentación (resuelta):** la Fase 1 prohibía Firebase, Cloudflare y Supabase (D-003, D-021). Las instrucciones de la Fase 4A los habilitan (Firestore, R2, Pages). Se registró en D-023; Netlify (`netlify.toml`) queda como configuración antigua sin usar.
- **Numeración de fases:** la documentación llamaba "Fase 4" al lector. Ahora la Fase 4 es Firebase (4A, 4B…) y el lector pasa a una fase posterior (propuesta en el README, por confirmar).
- **La Fase 3 está lista para conectarse:** los componentes solo reciben objetos `Manga` y los datos entran únicamente por `src/data/` y `App.tsx`. Diferencias que 4B debe resolver con un conversor: la interfaz usa fechas ISO y `chapters` dentro del manga, e `id` propio; Firestore usa `Timestamp`, subcolección `chapters` e id = slug.
- **Compilación de la Fase 3 y de la 4A:** no se podía verificar en el entorno de desarrollo (sin paquetes); quedó confirmada después en Google Cloud Shell (ver "Cierre de la Fase 4A").

## Cierre de la Fase 4A (2026-11-16)

El propietario hizo lo siguiente y se comprobó:

1. **Proyecto de Firebase creado:** ID `mangazx-1b08a`, app web registrada, Firestore creado.
2. **`.env.local` creado en Google Cloud Shell** (no en una computadora local; el propietario trabaja desde el celular) con los valores `VITE_FIREBASE_*` de la app web. No se sube a GitHub.
3. **Compilación confirmada:** `npm install && npm run build` terminó sin errores en Cloud Shell (se instaló `firebase` 13.4.0, compatible con `^13.3.0`).
4. **Reglas publicadas** pegando `firestore.rules` en la pestaña "Reglas" de la consola.
5. **Reglas probadas como visitante** con un script del SDK contra el proyecto real (6 de 6 correctas): leer `genres/accion` y `siteConfig/main` permitido; crear `mangas/prueba`, borrar `genres/accion`, leer `admins/cualquiera` y leer `otra/cosa` denegado.

### Lo que NO está verificado todavía

- **Índices no publicados:** solo se pegaron las reglas. Hay que publicar `firestore.indexes.json` antes de consultar ordenado en la Fase 4B (con `npx firebase-tools deploy --only firestore:indexes --project mangazx-1b08a`, o creándolos desde el enlace que muestra el error de Firestore).
- **Lectura de mangas publicados frente a no publicados** y la regla de capítulos con manga padre: se prueban al cargar datos en la 4B.
- **Escrituras de administrador y validación de campos:** se prueban en la fase de autenticación.
- **`package-lock.json`:** `npm install` lo generó en Cloud Shell y no está en el repositorio; conviene subirlo.
- `firebase login` desde Cloud Shell falló dos veces (código de autorización rechazado); por eso las reglas se publicaron a mano. No es un problema del proyecto.

## Información de Firebase

Datos públicos de la app web ya entregados por el propietario (apiKey, authDomain, projectId, appId, messagingSenderId); viven en `.env.local`. **No** compartir cuentas de servicio ni claves privadas. Más adelante (fase de autenticación) hará falta el UID del administrador.

## Reglas de seguridad (resumen)

- Visitantes: leen solo mangas y capítulos publicados (un capítulo requiere además que su manga esté publicado), géneros y `siteConfig/main`. No escriben nada.
- Escritura: solo administradores = usuarios cuyo UID tiene un documento en `/admins/{uid}`. Ese documento se crea **a mano en la consola**; las reglas impiden crearlo desde la web. Estar autenticado no basta.
- Las consultas de visitantes deben incluir `where('isPublished', '==', true)`.
- Los visitantes **no** pueden incrementar `views`; el contador real queda para una fase posterior (ver ARCHITECTURE.md, sección 10).
- Todo lo demás está denegado.

**Estado de las reglas:** publicadas y probadas como visitante (6 de 6); el resto, ver "Lo que NO está verificado todavía".

Para volver a publicarlas: pegar el contenido de `firestore.rules` en Firestore > Reglas, o, con sesión iniciada en Firebase:

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project mangazx-1b08a
```

## Pendiente (más allá de la 4A)

- **Fase 4B:** ver más abajo.
- **Lector de capítulos:** mostrar las páginas. Hoy `/manga/{slug}/capitulo/{n}` avisa "El lector estará disponible próximamente".
- **Datos reales y subida de imágenes a R2**, y sustituir los 4 mangas de demostración.
- **Estadísticas reales de lecturas** (los visitantes no pueden escribir `views`).
- **Autenticación y panel de administración**, incluido el documento `/admins/{uid}`.
- **Filtro por género** (el modelo y el índice ya están preparados).
- **Páginas legales y de contacto.**
- **Publicación en Cloudflare Pages** (definir las variables `VITE_FIREBASE_*` allí y la redirección de SPA; `netlify.toml` ya no aplica).

## Cómo continuar con la Fase 4B (propuesta, por confirmar)

Objetivo: que el catálogo pueda leerse desde Firestore **sin romper** el sitio de demostración.

1. Publicar los índices (`firestore.indexes.json`); la configuración y las reglas ya están listas.
2. Cargar los primeros datos **desde la consola de Firebase** (las reglas no permiten escribir desde la web): al menos `siteConfig/main`, los géneros y un manga de prueba con `isPublished: true`. Un script de carga con credenciales de administrador queda fuera de esta fase.
3. Crear la capa de lectura en `src/data/` (consultas de solo lectura: mangas publicados por recientes/populares, manga por slug, capítulos publicados) y un conversor de `MangaDoc`/`ChapterDoc` a los tipos de interfaz, con fechas a ISO.
4. Conectarla en `App.tsx` con estados de carga y error, y **usar los datos de demostración cuando Firebase no esté configurado**.
5. No incluye: autenticación, panel, subida de imágenes, R2, lector.

## Problemas conocidos

- Los índices de Firestore y `package-lock.json` siguen pendientes (ver "Lo que NO está verificado todavía").
- El entorno de desarrollo de Claude no tiene red para instalar paquetes; la compilación y las pruebas contra Firebase se hacen en Google Cloud Shell.
- El idioma de las cifras sigue el español genérico (`es`): 1240 se escribe sin punto; desde 5 cifras usa punto (12.400).
- Las portadas son marcadores generados: no hay imágenes reales.

## Cómo verificar

```bash
npm install
npm run build   # tipos + compilación
npm run dev     # abrir /, /catalogo, /manga/titulo-de-ejemplo
```
