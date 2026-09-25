---
name: ia-garbage-cleanup
description: Detecta y mueve ficheros basura generados durante el trabajo de la IA a la carpeta `.files-ia/` (ignorada por git). Use when el usuario pida "limpia basura de la IA", "mover ficheros a .files-ia", "archivos temporales", o tras finalizar tareas largas del agente. Sub-organiza por categoría en `.files-ia/{logs,components,misc}/`.
license: MIT
metadata:
  authors: 'judifede'
  version: '0.1.1'
---

# Limpieza de ficheros generados por la IA

Esta skill detecta y mueve (nunca borra) ficheros "basura" producidos durante sesiones de trabajo con agentes IA hacia una carpeta local ignorada por git: `.files-ia/`.

---

## 1. Cuándo se aplica

- Cuando el usuario pida explícitamente "limpia basura de la IA", "mover ficheros a `.files-ia`", "archivos temporales", "ordena el repo", o variantes similares.
- Tras finalizar una tarea larga del agente si el árbol de trabajo tiene ficheros sospechosos en la raíz o en `src/`.
- **No** se aplica a `.tools/`, `node_modules/`, `dist/`, `.astro/`, `.env`, `public/gallery/` (zonas ya gestionadas o protegidas).

## 2. Patrones de detección

### 2.1 Patrones de RAÍZ (solo nivel superior del repo, no recursivo)

- `build-*.log`, `build_output*.log`, `build-*-exit.txt`
- `preview-*.log` (stdout, stderr, final, final-err)
- `npm-install-*.log`
- `*-fase*.log`, `*-fase*.txt`
- `check-*.log`

### 2.2 Patrones RECURSIVOS (en cualquier subcarpeta, salvo exclusiones)

- Nombres que empiecen por: `test_`, `temp_`, `tmp_`, `scratch`, `poc_`, `prueba`, `ejemplo`, `sample_`, `demo_`, `hack_`, `untitled`, `new file`, `new_file`, `hello`, `world`, `copy`, `backup`
- Nombres que terminen en: `_test.*`, `_backup.*`, `_copy.*`, `_old.*`, `_v0.*`
- Extensiones: `*.bak`, `*.backup`, `*.orig`, `*.swp`, `*.swo`, `*.tmp`, `*.temp`, `*~`
- Archivos sueltos: `untitled.*`, `nuevo.*`, `borrador.*`, `draft.*`

### 2.3 Exclusiones (no tocar nunca)

- `node_modules/**`, `.git/**`, `dist/**`, `.astro/**`, `.env*`
- `.tools/**` (gestionado por la skill archify)
- `public/gallery/**` (la IA no debe mover nada aquí; son assets de proyectos)
- `.agents/skills/**` (la propia skill y sus姐妹s)
- `package.json`, `package-lock.json`, `tsconfig.json`, `astro.config.mjs`, `tailwind.config.mjs`, `.gitignore`, `.prettierrc`, `.prettierignore`, `.nvmrc`, `LICENSE`, `README.md`

## 3. Categorías y destinos

| Categoría    | Destino                 | Patrones que mapean                                          |
| ------------ | ----------------------- | ------------------------------------------------------------ |
| `logs`       | `.files-ia/logs/`       | Todos los del §2.1                                           |
| `components` | `.files-ia/components/` | `prueba*`, `ejemplo*`, `test_*`, `sample_*` dentro de `src/` |
| `misc`       | `.files-ia/misc/`       | Todo lo demás del §2.2                                       |

Crea las subcarpetas con `New-Item -ItemType Directory -Force` antes del primer movimiento.

## 4. Procedimiento obligatorio

1. **Dry-run primero.** Recorre el árbol con `Get-ChildItem -Force -Recurse` filtrando por los patrones del §2, aplicando exclusiones del §2.3. No escribas nada todavía.
2. **Construye una tabla** con columnas: `Origen (ruta relativa)`, `Tamaño`, `Categoría`, `Tracked (sí/no)`. Preséntasela al usuario.
3. **Pide confirmación textual** antes de mover. Si hay algún fichero `Tracked = sí`, recuerda explícitamente que se va a usar `git rm --cached` y pide confirmación separada para esa operación destructiva.
4. **Crea** `.files-ia/<categoría>/` si no existe.
5. **Mueve** cada fichero con `Move-Item -Force`. Si el destino ya existe, añade sufijo `-<n>` (p. ej. `build-fase1-2.log`) y pregunta al usuario qué versión conservar.
6. **Para ficheros tracked**, ejecuta `git rm --cached <ruta>` SOLO tras confirmación explícita del usuario en este turno. Muestra el comando exacto, la ruta afectada y el nivel de riesgo (irreversible solo en el árbol, recuperable con `git checkout HEAD -- <ruta>`).
7. **Asegura** que `.files-ia/` está en `.gitignore`. Si no, añade la línea `# IA working artefacts (movidos y nunca trackeados)` seguida de `.files-ia/`.
8. **Verifica** con `git status --short` y reporta: cuántos ficheros se movieron, cuántos están aún sin trackear (que ya no deberían aparecer en la lista de IA), si hay tracked que requieren commit del borrado.
9. **Manejo de bloqueos**: durante los movimientos del paso 5, si algún `Move-Item` falla por bloqueo del sistema de archivos, capturar el nombre del fichero, continuar con el resto (no abortar), y reportar al final la lista de bloqueados. Sugerir al usuario cerrar el dev server / IDE / watcher que esté bloqueando los ficheros antes de reintentar.

## 5. Reglas de seguridad

- **Nunca borrar**, siempre mover. El usuario decide luego si vacía `.files-ia/`.
- **Nunca sobreescribir** sin confirmación.
- **Nunca** ejecutar `git rm --cached` sin confirmación explícita en el turno actual, aunque el usuario haya aprobado un plan anterior.
- Si el dry-run devuelve > 20 ficheros o cualquier tracked, pide confirmación SIEMPRE.
- Si el destino `.files-ia/` ya contiene un fichero con el mismo nombre, **no** sobreescribir — añadir sufijo `-<n>` y avisar.
- Los movimientos no son destructivos (se pueden deshacer con `mv` inverso desde `.files-ia/`), pero `git rm --cached` sí modifica el índice → pedir consentimiento.
- **Ficheros bloqueados durante el movimiento**: si `Move-Item` falla con un error tipo _"el proceso no puede obtener acceso al archivo porque está siendo utilizado en otro proceso"_ (típico cuando el dev server de Astro, el IDE o un watcher tiene el log abierto), **NO abortar la operación**. Registrar el nombre del fichero bloqueado en el reporte, continuar con el resto de movimientos, y dejar el fichero bloqueado en su ubicación original para un reintento manual posterior (tras cerrar los procesos que lo bloquean). En el resumen final, listar explícitamente los bloqueados para que el usuario sepa cuáles reintentar.

## 6. Mantenimiento

- Para añadir un nuevo patrón: editar §2.1 o §2.2 según el ámbito (raíz o recursivo).
- Para excluir una nueva ruta: añadir glob a §2.3.
- Bumpear `version` en el frontmatter ante cualquier cambio.
- No añadir dependencias externas: la skill usa solo PowerShell nativo (`Get-ChildItem`, `Move-Item`, `Test-Path`, `git`).
