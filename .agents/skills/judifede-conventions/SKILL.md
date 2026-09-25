---
name: judifede-conventions
description: Convenciones del proyecto judifede-porfolio. Reglas específicas del repo que todos los subagentes deben respetar. Use when working on this repository to ensure consistency with project-specific decisions.
license: MIT
metadata:
  authors: 'judifede'
  version: '0.0.1'
---

# Convenciones del proyecto judifede-porfolio

Reglas específicas de este repo. Son **adiciones** a las skills de framework (astro, nodejs-best-practices, etc.), no sustituciones.

---

## Versiones de dependencias en `package.json`

**Regla absoluta: nunca usar `^` ni `~` en versiones de paquetes.**

- Usar siempre versión exacta: `"astro": "5.7.13"`, NO `"astro": "^5.7.13"`.
- Aplica a `dependencies`, `devDependencies` y `peerDependencies`.
- Esto incluye nuevas instalaciones (`npm install` añade `^` por defecto; hay que editarlo después) y actualizaciones.
- `package-lock.json` queda igual (npm siempre usa versiones exactas en el lockfile).

**Cómo aplicar:**

1. Tras `npm install <paquete>`, editar `package.json` manualmente y quitar el prefijo.
2. Ejecutar `npm install` de nuevo para sincronizar el lockfile si fuera necesario.
3. Verificar con `grep -E '"[^"]+": *"\^|"[^"]+": *"\~' package.json` → debe devolver 0 líneas.

**Por qué:** el proyecto se construye de forma reproducible; cualquier cambio de versión debe pasar por un commit explícito.

---

## Cómo aplicar esta convención al flujo

Cuando cualquier subagente (programmer, general, etc.) vaya a:

- Ejecutar `npm install <paquete>`
- Editar `package.json` o `package-lock.json`
- Proponer actualizaciones de dependencias

Debe:

1. Aplicar la regla de versiones exactas descrita arriba.
2. Si va a delegar a otro subagente, pasarle esta sección como parte del prompt.
3. Reportar en el resumen final: "Versiones exactas verificadas en `package.json`".

---

## Otras convenciones del proyecto

Añadir aquí, en futuras iteraciones, otras reglas específicas que vayamos fijando. Por ahora esta skill solo contiene la regla de versiones.
