# 🎀 TU MANGA - GUÍA de instalación y uso

## 📋 Resumen

Tu aplicación **TU MANGA** es una web estática compatible con GitHub Pages. Los colores son **rosado y blanco**, y el login funciona con **Firebase Auth** usando email/contraseña y Google.

---

## 1️⃣ PASO UNO: Verificar Firebase Auth

La app ya incluye la configuración de Firebase en `app.js`.

Si quieres usar tu propio proyecto de Firebase:
1. Abre `app.js`
2. Reemplaza el objeto `firebaseConfig` con los datos de tu proyecto
3. Guarda y recarga la app

---

## 2️⃣ PASO DOS: Habilitar Google Sign-In en Firebase

Para permitir el inicio de sesión con Google:
1. Abre la consola de Firebase: `https://console.firebase.google.com`
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Método de inicio de sesión**
4. Activa **Google**
5. Guarda los cambios

---

## 3️⃣ PASO TRES: Probar localmente

### Opción A: Live Server (VS Code)
1. Haz clic derecho en `index.html`
2. Selecciona **Open with Live Server**
3. Abre la URL que se abra en el navegador

### Opción B: Python
```bash
cd "c:\Users\Rui\TU MANGA"
python -m http.server 8000
```
Luego abre `http://localhost:8000`

---

## 4️⃣ PASO CUATRO: Probar login

1. Abre la app en el navegador
2. Haz clic en **Entrar o crear cuenta**
3. Usa email/contraseña o **Continuar con Google**
4. Si usas el admin, entra con `richardalexanderdiaz0@gmail.com`

### Admin
Solo la cuenta `richardalexanderdiaz0@gmail.com` ve el botón **Mi estudio**.

---

## 5️⃣ PASO CINCO: Publicar en GitHub Pages

### Opción A: GitHub Desktop
1. Abre GitHub Desktop
2. Selecciona tu carpeta local `c:\Users\Rui\TU MANGA`
3. Publica el repositorio

### Opción B: Línea de comandos
```bash
cd "c:\Users\Rui\TU MANGA"
git init
git add .
git commit -m "Deploy TU MANGA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/TU-MANGA.git
git push -u origin main
```

### Configurar GitHub Pages
1. En GitHub, ve a **Settings**
2. Selecciona **Pages**
3. Elige la rama **main** y la carpeta `/ (root)**`
4. Guarda
5. La app estará disponible en `https://YOUR_USERNAME.github.io/TU-MANGA/`

---

## 🎨 Colores de la app

- **Primario**: Rosa (#ff1493, #ff69b4)
- **Secundario**: Blanco (#fff, #fafafa)
- **Texto**: Gris oscuro y neutro

---

## 🔑 Características implementadas

- Login/registro con email/contraseña
- Inicio de sesión con Google
- Panel de administrador visible solo para `richardalexanderdiaz0@gmail.com`
- Navegación entre secciones de mangas
- Filtros y búsqueda de obras
- Lector de capítulos
- Diseño responsive y rosa/blanco

---

## 📁 Archivos principales

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Estructura HTML |
| `styles.css` | Estilos visuales |
| `app.js` | Lógica de la app y Firebase Auth |

---

## 🆘 Troubleshooting

### No se carga la app
- Revisa la consola del navegador (F12)
- Verifica que `app.js` no tenga errores en la consola

### Login no funciona
- Asegúrate de haber habilitado Google en Firebase
- Si usas email/contraseña, revisa que el email sea válido
- Prueba con una ventana de incógnito

### No aparece el panel admin
- Solo `richardalexanderdiaz0@gmail.com` puede verlo
- Cierra sesión y vuelve a iniciar con ese correo

---

## 🚀 Listo

Tu app **TU MANGA** ya está configurada para funcionar como sitio estático con Firebase Auth. ¡Disfruta de la experiencia rosa/blanca! 🎀
