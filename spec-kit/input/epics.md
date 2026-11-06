---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-06T05:37:00Z'
agent_roles: 'engineering-software-architect + engineering-frontend-developer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
---

# Epics — Level Up Habit Tracker

## Visión General de Épicas

El desarrollo de **Level Up Habit Tracker** se organiza en 5 épicas estructuradas para permitir entregas incrementales y testeables desde el día 1:

| Epic ID | Nombre | Descripción | Historias Asociadas |
|---|---|---|---|
| **EP-01** | **Arquitectura Base, Tokens Visuales & Persistencia** | Andamiaje de la aplicación, sistema de diseño Glassmorphism oscuro, capa de almacenamiento en LocalStorage y carga de datos semilla. | S-06, S-07 |
| **EP-02** | **Gestión Integral de Hábitos (CRUD)** | Formulario modal y componentes para crear, editar, listar y eliminar hábitos con validación y taxonomía temática. | S-02 |
| **EP-03** | **Check-in Diario y Motor de Rachas** | Algoritmo determinístico de rachas, botón de marcado interactivo con feedback visual y registro de historial. | S-03 |
| **EP-04** | **Dashboard de Métricas y Gamificación Visual** | Medidor circular de progreso del día, resumen de los últimos 7 días, microtextos motivacionales y galería de insignias de hitos. | S-01, S-05 |
| **EP-05** | **Búsqueda, Filtros Avanzados y Pulido Responsive** | Búsqueda reactiva, filtros por categoría y estado de racha, estados vacíos, accesibilidad y experiencia móvil. | S-04, S-07 |

---

## Detalle de Épicas

### EP-01 — Arquitectura Base, Tokens Visuales & Persistencia
- **Objetivo:** Establecer los cimientos visuales y de datos de la aplicación.
- **Alcance:**
  - Setup del proyecto frontend SPA.
  - Implementación del sistema de diseño Glassmorphism oscuro (variables CSS, blur, gradientes neón, tipografía Inter).
  - Servicio `LocalStorageAdapter` con serialización, control de versiones y fallback resiliente.
  - Inyección de datos semilla representativos (`seedHabits`) para arranque inmediato.

### EP-02 — Gestión Integral de Hábitos (CRUD)
- **Objetivo:** Permitir al usuario organizar sus hábitos cotidianos con riqueza visual.
- **Alcance:**
  - Tarjeta de hábito (`HabitCard`) con indicación de categoría, color temático e ícono.
  - Modal interactivo para crear y modificar hábitos con validaciones en cliente.
  - Confirmación de eliminación segura.

### EP-03 — Check-in Diario y Motor de Rachas
- **Objetivo:** Crear una experiencia de registro diario sumamente satisfactoria y libre de errores temporales.
- **Alcance:**
  - Botón de check-in circular con microinteracción visual (destello, pulso y sonido/vibración visual).
  - Algoritmo de cálculo de racha actual (`currentStreak`) y récord histórico (`longestStreak`).
  - Capacidad de revertir el check-in en caso de error involuntario.

### EP-04 — Dashboard de Métricas y Gamificación Visual
- **Objetivo:** Motivar e incentivar el cumplimiento continuo mediante métricas claras e insignias.
- **Alcance:**
  - Medidor de progreso diario en SVG circular con porcentaje animado.
  - Frases dinámicas según el % completado.
  - Gráfica de barras de cumplimiento semanal (últimos 7 días).
  - Sistema de insignias de hito desbloqueables (1, 3, 7, 21, 30 días) con distinción visual entre activas y bloqueadas.

### EP-05 — Búsqueda, Filtros Avanzados y Pulido Responsive
- **Objetivo:** Garantizar que encontrar hábitos sea instantáneo y que la app brille en móviles y escritorio.
- **Alcance:**
  - Filtro por texto en tiempo real con debounce.
  - Píldoras de filtrado por categoría temática y por estado (todos, pendientes, completados, en racha).
  - Estados vacíos ilustrados y responsive design touch-first en smartphones.
