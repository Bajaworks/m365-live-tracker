---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-06T05:37:00Z'
agent_roles: 'engineering-software-architect + engineering-frontend-developer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
---

# Technical Specification — Level Up Habit Tracker

## 1. Arquitectura del Sistema

**Level Up Habit Tracker** es una Single Page Application (SPA) cliente pura, modular y reactiva. Su arquitectura sigue una separación estricta de responsabilidades en tres capas:

```
┌────────────────────────────────────────────────────────┐
│                   Presentación (UI)                    │
│   Dashboard · HabitList · HabitCard · HabitModal       │
│   BadgeGallery · SearchFilterBar · WeeklyProgressChart │
└───────────────────────────▲────────────────────────────┘
                            │ Estado / Eventos
┌───────────────────────────┴────────────────────────────┐
│               Lógica de Negocio (Core)                 │
│   HabitService · StreakCalculator · StatsCalculator    │
│   MotivationalEngine · BadgeEvaluator                  │
└───────────────────────────▲────────────────────────────┘
                            │ I/O
┌───────────────────────────┴────────────────────────────┐
│               Persistencia (Storage Layer)             │
│   LocalStorageAdapter · SeedDataLoader · SchemaMigrator│
└────────────────────────────────────────────────────────┘
```

## 2. Stack Tecnológico Seleccionado

- **Lenguaje:** TypeScript / JavaScript moderno (ES2022+).
- **Estructura UI:** HTML5 semántico con Web Components / Vanilla Modular o React/Vite ligero (cero dependencias pesadas de terceros para asegurar portabilidad y rendimiento extremo).
- **Estilos:** CSS3 nativo con Variables CSS (Custom Properties), soporte para `backdrop-filter: blur()`, CSS Grid, Flexbox y animaciones GPU (`transform`, `opacity`).
- **Tipografía:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- **Iconografía:** SVGs inline optimizados para íconos de categorías, fuego, checks y trofeos.
- **Entorno de Desarrollo:** Servidor HTTP local estándar (p. ej. Vite o Live Server).

## 3. Sistema de Diseño Glassmorphism & Tokens de Color

### Variables CSS Fundamentales
```css
:root {
  /* Fondos y Capas */
  --bg-primary: #0a0e17;
  --bg-surface: rgba(18, 24, 38, 0.7);
  --bg-surface-hover: rgba(28, 36, 56, 0.85);
  --bg-glass-card: rgba(255, 255, 255, 0.04);
  --bg-glass-modal: rgba(13, 18, 30, 0.85);

  /* Bordes y Reflejos */
  --border-glass: rgba(255, 255, 255, 0.1);
  --border-glass-bright: rgba(255, 255, 255, 0.25);
  --glass-blur: blur(16px);

  /* Acentos de Color Gamificados */
  --accent-cyan: #00f2fe;
  --accent-blue: #4facfe;
  --accent-purple: #7f00ff;
  --accent-violet: #e100ff;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-fire: #ff4e50;

  /* Gradientes */
  --grad-streak: linear-gradient(135deg, #ff4e50 0%, #f9d423 100%);
  --grad-cyan-purple: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  --grad-emerald: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --grad-card-glow: radial-gradient(circle at 50% 0%, rgba(79, 172, 254, 0.15), transparent 70%);

  /* Tipografía y Textos */
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --font-family: 'Inter', system-ui, sans-serif;

  /* Sombras y Glows */
  --glow-streak: 0 0 20px rgba(255, 78, 80, 0.35);
  --glow-cyan: 0 0 20px rgba(0, 242, 254, 0.25);
  --shadow-card: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

## 4. Algoritmo de Cálculo de Rachas (Streak Engine)

El cálculo de rachas opera bajo una función pura determinística que recibe el historial de fechas completadas (`completedDates`) y la fecha actual de referencia (`todayIso`).

### Especificación Formal del Algoritmo:
1. Normalizar todas las fechas al formato ISO `YYYY-MM-DD` en la zona horaria local.
2. Eliminar duplicados y ordenar cronológicamente de forma descendente (`d[0]` es la más reciente).
3. Determinar `today` y `yesterday`:
   ```javascript
   function calculateStreaks(completedDates, todayStr) {
     const set = new Set(completedDates);
     if (set.size === 0) return { currentStreak: 0, longestStreak: 0 };

     const today = new Date(todayStr);
     const yesterday = new Date(today);
     yesterday.setDate(yesterday.getDate() - 1);
     const yesterdayStr = toDateStr(yesterday);

     let currentStreak = 0;
     let checkDate = new Date(today);

     // Si hoy no está marcado, verificar si ayer lo estuvo para mantener la racha viva
     if (!set.has(todayStr)) {
       if (set.has(yesterdayStr)) {
         checkDate = yesterday;
       } else {
         currentStreak = 0;
       }
     }

     if (set.has(toDateStr(checkDate))) {
       while (set.has(toDateStr(checkDate))) {
         currentStreak++;
         checkDate.setDate(checkDate.getDate() - 1);
       }
     }

     // Longest streak: recorrido sobre el conjunto ordenado de días contiguos
     let longestStreak = currentStreak;
     let tempStreak = 0;
     let prevDate = null;
     const sortedAsc = Array.from(set).sort();

     for (const dStr of sortedAsc) {
       const cur = new Date(dStr);
       if (prevDate) {
         const diffDays = Math.round((cur - prevDate) / (1000 * 60 * 60 * 24));
         if (diffDays === 1) {
           tempStreak++;
         } else if (diffDays > 1) {
           tempStreak = 1;
         }
       } else {
         tempStreak = 1;
       }
       if (tempStreak > longestStreak) longestStreak = tempStreak;
       prevDate = cur;
     }

     return { currentStreak, longestStreak };
   }
   ```

## 5. Esquema de Datos y Persistencia

- **Storage Key:** `levelup_habits_v1`
- **Tolerancia a fallos:** Al cargar, si `JSON.parse` falla o el objeto no cumple el esquema mínimo, se realiza un backup de seguridad en `levelup_habits_backup_error` y se auto-cargan los datos semilla (`seedHabits`).

## 6. Jerarquía de Componentes de la Interfaz

```
[App Container]
  ├── [AppHeader]
  │     ├── Logo & Brand Title ("Level Up")
  │     └── Quick Stats Summary & Reset Seed Button
  ├── [DashboardView]
  │     ├── [HeroProgressMetric] (Circular Progress Bar + Motivational Subtitle)
  │     ├── [MetricsRow] (Active Habits, Completed Today, Fire Streak, Best Streak)
  │     └── [WeeklyOverview] (7-day bar indicators)
  ├── [SearchAndFilterSection]
  │     ├── [SearchBarInput] (Filtro por texto con debounce)
  │     ├── [CategoryFilterPills] (Estudio, Fitness, etc.)
  │     └── [StatusToggleFilters] (Todos / Pendientes / Completados / En Racha)
  ├── [HabitsSection]
  │     ├── [HabitList]
  │     │     └── [HabitCard] x N
  │     │           ├── Checkbox button (Circle with pulse & check icon)
  │     │           ├── Habit Title & Category Badge
  │     │           ├── Streak Counter Badge (🔥 N días)
  │     │           ├── Actions (Edit modal trigger, Delete button)
  │     └── [EmptyState] (Cuando no hay coincidencias)
  ├── [MilestoneBadgesGallery]
  │     └── [BadgeCard] x 5 (1, 3, 7, 21, 30 días)
  └── [HabitFormModal] (Crear / Editar con validación de campos)
```

## 7. Manejo de Rendimiento y Accesibilidad

- **Zero Layout Shifts (CLS = 0):** Espacios reservados para barras de progreso e íconos SVG fijos.
- **Microinteracciones en GPU:** Animaciones de hover con `transform: translateY(-2px)` y `box-shadow` optimizado para evitar re-paints intensivos.
- **Atributos ARIA:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` en botones de check-in y controles modales.
