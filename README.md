# Level Up Habit Tracker 🚀

> Aplicación web moderna de seguimiento personal de hábitos y superación diaria, con estética Glassmorphism en modo oscuro nativo, motor determinístico de rachas continuas, insignias de logros gamificados y persistencia autónoma en `localStorage`.

Repositorio oficial: [https://github.com/Bajaworks/m365-live-tracker.git](https://github.com/Bajaworks/m365-live-tracker.git)

---

## ✨ Características Principales

1. **Dashboard con Medidor Circular Reactivo:**
   - Visualización instantánea del porcentaje de cumplimiento diario con anillo SVG animado.
   - Microcopia motivacional dinámica adaptada al avance del día (*"¡Estás ganando impulso!"*, *"¡Día Perfecto!"*).
   - Resumen gráfico de barras de los últimos 7 días.
   - Métricas clave: Total de hábitos activos, hábitos con racha activa y récord histórico.

2. **Check-ins Diarios y Motor de Rachas:**
   - Botón interactivo de check-in con animación de pulso y resplandor esmeralda.
   - Cálculo determinístico de racha actual (`currentStreak`) y mejor racha histórica (`longestStreak`).
   - Soporte para desmarcar (toggle) y corregir errores involuntarios sin romper el historial previo.

3. **Gestión Completa de Hábitos (CRUD):**
   - Creación y edición mediante modal glassmorphism con desenfoque de fondo (`backdrop-filter: blur(12px)`).
   - 6 Categorías temáticas: Estudio, Fitness, Salud, Productividad, Contenido y Mentalidad.
   - Frecuencia objetivo: Diaria, Entre semana o Fines de semana.
   - Selector interactivo de 7 colores de acento neón.
   - Confirmación protegida para eliminación de hábitos.

4. **Búsqueda y Filtros Multicriterio:**
   - Búsqueda en tiempo real por texto (nombre y descripción).
   - Píldoras de filtrado por categoría temática con contador dinámico de hábitos.
   - Filtros por estado operativo: *Todos*, *⏳ Pendientes*, *✅ Completados* y *🔥 En Racha*.

5. **Galería de Insignias y Logros Gamificados:**
   - Hitos desbloqueables por racha:
     - 🌟 **Primer Paso:** 1 día completado.
     - 🔥 **En Llamas:** 3 días de racha continua.
     - ⚡ **Imparable:** 7 días consecutivos.
     - 🏆 **Hábito de Hierro:** 21 días (hábito consolidado).
     - 👑 **Maestría Total:** 30 días de disciplina.
   - Distinción visual entre insignias bloqueadas e iluminadas.

6. **Privacidad y Persistencia Local:**
   - Cero dependencias de servidores remotos o bases de datos externas.
   - Serialización resiliente en `localStorage` con recuperación automática y catálogo de datos semilla vivos.
   - Botón de **"Reiniciar Demo"** para restablecer los hábitos de prueba en cualquier momento.

---

## 📂 Estructura del Proyecto

```
apps/habit-tracker/
  ├── index.html                   # Documento SPA principal
  ├── serve.js                     # Servidor HTTP local integrado
  ├── src/
  │   ├── app.js                   # Bootstrap y orquestación de la app
  │   ├── components/
  │   │   ├── Header.js            # Encabezado, marca y botones de acción
  │   │   ├── Dashboard.js         # Medidor circular, microtextos y gráfica 7d
  │   │   ├── SearchFilterBar.js   # Buscador y filtros combinados
  │   │   ├── HabitCard.js         # Tarjeta de hábito y acciones de edición/borrado
  │   │   ├── CheckInButton.js     # Botón interactivo de check-in
  │   │   ├── HabitModal.js        # Formulario modal de creación/edición
  │   │   └── BadgeGallery.js      # Galería de hitos e insignias desbloqueables
  │   ├── data/
  │   │   └── seedHabits.js        # Catálogo de hábitos semilla y categorías
  │   ├── services/
  │   │   ├── storage.js           # Servicio de persistencia en localStorage
  │   │   └── streakEngine.js      # Motor determinístico de rachas e hitos
  │   └── styles/
  │       └── theme.css            # Tokens CSS, glassmorphism, gradientes neón y responsive
  └── tests/
      ├── storage.test.js          # Pruebas de persistencia y serialización
      ├── streakEngine.test.js     # Pruebas unitarias de cálculo de rachas
      └── sprint3.test.js          # Pruebas de integración de dashboard, filtros y badges
```

---

## 🚀 Cómo Ejecutar la Aplicación

### Opción 1: Servidor HTTP Integrado (Recomendado)

```bash
# Ejecutar el servidor web local
node apps/habit-tracker/serve.js
```

Abre tu navegador en:
👉 **[http://localhost:5173](http://localhost:5173)** (o `http://127.0.0.1:5173`)

### Opción 2: Abrir Directamente

Puedes abrir directamente el archivo `apps/habit-tracker/index.html` en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari o Brave).

---

## 🧪 Ejecutar Pruebas Automatizadas

```bash
# Pruebas de Persistencia y LocalStorage (Sprint 1)
node apps/habit-tracker/tests/storage.test.js

# Pruebas del Motor de Rachas (Sprint 2)
node apps/habit-tracker/tests/streakEngine.test.js

# Pruebas de Dashboard, Filtros e Insignias (Sprint 3)
node apps/habit-tracker/tests/sprint3.test.js
```

---

## 📋 Especificaciones y Planeación

El proyecto fue planificado y ejecutado rigurosamente a través del proceso estructurado:
- **Spec Kit:** [spec-kit/input/](spec-kit/input/) (`brief.md`, `PRD.md`, `technical-spec.md`, `api-spec.yaml`, `data-model.md`, `epics.md`, `stories.md`, `sprint-plan.md`, `test-plan.md`).
- **Sprints:** [planning/sprints/](planning/sprints/) (`sprint-01`, `sprint-02`, `sprint-03`).

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
