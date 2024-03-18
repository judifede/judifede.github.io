# astroCV
Porfolio construido con Astro.

![image](https://github.com/judifede/judifede.github.io/assets/9841814/0047d1e2-4353-4273-b807-b6498f7118ce)

Basado en el proyecto de [Midudev](https://github.com/midudev) -> [Proyecto original](https://github.com/midudev/porfolio.dev) 

![image](https://github.com/judifede/judifede.github.io/assets/9841814/dd786d74-c3c9-4f9a-be24-a8d9bf127d23)

## 🚀 Estructura de Astro

Dentro de un proyecto Astro, tendremos las siguientes carpetas y archivos:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro busca archivos `.astro` o `.md` en el directorio `src/pages/`. Cada página se expone como una ruta según su nombre de archivo.

No hay nada especial en `src/components/`, pero ahí es donde se suelen colocar los componentes Astro/React/Vue/Svelte/Preact.

Cualquier activo estático, como imágenes, se suele colocar en el directorio `public/`.

Adicionalmente, Astro dispone de ViewTransitions para animar cuando se cambia de una página a otra, mejorando significativamente la experiencia de usuario.

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, desde una terminal:

| Command                   | Action                                                                        |
| :------------------------ | :---------------------------------------------------------------------------- |
| `npm install`             | Instala dependencias                                                          |
| `npm run dev`             | Inicia el servidor de desarrollo local en `localhost:4321`                    |
| `npm run build`           | Prepara el entorno de producción en `./dist/`                                 |
| `npm run preview`         | Genera una vista previa de la compilación localmente, antes de desplegarla    |
