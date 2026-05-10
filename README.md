# TU MANGA

Aplicación web estática para leer MANHWAs, CÓMICS y MANGAs con autenticación Firebase.

## Estructura
- `index.html`: interfaz principal y pantallas de navegación.
- `styles.css`: estilos rosados/blancos y diseño responsive.
- `app.js`: lógica de navegación, búsqueda, lector y autenticación con Firebase.

## Configuración
1. El proyecto ya incluye la configuración de Firebase en `app.js`.
2. Si quieres usar tu propio proyecto, reemplaza `firebaseConfig` en `app.js`.
3. Sube los archivos a GitHub Pages.

## Uso
- La página de inicio muestra secciones: `AÑADIDOS RECIENTEMENTE`, `PRÓXIMAMENTE`, `ACTUALIZACIONES DIARIAS`, `TÍTULOS EN TENDENCIA`, `CÓMICS Y MANHWAS`, `TERMINADOS` y `COMICS/MANHWAS/MANGAS TERMINADOS`.
- `CÓMICS Y MANHWAS` abre el filtro y el buscador.
- Autenticación por email/contraseña y Google sign-in.
- El administrador `richardalexanderdiaz0@gmail.com` puede acceder al panel de estudio.

## Notas
- La app es estática; solo requiere Firebase Auth para login.
- El usuario administrador visible solo con `richardalexanderdiaz0@gmail.com`.
- Protege datos sensibles en un entorno real usando variables de entorno o un backend.
