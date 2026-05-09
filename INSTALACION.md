# 🎀 TU MANGA - GUÍA DE INSTALACIÓN Y CONFIGURACIÓN

## 📋 Resumen

Tu aplicación **TU MANGA** es una web estática compatible con GitHub Pages. Los colores son **rosado y blanco**, el login es completamente funcional con email/contraseña vía Supabase, y los usuarios pueden interactuar sin restricciones.

---

## 1️⃣ PASO UNO: Configurar Supabase (SQL)

Copia TODO el contenido del archivo `auth-setup.sql` y pégalo en el **SQL Editor** de Supabase:

### Ubicación en Supabase:
1. Ve a tu proyecto en `https://app.supabase.com`
2. Navega a **SQL Editor**
3. Click en **New Query**
4. Pega TODO el contenido de `auth-setup.sql`
5. Click en **RUN**
6. Espera a que termine (no debe tomar más de 30 segundos)

### ¿Qué hace el SQL?
- Crea tabla `user_roles` para identificar administrador
- Crea tabla `user_profiles` con datos de usuario
- Crea tabla `manga_reports` para reportes
- Crea tabla `user_chapter_reads` para tracking de lecturas
- Crea tabla `manga_comments` para comentarios
- Crea tabla `notifications` para notificaciones
- Crea triggers automáticos que registran usuarios al autenticarse
- Configura políticas de RLS para seguridad

---

## 2️⃣ PASO DOS: Configurar Email en Supabase

Para que el login con email funcione:

1. Ve a **Authentication** → **Providers**
2. Busca **Email**
3. Asegúrate de que esté **habilitado**
4. Configura **Confirm email** si deseas (es opcional)
5. Guarda los cambios

---

## 3️⃣ PASO TRES: Verificar Claves en `config.js`

Abre el archivo `config.js` y verifica:

```javascript
window.APP_CONFIG = {
  SUPABASE_URL: 'https://aceviynvsorxjpcvjjya.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_K9uWxkrx9zQzhvo9b0m1vw_Z1cQ5Us1vw_Z1cQ5Us1'
};
```

Estas claves **ya están configuradas** para tu proyecto.

---

## 4️⃣ PASO CUATRO: Probar Localmente

Para probar antes de subirlo a GitHub Pages:

### Opción A: Live Server (VS Code)
1. Click derecho en `index.html`
2. Selecciona **Open with Live Server**
3. Se abrirá en `http://localhost:5500`

### Opción B: Python
```bash
cd "c:\Users\Rui\TU MANGA"
python -m http.server 8000
```
Luego abre `http://localhost:8000`

---

## 5️⃣ PASO CINCO: Probar Login

1. Abre la app en el navegador
2. Click en **Entrar / Registro**
3. Ingresa tu correo (ej: `tu_correo@gmail.com`)
4. Click en **Enviar enlace mágico**
5. **Revisa tu correo**
6. Click en el enlace de Supabase
7. ¡Estarás autenticado!

### ¿Cómo ser admin?
Solo la cuenta `richardalexanderdiaz0@gmail.com` es admin. Si la utilizas:
- Se mostrará el botón **Mi estudio**
- Podrás publicar obras
- Los demás usuarios no verán que eres admin

---

## 6️⃣ PASO SEIS: Publicar en GitHub Pages

### Opción A: GitHub Desktop
1. Abre GitHub Desktop
2. Click en **File** → **Add Local Repository**
3. Selecciona `c:\Users\Rui\TU MANGA`
4. Click en **Publish Repository**
5. Asegúrate que el nombre sea `TU-MANGA` (sin espacios)
6. Publica

### Opción B: Línea de comandos
```bash
cd "c:\Users\Rui\TU MANGA"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/TU-MANGA.git
git push -u origin main
```

### Configurar GitHub Pages
1. Ve al repo en GitHub
2. Click en **Settings**
3. Navega a **Pages**
4. En **Source** selecciona **Deploy from a branch**
5. Rama: **main**
6. Carpeta: **/ (root)**
7. Click en **Save**
8. La app estará en: `https://YOUR_USERNAME.github.io/TU-MANGA/`

---

## 🎨 Colores de la App

- **Primario**: Rosa (#ff1493, #ff69b4)
- **Secundario**: Blanco (#fff, #fafafa)
- **Texto**: Gris (#333, #666)

---

## 🔑 Características Implementadas

✅ Login/Registro con email  
✅ Autenticación con Supabase Auth  
✅ Sistema de admin (no visible al usuario)  
✅ Búsqueda y filtros de obras  
✅ Lector de capítulos  
✅ Guardado en biblioteca automático  
✅ Comentarios y reportes  
✅ Notificaciones  
✅ Compartir en WhatsApp  
✅ Panel de publicación (admin)  
✅ Diseño responsivo  
✅ Colores rosado y blanco  

---

## 📱 Archivos Principales

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Estructura HTML |
| `styles.css` | Diseño (rosado/blanco) |
| `app.js` | Lógica JavaScript |
| `supabase.js` | Cliente Supabase |
| `config.js` | Claves de Supabase |
| `auth-setup.sql` | SQL para configurar auth |
| `logo.svg` | Logo de la app |

---

## 🆘 Troubleshooting

### No se carga la app
- Verifica que `config.js` tenga las claves correctas
- Abre la consola del navegador (F12) para ver errores
- Asegúrate que Supabase esté online

### Login no funciona
- Verifica que el proveedor **Email** esté habilitado en Supabase
- Revisa tu correo (a veces va al spam)
- Intenta desde una ventana de incógnito

### Las obras no aparecen
- Asegúrate de que ya hayas insertado datos en la tabla `manga_works`
- O publica una nueva obra como admin

---

## 🚀 ¡Listo!

Tu app **TU MANGA** está completa y funcional. Disfruta del sistema de lectura de MANHWAs, CÓMICS y MANGAs. 🎀
