# Contenido de mangas

Aquí se guardan las imágenes. Todo lo de esta carpeta se publica tal cual (Vite copia `public/` sin procesarlo).

## Estructura

```text
public/content/mangas/
└── {slug-del-manga}/            ej.: mi-manga
    ├── cover.webp               portada
    └── chapters/
        ├── 001/                 número de capítulo con 3 dígitos
        │   ├── 001.webp         número de página con 3 dígitos
        │   ├── 002.webp
        │   └── ...
        └── 002/
```

## Reglas

- `slug`: minúsculas, números y guiones. No cambia una vez publicado.
- Capítulos y páginas con 3 dígitos (`001`, `012`) para que se ordenen bien.
- Formato recomendado: `.webp` (menor peso, importante en el plan gratuito de Netlify).
- URL final de una página: `/content/mangas/{slug}/chapters/{capítulo}/{página}.webp`.
