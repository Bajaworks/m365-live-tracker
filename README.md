# m365-live-tracker — Level Up Habit Tracker 🚀

[![Repository](https://img.shields.io/badge/GitHub-Bajaworks%2Fm365--live--tracker-blue?logo=github)](https://github.com/Bajaworks/m365-live-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20SPA%20%7C%20PWA-cyan)](#)
[![Design](https://img.shields.io/badge/UI-Dark%20Glassmorphism-purple)](#)
[![Persistence](https://img.shields.io/badge/Storage-LocalStorage%20(Offline--First)-emerald)](#)

> **Bajaworks Digital Workplace & IA**  
> Repositorio oficial: **[https://github.com/Bajaworks/m365-live-tracker.git](https://github.com/Bajaworks/m365-live-tracker.git)**

Aplicación web moderna y dinámica orientada a jóvenes, estudiantes, creadores y profesionales que buscan construir constancia y superación diaria. Desarrollada con arquitectura frontend pura (Single Page Application sin dependencias de backend), estética premium de **Dark Glassmorphism**, motor determinístico de **cálculo de rachas continuas**, **insignias gamificadas** de hitos y persistencia autónoma en el almacenamiento local del navegador (`localStorage`).

---

## 🎯 Demostración en Vivo y Acceso Rápido

El servidor HTTP local integrado se encuentra configurado para servir la aplicación en:

```bash
# Iniciar el servidor web local integrado
node apps/habit-tracker/serve.js
```

👉 **URL de la aplicación:** [http://localhost:5173](http://localhost:5173) (o `http://127.0.0.1:5173`)

> [!TIP]
> Al ingresar por primera vez, la aplicación auto-inyecta un catálogo de **6 hábitos semilla vivos** con historial de días recientes para que puedas interactuar de inmediato con el dashboard, los filtros y las insignias desbloqueadas.

---

## ✨ Características y Capacidades

### 1. 📊 Dashboard Analítico y Medidor Circular Reactivo
- **Anillo de progreso SVG animado:** Refleja en tiempo real el porcentaje de cumplimiento de las metas del día.
- **Microtextos motivacionales dinámicos:** Mensajes inspiradores que evolucionan según el porcentaje alcanzado (*"¡Todo gran viaje comienza con el primer paso!"*, *"¡Estás ganando impulso!"*, *"¡Día Perfecto!"*).
- **Gráfica semanal (últimos 7 días):** Historial visual de barras para evaluar la constancia semanal día a día.
- **Métricas consolidadas:** Contador de hábitos activos, hábitos en racha activa y récord histórico máximo.

### 2. 🔥 Check-ins Instantáneos y Motor de Rachas
- **Interacción fluida:** Botón de check-in con animación de pulso y resplandor esmeralda.
- **Algoritmo determinístico de continuidad:**
  - Si completas hoy y ayer: incrementa la racha actual en +1 día.
  - Si hoy está pendiente pero ayer se marcó: la racha se preserva activa hasta el fin del día.
  - Si transcurrieron 2 o más días: la racha se reinicia de forma limpia a 1 al marcar hoy.
  - `longestStreak` preserva el récord histórico alcanzado sin perderse.
- **Soporte de corrección (Toggle):** Puedes desmarcar un check-in completado para revertir errores accidentales.

### 3. ✍️ Gestión Completa de Hábitos (CRUD)
- **Modal interactivo Glassmorphism:** Ventana con efecto de desenfoque (`backdrop-filter: blur(12px)`) y atajos de teclado (`Esc` para cerrar).
- **6 Categorías estándar:**
  - 📚 **Estudio:** Azul eléctrico (`#4facfe`)
  - 🏋️ **Fitness:** Naranja fuego (`#ff4e50`)
  - 🥗 **Salud:** Verde esmeralda (`#10b981`)
  - ⚡ **Productividad:** Ámbar dorado (`#f59e0b`)
  - 🎨 **Contenido:** Magenta neón (`#e100ff`)
  - 🧠 **Mentalidad:** Cian eléctrico (`#00f2fe`)
- **Frecuencia configurable:** Diaria, Días laborales (Lun-Vie) o Fines de semana (Sáb-Dom).
- **Paleta de identidad:** 7 colores neón personalizables.
- **Eliminación protegida:** Confirmación visual previa para evitar pérdida accidental.

### 4. 🔍 Búsqueda y Filtros Cruzados
- Buscador reactivo por palabra clave en tiempo real (nombre y descripción).
- Píldoras de filtrado por categoría temática con contador de hábitos por área.
- Filtros por estado: *Todos*, *⏳ Pendientes*, *✅ Completados* y *🔥 En Racha*.
- Estado vacío amigable cuando no hay resultados, con botón de un clic para limpiar filtros.

### 5. 🏆 Galería de Insignias y Logros Gamificados
- Hitos de constancia desbloqueables automáticamente:
  - 🌟 **Primer Paso:** 1 día completado.
  - 🔥 **En Llamas:** 3 días consecutivos de racha.
  - ⚡ **Imparable:** 7 días consecutivos.
  - 🏆 **Hábito de Hierro:** 21 días (hábito consolidado).
  - 👑 **Maestría Total:** 30 días de disciplina continua.
- Las insignias bloqueadas permanecen en escala de grises translúcida; las desbloqueadas se iluminan con gradiente y resplandor.

### 6. 🔒 Privacidad Total y Persistencia Local
- Cero recolección de datos y cero llamadas a servidores externos.
- Almacenamiento local mediante `localStorage` (`levelup_habits_v1`).
- Botón **"Reiniciar Demo"** en el encabezado para restablecer los datos de fábrica cuando se desee reiniciar la prueba.

---

## 📁 Estructura del Repositorio

```text
m365-live-tracker/
├── apps/
│   └── habit-tracker/              # Código fuente de Level Up Habit Tracker
│       ├── index.html              # SPA entrypoint HTML5
│       ├── serve.js                # Servidor HTTP local (Node.js nativo)
│       ├── src/
│       │   ├── app.js              # Bootstrap y orquestador reactivo
│       │   ├── components/
│       │   │   ├── Header.js       # Encabezado, branding y botones globales
│       │   │   ├── Dashboard.js    # Medidor circular SVG, microcopia y gráfica 7d
│       │   │   ├── SearchFilterBar.js # Buscador textual y filtros cruzados
│       │   │   ├── HabitCard.js    # Tarjeta de hábito y acciones de edición/borrado
│       │   │   ├── CheckInButton.js # Botón interactivo de check-in con toggle
│       │   │   ├── HabitModal.js   # Modal interactivo para crear/editar hábitos
│       │   │   └── BadgeGallery.js # Galería de hitos e insignias desbloqueables
│       │   ├── data/
│       │   │   └── seedHabits.js   # Catálogo semilla inicial y categorías
│       │   ├── services/
│       │   │   ├── storage.js      # Servicio de persistencia y event bus
│       │   │   └── streakEngine.js # Motor determinístico de rachas e hitos
│       │   └── styles/
│       │       └── theme.css       # Sistema de diseño Glassmorphism y tokens neón
│       └── tests/
│           ├── storage.test.js     # Pruebas de persistencia y serialización
│           ├── streakEngine.test.js # Pruebas unitarias del motor de rachas
│           └── sprint3.test.js     # Pruebas de integración de dashboard y filtros
├── spec-kit/input/                 # Artefactos de especificación (PRD, specs, epics)
├── planning/                       # Planificación y seguimiento de sprints
├── package.json                    # Configuración del paquete y scripts
└── README.md                       # Documentación principal del repositorio
```

---

## 🛠️ Instalación y Uso Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Bajaworks/m365-live-tracker.git
cd m365-live-tracker
```

### 2. Ejecutar la aplicación
```bash
node apps/habit-tracker/serve.js
```
Abre en tu navegador: **`http://localhost:5173`**

*(También puedes abrir directamente `apps/habit-tracker/index.html` en tu navegador sin necesidad de servidor).*

---

## 🧪 Ejecución de Pruebas Automatizadas

La suite de pruebas unitarias y de integración cubre todas las funcionalidades críticas:

```bash
# 1. Pruebas de Persistencia, LocalStorage y Seed Data (Sprint 1)
node apps/habit-tracker/tests/storage.test.js

# 2. Pruebas del Motor de Rachas y Check-ins Consecutivos (Sprint 2)
node apps/habit-tracker/tests/streakEngine.test.js

# 3. Pruebas de Integración de Dashboard, Filtros y Badges (Sprint 3)
node apps/habit-tracker/tests/sprint3.test.js
```

---

## 📜 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más información.

Desarrollado por **[Bajaworks](https://github.com/Bajaworks)**.
