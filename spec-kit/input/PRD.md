---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:10:00Z'
agent_roles: 'IDE Agent + product-manager + design-ux-researcher'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# PRD — Encuesta de Satisfacción en Copilot

## 1. Problema y oportunidad

Las encuestas de satisfacción de soporte suelen ser formularios aparte: alguien los envía por correo, la gente los ignora y nadie los consolida. El formulario de referencia tiene además problemas de diseño:
- No identifica al técnico.
- Las casillas son ambiguas: una casilla vacía puede ser "No" o "No contestó".
- La escala trae un valor preseleccionado.

**Copilot UX components** (SPFx 1.24, en preview) permite resolver esto **dentro de la conversación**: el usuario dice lo que quiere y Copilot le muestra el formulario o el tablero adecuado.

La sesión necesita un ejemplo **real, pequeño y reproducible** que muestre:
1. Cómo Copilot detecta la intención y abre una interfaz con parámetros.
2. Cómo esa interfaz lee y escribe en SharePoint con los permisos del usuario.
3. Que se puede construir con las herramientas de SPFx que la audiencia ya conoce.

## 2. Objetivos

| # | Objetivo | Métrica |
|---|---|---|
| O1 | Detección de intención confiable | ≥ 9/10 frases del guion abren el componente correcto |
| O2 | Encuesta rápida y sin datos ambiguos | Se responde en ≤ 30 s; 0 campos ambiguos |
| O3 | Tablero que se entiende sin explicación | Carga en ≤ 2 s; la historia de los datos de ejemplo se lee a simple vista |
| O4 | Reproducible por la comunidad | Desplegable en otro tenant en ≤ 30 min solo con el README |
| O5 | Seguro para publicar | 0 marcas reales y 0 referencias al tenant del autor en el código |

## 3. Personas

- **Laura (solicitante, empleada de Contoso).** Acaba de recibir ayuda con su laptop y quiere calificar la atención sin salir de Copilot.
- **Carlos (supervisor de soporte).** Quiere saber en qué es fuerte y en qué puede mejorar cada técnico.
- **Ana (técnica de soporte).** Quiere ver su propio tablero.
- **Presentador.** Necesita una demo estable y un repositorio que pueda explicar paso a paso.
- **Desarrollador de la comunidad.** Clona el repo y lo despliega en su propio tenant.

## 4. Experiencia

### 4.1 Responder la encuesta (componente `SatisfactionSurveyForm`, inline)

> Laura: *"Quiero calificar la atención del ticket 4521, me ayudó Ana López"*

El formulario se abre con el **Ticket #** = 4521 y el **Técnico** = Ana López (con foto) ya llenos. Ambos se pueden editar. La encuesta tiene tres bloques:

1. **Resultado:** "¿Se resolvió tu problema?" → Sí / Parcialmente / No (botones segmentados).
2. **Calificación:** cuatro escalas de 1 a 5 con una etiqueta en cada punto (Muy malo · Malo · Regular · Bueno · Excelente). Ninguna viene preseleccionada.
   - **Comprensión:** ¿Qué tan bien entendió tu problema?
   - **Rapidez:** ¿Qué tan rápido respondió?
   - **Habilidad:** ¿Qué tanta habilidad técnica mostró para resolverlo?
   - **Comunicación:** ¿Qué tan clara fue la comunicación?
   - "¿Recomendarías este soporte a un compañero?" → Sí / No / No estoy seguro.
3. **Comentario:** obligatorio y con una pregunta específica ("¿Qué pudimos hacer mejor?") si el resultado no fue "Sí" o si alguna calificación es ≤ 2. En otro caso es opcional.

Después del envío aparece una confirmación con un resumen de lo enviado y un botón **"Ver desempeño de Ana López"**. Ese botón manda un mensaje de seguimiento al chat, Copilot invoca el tablero y la historia sigue sin que el presentador tenga que escribir.

Si Laura ya calificó ese ticket, el formulario muestra su respuesta en modo lectura.

### 4.2 Consultar el desempeño (componente `TechnicianScorecard`)

> Carlos: *"¿Cómo va el desempeño de Ana López este trimestre?"*

**Vista inline:**
- Calificación general y n respuestas.
- 4 círculos pequeños.
- % resuelto y % que recomienda.
- La dimensión más fuerte y la más débil.
- Botón "Ver detalle".

**Vista de pantalla completa:**
- 4 círculos grandes, uno por dimensión, con su valor numérico.
- Distribución de respuestas 1–5 por dimensión.
- Tendencia mensual, agrupada por la fecha `Creado`.
- Resultado: Sí / Parcialmente / No.
- Comentarios recientes, con los de calificaciones bajas destacados.
- Selector de periodo: mes, trimestre, semestre, todo.

**Cómo se dibuja cada círculo:** el contorno exterior representa el 5 y el centro el 1. El relleno crece desde el centro con un área proporcional a `(valor − 1) / 4`. Con 1 se ve solo el contorno; con 5 el círculo queda lleno. Los contornos guía 2, 3 y 4 son líneas tenues. **No se compara contra promedios de otros técnicos.**

Si hay menos de 5 respuestas en el periodo, se muestra "Datos insuficientes (n = 3)".

### 4.3 Reglas de privacidad
- Todos pueden ver el tablero de cualquier técnico.
- Nunca se muestra quién respondió.
- Los comentarios se muestran sin autor.

## 5. Requisitos funcionales

Los requisitos RF-01 a RF-21 de `product-prd.md` son la referencia. Cómo se agrupan en épicas está en `epics.md`, y su detalle con criterios de aceptación en `stories.md`.

## 6. Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF-01 | SPFx 1.24 (rc.0 hoy, GA cuando salga), React 18.3, Fluent UI v9, TypeScript 5.8, Node 22.14 o superior |
| RNF-02 | Sin backend propio; solo SharePoint REST con `SPHttpClient` (SSO a través del broker de SPFx) |
| RNF-03 | Sin permisos de Microsoft Graph adicionales (no hace falta aprobar permisos en el centro de administración) |
| RNF-04 | WCAG 2.1 AA: escala operable con teclado, `aria-label` en cada punto, contraste en tema claro y oscuro, el tablero no depende solo del color |
| RNF-05 | Sigue el tema del host (`hostContext.theme`) |
| RNF-06 | Paquete ligero: gráficas en SVG propio, sin librerías de gráficas |
| RNF-07 | Localización es-ES (principal) y en-US |
| RNF-08 | Scripts: PnP.PowerShell 1.5.0, `-UseWebLogin`, idempotentes, solo Windows |
| RNF-09 | Sin datos del tenant del autor en el código; configuración local excluida de Git |

## 7. Fuera de alcance
Sistema de tickets real, envío automático de la encuesta, AppSource, reutilización como web part o en Teams, IA propia, funciones de producción (auditoría, retención, multi-tenant).

## 8. Supuestos y riesgos
Ver `brief.md` → *Open Questions / Risks* y `technical-spec.md` → *Riesgos técnicos y validaciones previas*.
