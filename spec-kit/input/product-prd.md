# PRD de producto — Encuesta de Satisfacción en Copilot (Copilot UX components)

> PRD consolidado a partir de `spec-kit/input/brief.md`, `refdocs/*` y `planning/clarifications/brief.json`, y ajustado con lo que generó el scaffolding real en `apps/satisfaction-survey/` (SPFx 1.24.0-rc.0, plantilla React).

## 1. Producto

Un **agente declarativo de Microsoft 365 Copilot** con dos **Copilot UX components** construidos con SPFx 1.24:

1. **Encuesta** (`SatisfactionSurveyForm`, ya generado por el autor): formulario de satisfacción de un ticket de soporte, dentro del chat.
2. **Tablero** (`TechnicianScorecard`, el autor lo agrega con el generador): desempeño consolidado de un técnico en 4 dimensiones, mostrado en círculos.

Los datos viven en **una lista de SharePoint `Encuestas`** dentro de una **colección de sitios de comunicación nueva**. Tanto el aprovisionamiento como los datos de ejemplo usan **PnP.PowerShell 1.5.0** con `Connect-PnPOnline -UseWebLogin`.

Objetivo: una demo en vivo de 1 hora en español (TI y desarrolladores de SharePoint) y un repositorio público reproducible. Todo con Contoso y datos ficticios.

## 2. Decisiones de diseño

| Tema | Decisión |
|---|---|
| Dimensiones | **Comprensión · Rapidez · Habilidad · Comunicación** (1–5, cada punto con etiqueta, sin valor por defecto) |
| Resultado | Sí / Parcialmente / No |
| Recomendación | Sí / No / No estoy seguro |
| Comentario | Obligatorio si Resultado ≠ Sí o alguna dimensión ≤ 2; opcional en otro caso |
| Ticket | Texto libre `Ticket #` (sin lista de tickets) |
| Técnico | Campo **Persona** |
| Periodo del tablero | Por fecha de sistema **`Creado`** |
| Visualización | Un círculo por dimensión: 1 = solo contorno, 5 = relleno total. El área es proporcional a `(valor−1)/4`. **Sin comparación con promedios de otros** |
| Visibilidad | Todos los usuarios ven el tablero de cualquier técnico; nunca se muestra quién respondió |
| Mínimo de datos | Menos de 5 respuestas en el periodo → "datos insuficientes" |
| Tenant del autor | https://bajaworks.sharepoint.com (nunca va fijo en el código público) |

## 3. Requisitos funcionales

### RF-01 — Intención: responder encuesta
El agente invoca la tool de encuesta cuando el usuario quiere calificar una atención o un ticket, responder una encuesta o dar su opinión sobre un soporte.

### RF-02 — Intención: consultar desempeño
El agente invoca la tool del tablero cuando el usuario pregunta por el desempeño, las calificaciones o la satisfacción de un técnico.

### RF-03 — No inventar datos
Si falta el ticket o el técnico, el agente no los inventa. El formulario los pide o el agente pregunta.

### RF-04 — Frases de inicio
"Calificar la atención de un ticket" y "¿Cómo va el desempeño de un técnico?".

### RF-05 — Parámetros de la encuesta
`ticketNumber?` y `technician?` (nombre o correo). Si vienen, se precargan y se pueden editar.

### RF-06 — Preguntas de la encuesta
Contexto (Ticket #, Técnico) → Resultado → 4 dimensiones → Recomendación → Comentario condicional.

### RF-07 — Validación
Resultado, las 4 dimensiones, Ticket # y Técnico son obligatorios. El comentario es obligatorio según la regla de la sección 2.

### RF-08 — Sin duplicados
Una respuesta por `Ticket #` y por solicitante (`Creado por`). Si ya existe, se muestra en modo lectura.

### RF-09 — Envío y confirmación
Se guarda en `Encuestas` con los permisos del usuario. La confirmación ofrece "Ver desempeño de <técnico>", que manda un mensaje de seguimiento al chat.

### RF-10 — Parámetros del tablero
`technician` (nombre o correo) y `period` (`month`, `quarter`, `semester` o `all`; por defecto `quarter`). El filtro se aplica sobre `Creado`.

### RF-11 — Tablero inline
Calificación general, 4 círculos pequeños, % resuelto, % que recomienda, n respuestas, la dimensión más fuerte y la más débil, y el botón "Ver detalle" (pantalla completa).

### RF-12 — Tablero en pantalla completa
4 círculos grandes con su valor, distribución 1–5 por dimensión, tendencia mensual por `Creado`, Resultado Sí/Parcialmente/No y comentarios recientes (los de calificaciones bajas destacados). Selector de periodo.

### RF-13 — Datos insuficientes
Si n < 5 en el periodo, se muestra "datos insuficientes" en lugar de valores.

### RF-14 — Anonimato del solicitante
El tablero nunca muestra `Creado por`.

### RF-15 — Sitio de comunicación
El script crea (o reutiliza) la colección de sitios de comunicación de la demo. Parámetros: URL del tenant, alias, título y LCID.

### RF-16 — Lista Encuestas
El script crea la lista, sus columnas, sus vistas y sus permisos de forma idempotente: todos pueden crear, todos pueden leer y cada quien solo edita lo suyo.

### RF-17 — Datos de ejemplo
El script carga unas 120 respuestas ficticias para N técnicos (correos recibidos como parámetro) y reparte la fecha `Creado` en 6 meses con `UpdateOverwriteVersion`.

### RF-18 — Reinicio de la demo
Un script borra los datos (todos, o solo los creados en la demo en vivo) y puede volver a cargar los de ejemplo.

### RF-19 — Configuración del sitio
Los componentes encuentran el sitio de datos en una propiedad del tenant (storage entity) o, si no existe, en la ruta por defecto `/sites/encuestas` del mismo tenant.

### RF-20 — Guion de la demo
Agenda de 60 minutos, frases exactas, ensayos y plan B.

### RF-21 — Repositorio público
README en español y en inglés, licencia MIT, capturas y una verificación automática de que no haya marcas reales ni el tenant del autor en el código.

## 4. Fuera de alcance
Sistema de tickets real, envío automático de la encuesta, AppSource, reutilización como web part o en Teams, IA propia, funciones de producción.
