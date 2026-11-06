# PRD de producto — Level Up Habit Tracker

> PRD consolidado a partir de `spec-kit/input/brief.md` y `refdocs/user-prompt.es.md`.

## 1. Producto y Visión

**Level Up Habit Tracker** es una aplicación web moderna, ágil y visualmente cautivadora para el seguimiento personal de hábitos y la superación diaria. Diseñada para jóvenes, estudiantes, creadores y personas que buscan construir constancia sin la pesadez de plataformas corporativas.

La aplicación opera 100% en el navegador (Single Page Application sin dependencias de backend), garantizando privacidad total, rapidez absoluta e inicio instantáneo con persistencia automática en `localStorage`.

## 2. Decisiones de Diseño y UX

| Área | Decisión |
|---|---|
| Estética visual | **Glassmorphism moderno**: fondos oscuros translúcidos, desenfoques (`backdrop-filter: blur`), bordes tenues semi-transparentes y sombras de neón suaves. |
| Tema | Modo oscuro nativo por defecto con contrastes altos y acentos vibrantes (degradados violeta, cian y esmeralda). |
| Tipografía | Sans-serif geométrica moderna (Inter / sistema limpio). |
| Gamificación | Contadores de racha con íconos de fuego, medidores circulares de progreso del día e insignias desbloqueables por hitos (3, 7, 14, 21, 30 días). |
| Microcopia | Mensajes motivacionales dinámicos basados en progreso ("¡Sigue así!", "Estás ganando impulso", "¡Imparable!"). |
| Responsive | Diseño fluido adaptado tanto a pantallas móviles (touch-first) como a escritorio. |
| Persistencia | `localStorage` con serialización JSON, validación de integridad y recuperación automática de fallos. |
| Cero fricción | Sin registro, sin login, sin servicios externos; datos semilla representativos precargados para demostración inmediata. |

## 3. Requisitos Funcionales

### RF-01 — Panel de Control y Métricas Diarias
El sistema debe proporcionar un dashboard central con visión inmediata del estado de los hábitos:
- Contabilizar el total de hábitos activos en el sistema.
- Mostrar la cantidad y porcentaje de hábitos completados durante el día actual.
- Mostrar la racha activa acumulada (promedio y racha máxima alcanzada).
- Visualizar el resumen de cumplimiento de los últimos 7 días.
- Presentar microtextos motivacionales que cambian según el umbral de completitud del día.

### RF-02 — Gestión de Hábitos (CRUD)
El usuario debe poder gestionar sus hábitos de forma rápida e intuitiva:
- Crear nuevos hábitos especificando: nombre, categoría, frecuencia objetivo, color/ícono temático y descripción breve.
- Editar atributos de hábitos existentes sin perder el historial de cumplimiento acumulado.
- Eliminar hábitos con confirmación para prevenir borrados accidentales.
- Ofrecer categorías predefinidas: Estudio, Fitness, Salud, Productividad, Creación de Contenido, Mentalidad.

### RF-03 — Registros Diarios y Algoritmo de Rachas
El sistema debe permitir registrar el progreso diario y gestionar rachas consecutivas:
- Marcar o desmarcar el check-in de un hábito para el día en curso con un solo clic/tap.
- Refrescar al instante los porcentajes globales y los indicadores visuales.
- Calcular y mantener la racha actual (`currentStreak`) y la mejor racha (`longestStreak`):
  - Si el check-in se realizó hoy o ayer, la racha se preserva y avanza con el nuevo día.
  - Si transcurrió más de 1 día sin check-in, la racha actual se reinicia a 1 al marcar hoy.
- Registrar el historial de fechas (`completedDates: string[]` en formato ISO `YYYY-MM-DD`).

### RF-04 — Búsqueda y Filtros Multicriterio
El sistema debe permitir explorar y organizar la lista de hábitos:
- Buscador textual en tiempo real por nombre y descripción del hábito.
- Filtro por categoría temática mediante botones/píldoras interactivas.
- Filtro por estado operativo: Todos, Completados hoy, Pendientes hoy, Con racha activa.
- Estado vacío amigable cuando no haya coincidencias en los filtros aplicados.

### RF-05 — Progreso Visual e Insignias de Hitos
La interfaz debe recompensar el esfuerzo diario mediante elementos gráficos atractivos:
- Indicadores circulares y barras de progreso con gradientes dinámicos según el avance.
- Visualización de insignias de hitos desbloqueadas (p. ej. "Primer Paso" 1 día, "En Llamas" 3 días, "Imparable" 7 días, "Hábito de Hierro" 21 días).
- Notificaciones/animaciones visuales de celebración al alcanzar un nuevo hito de racha.

### RF-06 — Persistencia en LocalStorage y Datos Seed Iniciales
El sistema debe garantizar la persistencia confiable y experiencia inicial inmediata:
- Almacenar toda la colección de hábitos y configuración en `localStorage` bajo una clave estructurada (ej. `levelup_habits_v1`).
- Si el almacenamiento está vacío al iniciar, inicializar automáticamente datos semilla con 5 a 6 hábitos variados con historial de días recientes.
- Botón opcional de restablecer datos semilla / reiniciar datos en configuración para pruebas y demostraciones.

### RF-07 — Diseño Responsive y Microtextos Dinámicos
La aplicación debe verse y sentirse como un producto de alta calidad en cualquier dispositivo:
- Estructura glassmorphism adaptable con `backdrop-filter`, paleta oscura profunda y acentos fluorescentes.
- Controles accesibles y amigables para pantallas táctiles (botones de tamaño adecuado, áreas de toque cómodas).
- Animaciones CSS sutiles en hover, check-ins y apertura de modales o paneles.
