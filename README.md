# TU MANGA

Aplicación web estática para leer MANHWAs, CÓMICS y MANGAs conectada a Supabase.

## Estructura
- `index.html`: interfaz principal y pantallas de navegación.
- `styles.css`: estilos y diseño responsive.
- `app.js`: lógica de navegación, búsqueda, detalle, lector y panel de administrador.
- `supabase.js`: inicializa la conexión con Supabase.
- `config.js`: carga URL y anon key de Supabase.

## Configuración
1. Copia `config.example.js` a `config.js`.
2. Ajusta `SUPABASE_URL` y `SUPABASE_ANON_KEY` si lo deseas.
3. Sube los archivos a GitHub Pages.

## Uso
- La página de inicio muestra secciones: `AÑADIDOS RECIENTEMENTE`, `PRÓXIMAMENTE`, `ACTUALIZACIONES DIARIAS`, `TÍTULOS EN TENDENCIA`, `CÓMICS Y MANHWAS`, `TERMINADOS` y `COMICS/MANHWAS/MANGAS TERMINADOS`.
- `CÓMICS Y MANHWAS` abre el filtro y el buscador.
- El administrador `richardalexanderdiaz0@gmail.com` puede acceder al panel de estudio y publicar obras.

## Notas
- Para proteger las claves en un entorno real, mantén `config.js` fuera del control de versiones o utiliza un sistema de build que inyecte variables de entorno.
- El archivo actual `config.js` contiene valores públicos de Supabase para que la app funcione en GitHub Pages.
