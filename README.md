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

- **Autenticación**: login/registro de usuarios (Firebase Auth + fallback local con `localStorage`).
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

- La configuración de Firebase incluida en `index.html` (`apiKey`, `projectId`, etc.) corresponde a las credenciales **públicas de cliente Web** de Firebase — esto es normal y no representa una clave secreta filtrada. La seguridad real depende de las **reglas de Firestore/Auth** configuradas en la consola de Firebase del proyecto `app-happybeat`. Se recomienda revisarlas antes de seguir desarrollando.
- Hay una URL de ejemplo para un mapa estático (Geoapify) con el placeholder `YOUR_API_KEY_HERE` — no es una clave real, hay que reemplazarla si se quiere activar esa funcionalidad de mapa.

## 🗺️ Próximos pasos sugeridos

- [ ] Revisar y ajustar las reglas de seguridad de Firebase/Firestore.
- [ ] Decidir si se migra a un proyecto con build (Vite/Next.js) para mejor mantenibilidad, o se mantiene como HTML único.
- [ ] Agregar clave real de Geoapify (o cambiar de proveedor de mapas) para activar el Eco-Mapa en vivo.
- [ ] Definir mejoras/modificaciones puntuales a implementar.

---

*Repositorio recreado y respaldado con la ayuda de Kiro a partir del sitio en producción, el 25 de julio de 2026.*
