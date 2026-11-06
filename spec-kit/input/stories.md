---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-06T05:37:00Z'
agent_roles: 'engineering-software-architect + engineering-frontend-developer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
---

# User Stories — Level Up Habit Tracker

## Tabla Índice (Stories ↔ Epics ↔ RF)

| Story | Epic | RF | Título | Owner Sugerido |
|---|---|---|---|---|
| **S-01** | EP-04 | RF-01 | Panel de Control y Métricas Diarias | frontend |
| **S-02** | EP-02 | RF-02 | Gestión Integral de Hábitos (CRUD) | frontend |
| **S-03** | EP-03 | RF-03 | Registros Diarios y Algoritmo de Rachas | frontend |
| **S-04** | EP-05 | RF-04 | Búsqueda y Filtros Multicriterio | frontend |
| **S-05** | EP-04 | RF-05 | Progreso Visual e Insignias de Hitos | frontend |
| **S-06** | EP-01 | RF-06 | Persistencia en LocalStorage y Datos Seed | frontend |
| **S-07** | EP-01 / EP-05 | RF-07 | Diseño Responsive Glassmorphism y Microcopia | frontend |

---

## Detalle de Historias de Usuario

### S-01 — Panel de Control y Métricas Diarias
- **Como** usuario que busca superarse a diario,
- **Quiero** ver un panel consolidado con el resumen de mis hábitos de hoy,
- **Para** conocer inmediatamente mi nivel de cumplimiento y mantenerme motivado sin rodeos.

**Criterios de Aceptación:**
- [ ] Mostrar un contador total de hábitos activos en el sistema.
- [ ] Mostrar la cantidad de hábitos completados hoy vs. el total programado para el día (ej. `3 de 5 completados`).
- [ ] Renderizar un medidor circular o indicador visual con el porcentaje de completitud (`0%` a `100%`).
- [ ] Mostrar el promedio de racha activa y la racha máxima registrada entre todos los hábitos.
- [ ] Mostrar un componente de progreso de los últimos 7 días con barras o puntos indicadores de éxito diario.
- [ ] Desplegar un microtexto motivacional que cambia según el porcentaje completado hoy (0% = inicio, 50% = impulso, 100% = día perfecto).

---

### S-02 — Gestión Integral de Hábitos (CRUD)
- **Como** creador de rutinas personales,
- **Quiero** crear, editar y eliminar hábitos fácilmente con datos personalizados,
- **Para** adaptar la aplicación a mis objetivos cambiantes de vida y estudio.

**Criterios de Aceptación:**
- [ ] Botón destacado "+ Nuevo Hábito" que abre un modal con estética glassmorphism.
- [ ] Formulario con validación en tiempo real para: Nombre (obligatorio, 3-60 caracteres), Categoría (selector obligatorio), Frecuencia (diaria, entre semana, fines de semana), Color temático e Ícono.
- [ ] Guardar el nuevo hábito generando un ID único y timestamp `createdAt`.
- [ ] Opción para editar el nombre, categoría, frecuencia, color y descripción de un hábito existente sin alterar su historial de rachas.
- [ ] Opción de eliminar un hábito con confirmación previa para evitar pérdida accidental de datos.

---

### S-03 — Registros Diarios y Algoritmo de Rachas
- **Como** usuario constante,
- **Quiero** marcar mis hábitos como completados hoy con un solo toque y ver mis rachas crecer,
- **Para** sentir satisfacción inmediata y proteger mi disciplina diaria.

**Criterios de Aceptación:**
- [ ] Cada tarjeta de hábito cuenta con un botón de check-in visualmente gratificante (círculo interactivo con animación al pulsar).
- [ ] Al marcar un hábito hoy, la fecha en formato ISO `YYYY-MM-DD` se añade a `completedDates`.
- [ ] Si el usuario vuelve a presionar el botón de check-in completado, se revierte el estado (toggle) para corregir errores.
- [ ] El algoritmo de racha evalúa la continuidad:
  - Si el hábito fue completado hoy y ayer (o días contiguos previos), la racha actual se incrementa.
  - Si el hábito no se completó ayer pero hoy sí, la racha se reinicia a 1.
  - Si no está completado hoy pero sí ayer, la racha previa se conserva hasta el final del día sin romperse prematuramente.
- [ ] Si `currentStreak > longestStreak`, se actualiza automáticamente `longestStreak`.

---

### S-04 — Búsqueda y Filtros Multicriterio
- **Como** usuario con múltiples hábitos organizados,
- **Quiero** buscar por texto y filtrar por categoría o estado,
- **Para** enfocarme rápidamente en los hábitos pendientes o en un área específica de mi vida.

**Criterios de Aceptación:**
- [ ] Campo de búsqueda con icono que filtra instantáneamente por nombre o descripción sin requerir presionar Enter.
- [ ] Píldoras de categoría (Estudio, Fitness, Salud, Productividad, Creación de Contenido, Mentalidad) que filtran la lista con un clic.
- [ ] Filtro rápido por estado: "Todos", "Pendientes", "Completados", "En Racha".
- [ ] Los filtros se combinan lógicamente (búsqueda AND categoría AND estado).
- [ ] Si ningún hábito coincide con los filtros, se muestra un estado vacío amigable con botón para limpiar filtros.

---

### S-05 — Progreso Visual e Insignias de Hitos
- **Como** usuario que disfruta la gamificación,
- **Quiero** desbloquear insignias visuales cuando acumulo rachas significativas,
- **Para** sentir orgullo por mi constancia y celebrar mis logros.

**Criterios de Aceptación:**
- [ ] Galería de 5 insignias representativas:
  - 🌟 *Primer Paso:* 1 día completado.
  - 🔥 *En Llamas:* 3 días consecutivos.
  - ⚡ *Imparable:* 7 días consecutivos.
  - 🏆 *Hábito de Hierro:* 21 días consecutivos.
  - 👑 *Maestría Total:* 30 días consecutivos.
- [ ] Las insignias no obtenidas se muestran en estado bloqueado (escala de grises, opacidad reducida).
- [ ] Al alcanzar un hito por primera vez, la insignia se desbloquea con un efecto visual brillante y guarda su fecha de desbloqueo.

---

### S-06 — Persistencia en LocalStorage y Datos Seed Iniciales
- **Como** usuario nuevo o recurrente,
- **Quiero** que mis datos se guarden de forma automática y que la app tenga hábitos de ejemplo al entrar por primera vez,
- **Para** entender el valor del producto de inmediato y nunca perder mi progreso al cerrar la pestaña.

**Criterios de Aceptación:**
- [ ] Toda mutación de estado se serializa sincrónicamente en `localStorage` bajo `levelup_habits_v1`.
- [ ] Si `localStorage` está vacío al cargar la aplicación, se cargan 5 hábitos semilla preconfigurados con historial de días recientes.
- [ ] Al recargar la página, cerrar el navegador o reabrir la app, el 100% de los hábitos y fechas completadas se restablecen con exactitud.
- [ ] Existe un botón discreto en la configuración/header para "Restablecer datos de prueba", permitiendo reiniciar la demo en cualquier momento.

---

### S-07 — Diseño Responsive Glassmorphism y Microcopia
- **Como** usuario que accede desde mi teléfono móvil y desde mi computadora,
- **Quiero** una interfaz moderna de tema oscuro, con efectos translúcidos y textos motivadores,
- **Para** disfrutar de una experiencia estética pulida, cómoda para la vista y adaptada a cualquier pantalla.

**Criterios de Aceptación:**
- [ ] Estilo Glassmorphism aplicado con `backdrop-filter: blur(16px)`, bordes translúcidos luminosos y fondo oscuro profundo (`#0a0e17`).
- [ ] Paleta cromática con acentos de neón vibrantes pero legibles (cian, violeta, esmeralda, naranja fuego).
- [ ] Diseño adaptable: 1 columna fluida en smartphones y layout multi-panel espacioso en escritorio.
- [ ] Microcopia inspiradora en español, sin tono corporativo ni lenguaje empresarial, adaptada al lenguaje natural de audiencias jóvenes.
