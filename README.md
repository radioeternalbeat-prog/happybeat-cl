# Happy Beat CL — Ruta Cero 🌱🎧

> Rhythm for a Greener Tomorrow

Respaldo del código fuente de la aplicación **Happy Beat CL**, recuperado desde el despliegue en producción en Netlify: https://happybeat-cl.netlify.app/

## 📌 Contexto de este repositorio

Este proyecto fue originalmente creado con **Antigravity**, pero el respaldo local original se perdió junto con el disco externo donde estaba guardado. Este repositorio fue reconstruido a partir del **código servido en producción** (el bundle final que corre en el navegador), ya que no existía otra copia disponible.

Esto significa:
- El código funciona exactamente igual que la app en vivo (es el mismo que se está sirviendo ahora en Netlify).
- Puede que la organización original en componentes/carpetas del proyecto de desarrollo (en Antigravity) fuera distinta — aquí todo el frontend vive en un único `index.html`, tal como Netlify lo entrega al navegador.
- A partir de aquí se puede seguir modificando y mejorando de forma segura, con historial en Git.

## 🧱 Stack técnico

- **React 18** (vía CDN, sin build step) + **Babel Standalone** para JSX en el navegador.
- **Tailwind CSS v4** (vía CDN, `@tailwindcss/browser`).
- **Firebase** (Auth + Firestore) como backend — proyecto `app-happybeat`.
- **PWA**: `manifest.json` + `sw.js` (service worker) para instalación e ícono en dispositivos móviles.
- Fuente: Plus Jakarta Sans (Google Fonts).

## 📁 Estructura

```
├── index.html       # App completa (UI, lógica, componentes React, estilos)
├── manifest.json     # Configuración de la PWA (nombre, íconos, colores)
├── sw.js              # Service worker (cache offline básico)
├── icon-192.png       # Ícono PWA 192x192
└── icon-512.png       # Ícono PWA 512x512
```

## ✨ Funcionalidades principales (detectadas en el código)

- **Autenticación**: login/registro de usuarios con email y contraseña, y login real con **Google** (Firebase Auth, `signInWithPopup` + `GoogleAuthProvider`), más fallback local con `localStorage`. El botón de "Apple" se eliminó: no está configurado como proveedor en Firebase Authentication (requiere cuenta de Apple Developer de pago).
- **Dashboard** principal con estadísticas.
- **Eco-Mapa**: puntos sostenibles cercanos (puntos limpios, ciclovías, estaciones de carga EV).
- **Tracker**: registro de actividades sostenibles.
- **Sync Hub / Rewards**: sistema de puntos ("Beatcoins") y canje de recompensas.
- **Perfil de Empresa / Portal de Negocios**: para cuentas tipo `business`.
- **Feed Social** de la comunidad.
- **Panel de Administración** (rol `admin`).
- Notificaciones locales/push del navegador.
- Confetti y animaciones de gamificación (insignias, racha, etc.).

## ⚙️ Cómo correr el proyecto localmente

No requiere build ni instalación de dependencias (no usa `npm`/`node_modules`), es HTML estático:

```bash
# Opción simple: servidor estático de Python
python3 -m http.server 8080

# Luego abre http://localhost:8080
```

> ⚠️ El registro del Service Worker (`/sw.js`) requiere HTTPS o `localhost` para funcionar correctamente.

## ☁️ Despliegue

El sitio está desplegado en **Netlify**: https://happybeat-cl.netlify.app/

Para reconectar este repo a Netlify (deploy automático en cada push):
1. Entra a tu dashboard de Netlify → "Add new site" → "Import an existing project".
2. Conecta este repositorio de GitHub.
3. Build command: *(ninguno, dejar vacío)*.
4. Publish directory: `/` (raíz del repo).

## 🔐 Notas de seguridad

- La configuración de Firebase incluida en `index.html` (`apiKey`, `projectId`, etc.) corresponde a las credenciales **públicas de cliente Web** de Firebase — esto es normal y no representa una clave secreta filtrada. La seguridad real depende de las **reglas de Firestore/Auth** configuradas en la consola de Firebase del proyecto `app-happybeat`.
- Hay una URL de ejemplo para un mapa estático (Geoapify) con el placeholder `YOUR_API_KEY_HERE` — no es una clave real, hay que reemplazarla si se quiere activar esa funcionalidad de mapa.

### Reglas de Firestore (`firestore.rules`)

El proyecto `app-happybeat` es compartido con otras apps/servicios (colecciones `licenses`, `enlista`, `portfolio`), que se dejaron intactas. Se agregó la regla faltante para la colección `users` que usa Happy Beat CL — antes no existía ninguna regla para esa ruta, por lo que Firestore denegaba **todo** acceso por defecto (comportamiento seguro, pero significaba que la sincronización en la nube nunca funcionó; la app solo persistía datos en `localStorage`).

El contenido completo y actualizado de las reglas vive en [`firestore.rules`](./firestore.rules) en este repo, como referencia versionada. **Para que tenga efecto real, debe copiarse manualmente en la consola de Firebase:**

1. Entra a https://console.firebase.google.com/project/app-happybeat/firestore/rules
2. Reemplaza el contenido del editor por el de [`firestore.rules`](./firestore.rules).
3. Click en "Publicar" (Publish).

Con esta regla, cada usuario autenticado solo puede leer/escribir su propio documento en `/users/{email}` — nadie puede ver ni modificar el perfil de otro usuario.

⚠️ **Pendiente de revisión (fuera del alcance de Happy Beat CL, pero visible en el mismo proyecto Firebase):** las colecciones `licenses` y `enlista`/`portfolio` permiten lectura y/o escritura pública sin autenticación (`allow read, write: if true`). Como la API key del proyecto es pública (embebida en el HTML de Happy Beat CL), cualquiera con esa key podría leer/escribir esas colecciones también. Si contienen datos sensibles o de otro producto en producción, conviene revisarlas por separado.

## 🗺️ Próximos pasos sugeridos

- [x] Revisar y ajustar las reglas de seguridad de Firebase/Firestore para `users` (ver `firestore.rules`).
- [ ] Revisar por separado las reglas de `licenses`, `enlista` y `portfolio` (pertenecen a otros proyectos, no a Happy Beat CL).
- [ ] Confirmar métodos de inicio de sesión habilitados en Firebase Auth (Email/Password, Google, Apple).
- [ ] Decidir si se migra a un proyecto con build (Vite/Next.js) para mejor mantenibilidad, o se mantiene como HTML único.
- [ ] Agregar clave real de Geoapify (o cambiar de proveedor de mapas) para activar el Eco-Mapa en vivo.
- [ ] Definir mejoras/modificaciones puntuales a implementar.

---

*Repositorio recreado y respaldado con la ayuda de Kiro a partir del sitio en producción, el 25 de julio de 2026.*
