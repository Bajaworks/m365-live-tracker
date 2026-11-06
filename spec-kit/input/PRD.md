---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-06T05:37:00Z'
agent_roles: 'engineering-software-architect + engineering-frontend-developer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
---

# Product Requirements Document (PRD) — Level Up Habit Tracker

## 1. Visión y Propósito del Producto

**Level Up Habit Tracker** es una Progressive Web App / SPA moderna orientada a estudiantes, jóvenes profesionales y creadores de contenido que buscan transformar sus intenciones cotidianas en hábitos consolidados. El producto reemplaza la fricción de herramientas corporativas con una experiencia visualmente estimulante (glassmorphism en modo oscuro), gratificación inmediata (rachas, insignias, medidores de progreso) y privacidad total mediante almacenamiento local (`localStorage`).

## 2. Personas y Casos de Uso

- **Persona 1: Alex (Estudiante universitario / Desarrollador junior, 21 años)**
  - *Necesidad:* Mantener constancia estudiando programación 1 hora al día y leyendo 20 minutos antes de dormir.
  - *Dolor previo:* Las apps tradicionales exigen login, muestran anuncios o son aburridas.
  - *Momento WOW:* Abre la app en su móvil o laptop, ve datos vivos precargados, completa su sesión de estudio y ve cómo sube su medidor circular y aumenta su racha con un destello visual.
- **Persona 2: Sofía (Creadora de contenido y entusiasta fitness, 24 años)**
  - *Necesidad:* Monitorear hidratación diaria, publicaciones semanales y meditación matutina.
  - *Dolor previo:* Olvida registrar si la interfaz es lenta o desmotivadora.
  - *Momento WOW:* Filtra por categoría "Creación de Contenido", marca con un toque su check-in y desbloquea la insignia "En Llamas (Racha de 3 días)".

## 3. Principios de Diseño y Estética UI/UX

1. **Dark Glassmorphism por defecto:** Fondos oscuros (`#0b0f19` a `#111827`) con tarjetas translúcidas (`backdrop-filter: blur(16px)`), bordes sutiles con iluminación tenue (`rgba(255, 255, 255, 0.08)`) y acentos de color neón (cian, violeta, esmeralda y ámbar).
2. **Microcopia emocional y motivadora:** Frases dinámicas que reconocen el progreso del usuario según el % del día completado (0%, 25%, 50%, 75%, 100%).
3. **Cero latencia y Cero fricción:** Toda interacción (check-in, filtrado, creación) se resuelve en <16ms sin recargar la página.
4. **Mobile & Desktop First:** Experiencia táctil optimizada en smartphones con botones de toque amplio (mínimo 44x44px) y diseño adaptativo a pantallas amplias.

## 4. Requisitos Funcionales Detallados

### RF-01 — Panel de Control y Métricas Diarias
- **RF-01.1:** Contar total de hábitos activos registrados.
- **RF-01.2:** Calcular hábitos completados hoy vs. total del día con porcentaje visible en un medidor circular SVG reactivo.
- **RF-01.3:** Mostrar métricas de racha: Racha actual promedio y racha récord global.
- **RF-01.4:** Gráfica o barra de cumplimiento de los últimos 7 días con estados completado/parcial/nulo.
- **RF-01.5:** Microtexto inspirador dinámico contextual.

### RF-02 — Gestión de Hábitos (CRUD)
- **RF-02.1:** Formulario modal / panel deslizable para crear hábito con: Nombre (string 3-60 chars), Categoría (selector), Frecuencia objetivo (Diaria, Días laborales, Fines de semana), Color temático, Ícono (emoji/icono SVG) y Descripción (opcional, máx 140 chars).
- **RF-02.2:** Edición de hábitos existentes preservando su historial de check-ins y timestamps de creación.
- **RF-02.3:** Eliminación con confirmación modal o acción destructiva protegida.
- **RF-02.4:** Categorías preconfiguradas con colores temáticos:
  - 📚 Estudio (Azul eléctrico)
  - ⚡ Productividad (Violeta neón)
  - 🏋️ Fitness (Naranja fuego)
  - 🥗 Salud (Verde esmeralda)
  - 🎨 Creación de Contenido (Rosa magenta)
  - 🧠 Mentalidad (Cian brillante)

### RF-03 — Registros Diarios y Algoritmo de Rachas
- **RF-03.1:** Checkbox / botón de check-in con animación de pulsación y confeti/destello sutil.
- **RF-03.2:** Capacidad de marcar y desmarcar (toggle) el día actual en caso de error involuntario.
- **RF-03.3:** Algoritmo de racha:
  - Evalúa la continuidad en días consecutivos según la zona horaria local (`YYYY-MM-DD`).
  - Si el último check-in fue hoy: `currentStreak` se mantiene.
  - Si el último check-in fue ayer y hoy se marca: `currentStreak` incrementa en +1.
  - Si el último check-in fue hace más de 1 día: la racha se rompe y reinicia en 1 al marcar hoy.
  - `longestStreak` almacena el valor máximo histórico alcanzado.

### RF-04 — Búsqueda y Filtros Multicriterio
- **RF-04.1:** Barra de búsqueda en tiempo real que filtra por nombre o descripción mientras el usuario escribe.
- **RF-04.2:** Píldoras de filtrado por categoría con conteo de hábitos asociados.
- **RF-04.3:** Selector de filtro por estado: "Todos", "Pendientes Hoy", "Completados Hoy", "Con Racha Activa".
- **RF-04.4:** Pantalla de estado vacío ("No se encontraron hábitos") con sugerencia de crear uno o limpiar filtros.

### RF-05 — Progreso Visual e Insignias de Hitos
- **RF-05.1:** Panel de Insignias de Hito desbloqueables:
  - 🌟 *Primer Paso:* 1 día completado.
  - 🔥 *En Llamas:* Racha de 3 días consecutivos.
  - ⚡ *Imparable:* Racha de 7 días consecutivos.
  - 🏆 *Hábito de Hierro:* Racha de 21 días consecutivos.
  - 👑 *Maestría Total:* Racha de 30 días consecutivos.
- **RF-05.2:** Distinción visual entre insignias bloqueadas (translúcidas, blanco y negro) y desbloqueadas (brillantes, con gradiente y fecha de obtención).

### RF-06 — Persistencia en LocalStorage y Datos Seed Iniciales
- **RF-06.1:** Estructura en `localStorage` bajo `levelup_habits_v1`.
- **RF-06.2:** Carga automática de 5 hábitos predeterminados con datos históricos de los últimos días si no existe información previa.
- **RF-06.3:** Opción de "Reiniciar datos a modo demostración" en el pie de página o menú de opciones.
- **RF-06.4:** Manejo seguro de cuota y parseo con fallback resiliente si el JSON estuviera corrupto.

### RF-07 — Diseño Responsive y Microtextos Dinámicos
- **RF-07.1:** Layout adaptable con CSS Grid y Flexbox: vista a 1 columna en móviles (<768px) y multi-columna en escritorio (>=1024px).
- **RF-07.2:** Compatibilidad total con navegación por teclado y etiquetas accesibles (`aria-label`, contraste WCAG AA en modo oscuro).

## 5. Criterios de Aceptación Globales

1. La aplicación se despliega como estática sin requerir Node.js en tiempo de ejecución de producción.
2. La carga inicial del dashboard es inferior a 800 ms.
3. No se transmiten datos a ningún servidor externo.
4. Todos los requisitos funcionales RF-01 a RF-07 están cubiertos y son demostrables de extremo a extremo.
