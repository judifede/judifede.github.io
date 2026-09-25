# Notas para agentes y contribuidores

## Cachés de Astro/Vite e imágenes

Cuando una imagen referenciada en el frontmatter (`src/content/proyectos/<slug>/index.md` → `resource.items[].nombre` o el archivo `<slug>.webp/png/jpg`) se elimina en disco, el dev server de Astro/Vite puede seguir intentando transformarla durante un tiempo, mostrando errores `[ImageNotFound] Could not find requested image '...'` en cada recarga.

**Cómo resolverlo**: ejecutar el script de limpieza y reiniciar el host.

```bash
npm run fresh   # equivale a: clean + host
```

El script `clean` borra `.astro/`, `node_modules/.vite/` y `node_modules/.cache/`. Es seguro ejecutarlo: todas las cachés se regeneran en el siguiente arranque.

## Blindaje defensivo en `src/utils/proyectos.ts`

La función `imagenValida(meta)` actúa como type guard sobre los `ImageMetadata` que devuelve `import.meta.glob`. Si un asset quedó cacheado pero apunta a una URL rota (o falta `src`/`width`/`height`), el guard lo descarta y se renderiza el placeholder definido en `RecursoProyecto.astro`.

Si necesitas modificar este comportamiento:

- No elimines el guard sin reemplazarlo por otra validación equivalente.
- Si añades un nuevo caso de recurso (más allá de `galeria`, `imagen`, `video`), añade también la llamada correspondiente a `imagenValida`.
