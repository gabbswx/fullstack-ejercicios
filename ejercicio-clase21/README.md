# 🔔 Ejercicio Notificaciones en Tiempo Real

Este proyecto consta de dos partes:

* `my-backend` → API y WebSockets en **NestJS**.
* `my-frontend` → Cliente web en **Vite (HTML/JS/TS)**.

---

## 🚀 Requisitos previos

* Node.js
* pnpm
* serve


---

# 🛠 Instalación y ejecución

## 📌 Backend (`my-backend`)

1. Entrá a la carpeta:

```bash
cd my-backend
```

2. Instalá dependencias:

```bash
pnpm install
```

3. Corré el servidor:

```bash
node dist/main.js
```

➡️ El backend queda corriendo en: `http://localhost:3000`

---

## 📌 Frontend (`my-frontend`)

1. Entrá a la carpeta:

```bash
cd my-frontend
```

2. Instalá dependencias:

```bash
pnpm install
```

3. Corré en modo desarrollo:

```bash
pnpm run dev
```

➡️ El cliente queda disponible en: `http://localhost:5173`

✅ Si querés generar una versión de producción:

```bash
pnpm run build
```

Luego serví la carpeta `/dist` con cualquier servidor estático, por ejemplo:

```bash
serve dist
```
➡️ Esto levanta un servidor en http://localhost:38949 ya que Node ocupa el 3000, pero en caso de que se encuentre disponible, se levanta en http://localhost:3000

---

# 💡 Características principales

* Conexión de usuarios a través de **WebSockets (Socket.io)**.
* Envío de notificaciones individuales o globales.
* Actualización en tiempo real de notificaciones y contador.
* Persistencia de notificaciones en memoria.

---

# 📋 Notas

* Si querés cambiar el puerto o la URL del backend, podés configurarlo en el `.env` de `my-frontend` y en el cliente JS.
* Actualmente, el backend usa almacenamiento en memoria (se pierde al reiniciar).

---
