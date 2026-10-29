---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T12:45:00Z'
agent_roles: 'IDE Agent + product-manager + design-ux-researcher + engineering-technical-writer'
vision_command: 'generate_brief'
---

# Brief — Encuesta de Satisfacción en Copilot: demo de Copilot UX components

## Executive Summary

Este proyecto prepara una **demo en vivo** para una sesión técnica sobre **Copilot UX components**, la capacidad de SharePoint Framework (SPFx 1.24) que permite mostrar interfaces interactivas dentro de Microsoft 365 Copilot. Se anunció en julio de 2026 como *SharePoint Copilot Apps* y Microsoft la renombró el 30 de septiembre de 2026. Sigue en preview y la disponibilidad general (GA) está prevista para octubre de 2026.

El ejemplo de la demo es un escenario que cualquier organización reconoce: la **encuesta de satisfacción después de un ticket de soporte**. Cuando el usuario conversa con Copilot y menciona calificar una atención, responder una encuesta o dar su opinión sobre un caso, el agente **abre el formulario de la encuesta dentro de la conversación**. El formulario ya viene con los datos del ticket y del técnico. Del otro lado, un supervisor puede preguntar *"¿cómo va el desempeño de Ana este trimestre?"* y Copilot muestra un **tablero consolidado** con las calificaciones de esa persona en cada dimensión que mide la encuesta.

La propuesta de valor para la audiencia tiene tres partes. Primero, ver la tecnología funcionando con un caso real. Segundo, entender qué se puede hacer y qué limitaciones tiene hoy. Tercero, poder **descargar el código** desde un repositorio público de GitHub, desplegarlo en su propio tenant y seguir los pasos de la construcción. Por eso todo el contenido es **genérico**: empresa ficticia (Contoso), datos ficticios y ninguna marca real.

## Context

- **Formulario de origen.** El ejemplo en `refdocs/formexample.png` y `refdocs/narrative.md` es una encuesta de un proveedor real de servicios. Se usa **solo como inspiración**: no se reutiliza la marca, los nombres ni los textos literales.
- **Narrativa original.** El autor del formulario busca algo *"súper fácil de llenar"* que permita *"cierto nivel de evaluación del operador"*. Esa es la tensión de diseño: mínima fricción para quien responde y datos útiles para evaluar a cada técnico.
- **Momento de la tecnología.** Copilot UX components cambió de nombre tres veces en tres meses. La GA está prevista para octubre de 2026, pero el licenciamiento de la GA no está confirmado. La sesión debe usar el nombre actual, mencionar los nombres anteriores (la comunidad todavía los usa) y dejar claro qué es preview.
- **Cómo funciona (según la documentación de Microsoft, 2026-09-23):**
  - Una solución SPFx (`.sppkg`) contiene uno o más componentes que heredan de `BaseCopilotComponent`, más la definición de un **agente declarativo** (`declarativeAgent.json`, `instruction.txt`, `ai-plugin.json`, `manifest.json`).
  - Cada componente expone **tools** con un `propertiesSchema`. Copilot detecta la intención del usuario, invoca la tool y le pasa parámetros que definen cómo se ve el componente al cargar.
  - Hay dos modos de pantalla: `inline` (dentro del chat) y `fullscreen` (ocupa todo el lienzo).
  - Se despliega en el App Catalog de SharePoint y se sincroniza al catálogo de agentes con **Add to Teams**. Para probar localmente se usa el **Copilot Workbench** (`/_layouts/15/copilotworkbench.aspx`).
  - El inicio de sesión es automático (SSO) y el componente trabaja con los permisos del usuario que lo usa.

### Análisis del formulario actual

| # | Elemento actual | Problema | Propuesta |
|---|---|---|---|
| A | Campo "relacionado con" (texto libre, gris) | Quien responde tiene que escribir o adivinar el contexto. **No identifica al técnico**, así que no se puede armar una vista por persona. | Bloque de contexto al inicio con **Ticket #** y **técnico** (selector de personas, con foto). Copilot los precarga cuando el usuario los mencionó en la conversación. Si no, se capturan en el mismo formulario. |
| B | "¿Se resolvió?" con casilla de verificación | Una casilla sin marcar puede significar "No" o "No contestó". | Elección explícita: **Sí / Parcialmente / No**. |
| C | Comentarios antes de las calificaciones | Se piden comentarios antes de que la persona evalúe nada. El texto es genérico. | Comentario **al final y condicional**. Si la respuesta fue No o Parcialmente, o alguna calificación es ≤ 2, aparece una pregunta específica ("¿Qué pudimos hacer mejor?"). Si no, es opcional. |
| D | Escala 1–5 con **3 preseleccionado** | El valor por defecto sesga los resultados y no deja distinguir "respondió 3" de "no tocó la pregunta". Solo los extremos tienen etiqueta. | Sin valor preseleccionado, **cada punto con su etiqueta** (Muy malo · Malo · Regular · Bueno · Excelente), botones grandes y uso con teclado. |
| E | Las dimensiones no coinciden entre la narrativa y la imagen ("ability to address" vs "technical ability") | Ambigüedad en lo que se mide. | Cuatro dimensiones canónicas (nombres definidos por el autor): **Comprensión · Rapidez · Habilidad · Comunicación**. En el formulario cada una lleva una pregunta corta que la explica: "¿Qué tan bien entendió tu problema?", "¿Qué tan rápido respondió?", "¿Qué tanta habilidad técnica mostró para resolverlo?", "¿Qué tan clara fue la comunicación?". En el tablero se muestra solo la etiqueta de una palabra. |
| F | "¿Nos recomendaría?" con casilla | Tiene la misma ambigüedad que B. | Elección explícita **Sí / No / No estoy seguro**. Usar NPS 0–10 queda como pregunta abierta. |
| G | Numeración 1 → 2–6, tamaños de título inconsistentes, faltas de ortografía | Se ve poco profesional. | Un solo flujo visual: 3 bloques (Resultado → Calificación → Comentario) con indicador de progreso. |
| H | No evita respuestas duplicadas | Se puede responder el mismo ticket varias veces. | **Una respuesta por ticket y por solicitante.** Si ya existe, se muestra la que envió. |

## Goals

1. **Mostrar en vivo** la detección de intención: una frase natural en Copilot abre el formulario correcto, con datos precargados, en menos de 10 segundos.
2. **Mostrar el ciclo completo** dentro de Copilot sin salir de la conversación: responder → guardar en SharePoint → confirmar → consultar el consolidado.
3. **Rediseñar el formulario** para que se responda en **≤ 30 segundos** y no tenga datos ambiguos (problemas A–H).
4. **Visualizar el desempeño consolidado** de un técnico por dimensión, con círculos que se rellenan del 1 al 5, con su tendencia en el tiempo y con un mínimo de respuestas para que el dato sea confiable.
5. **Enseñar cómo se construyó**: estructura del proyecto, manifiestos, tools, instrucciones del agente y Workbench, todo explicado en la sesión.
6. **Publicar un repositorio reproducible**: alguien externo debe poder clonarlo, aprovisionar las listas con los datos de ejemplo y desplegar en su tenant en **≤ 30 minutos** siguiendo el README.

## Target Users / Roles

| Rol | En la demo | Necesita |
|---|---|---|
| **Solicitante** (empleado que abrió el ticket) | Responde la encuesta desde Copilot | Contexto precargado, pocas preguntas, confirmación clara |
| **Supervisor de soporte** | Consulta el desempeño de un técnico | Visión por dimensión, tendencia, comentarios relevantes |
| **Técnico de soporte** (persona evaluada) | Aparece en los datos. Puede ver su tablero y el de sus compañeros | Retroalimentación justa, con suficientes datos y sin exponer a quien respondió |
| **Presentador** (autor) | Ejecuta la demo y explica el código | Guion confiable, datos que cuenten una historia, plan B si falla la preview |
| **Asistente / desarrollador de la comunidad** | Descarga el repo | README claro, scripts de aprovisionamiento, datos de ejemplo, sin dependencias de un tenant concreto |

## Scope — In

1. **Solución SPFx 1.24 con dos Copilot UX components** y un agente declarativo ("Asistente de Satisfacción de Soporte"):
   - **Encuesta** (`SatisfactionSurvey`): modo inline. Formulario rediseñado y guardado en una lista de SharePoint.
   - **Tablero del técnico** (`TechnicianScorecard`): resumen inline con opción de pasar a pantalla completa para ver el detalle.
2. **Instrucciones del agente y frases de inicio (conversation starters)** en español, con disparadores como: "calificar la atención", "encuesta de satisfacción", "cómo me atendieron", "evaluar al técnico", "cómo va el desempeño de…".
3. **Modelo de datos en SharePoint: una sola lista `Encuestas`**. No hay lista de tickets: el ticket se guarda como texto en el campo **`Ticket #`**. Columnas: `Ticket #` (texto), `Técnico` (persona), `Resuelto` (Sí/Parcialmente/No), `Comprensión`, `Rapidez`, `Habilidad`, `Comunicación` (número 1–5), `Recomendaría` (Sí/No/No estoy seguro), `Comentarios` (texto multilínea). El solicitante y la fecha se toman de los campos del sistema `Creado por` y `Creado`. Incluye un **script de aprovisionamiento** y **datos de ejemplo ficticios**: unos 6 técnicos y unas 120 respuestas a lo largo de 6 meses, con patrones que cuenten una historia. Por ejemplo, un técnico que comunica muy bien pero responde lento, otro que mejora con el tiempo, otro con pocas respuestas.
4. **Localización** es-ES (principal) y en-US con los archivos `loc` de SPFx, para que el repo sirva a más gente.
5. **Repositorio público**: README (en inglés y español), guía de despliegue, licencia MIT, capturas, guion de la demo y una lista de verificación previa al evento.
6. **Guion de la demo** (`docs/demo-script.md`): pasos, frases exactas para Copilot, tiempos y **plan B** (video grabado y capturas).

## Scope — Out / Non-goals

- Integración con un sistema de tickets real (ServiceNow, Jira, Zendesk). Tampoco hay una lista de tickets en SharePoint: el ticket es solo el texto del campo `Ticket #`.
- Envío automático de la encuesta al cerrar un ticket (Power Automate o correo). Se puede mencionar como siguiente paso.
- Publicación en el marketplace o AppSource (no está soportado durante la preview).
- Reutilizar el componente como web part de SharePoint o pestaña de Teams. Es la dirección del modelo, pero en la preview solo se muestra en Copilot. Queda como extra si la GA llega a tiempo.
- Análisis de sentimiento con IA propia o un modelo externo. Copilot puede resumir comentarios con sus propias capacidades, sin infraestructura adicional.
- Funciones de producción: auditoría, retención, anonimización formal o soporte multi-tenant.

## Functional Requirements Summary

**Épica 1 — Agente declarativo e intención**
- RF-01: El agente reconoce la intención de **responder una encuesta o calificar una atención** e invoca `open_satisfaction_survey`.
- RF-02: El agente reconoce la intención de **consultar el desempeño** de un técnico e invoca `show_technician_scorecard`.
- RF-03: Si falta un dato (qué ticket, qué técnico), el agente pregunta o el componente muestra un selector. Nunca inventa datos.
- RF-04: Frases de inicio visibles: "Calificar mi último ticket", "¿Cómo va el desempeño de un técnico?".

**Épica 2 — Encuesta (`SatisfactionSurvey`)**
- RF-05: Parámetros de la tool: `ticketNumber?` y `technician?` (nombre o correo). Copilot los extrae de la conversación (p. ej. "quiero calificar el ticket 4521 que atendió Ana López") y llegan precargados pero editables. Si faltan, el formulario pide el `Ticket #` (texto) y el técnico (selector de personas del directorio).
- RF-06: Preguntas: resultado (Sí/Parcialmente/No), 4 dimensiones con escala 1–5 etiquetada y sin valor por defecto, recomendación (Sí/No/No estoy seguro) y comentario condicional (problemas B–F).
- RF-07: Validación: las 4 calificaciones y el resultado son obligatorios. El comentario es obligatorio solo si hay No o Parcialmente, o alguna calificación ≤ 2. (Pendiente de confirmar: ¿obligatorio u opcional con insistencia?)
- RF-08: Evita duplicados por `Ticket #` y solicitante (`Creado por`). Si ya hay respuesta, la muestra en modo lectura.
- RF-09: Al enviar, guarda en la lista `Encuestas` con los permisos del usuario y muestra una confirmación con un resumen.

**Épica 3 — Tablero consolidado (`TechnicianScorecard`)**
- RF-10: Parámetros: `technician` (nombre o correo, se resuelve contra el campo de persona `Técnico`) y `period` (último mes, trimestre, semestre o rango). **El periodo se calcula con la fecha de creación de la encuesta (campo de sistema `Creado`)**: se filtran las encuestas cuyo `Creado` cae dentro del rango.
- RF-11: **Vista inline**: calificación general (promedio de las 4 dimensiones), % resuelto, % que recomienda, número de respuestas, y la dimensión **más fuerte** y la **más débil**.
- RF-12: **Vista de pantalla completa**:
  - (a) **Un círculo por dimensión** (4 círculos). Cada círculo tiene 5 contornos concéntricos de guía. Con calificación **1** solo se ve el contorno exterior (círculo vacío) y con **5** el círculo queda **relleno por completo**. El relleno crece desde el centro según el promedio de la dimensión. El área rellena es proporcional a `(promedio − 1) / 4`, para que el tamaño que se percibe sea fiel al número (si se usara el radio, un 3 se vería mucho más pequeño que "la mitad"). El valor numérico (p. ej. "4.3") va siempre al centro o debajo del círculo.
  - (a.1) **Sin comparación con otros técnicos** (decisión del autor): el tablero muestra solo los resultados de la persona consultada. No hay promedio del equipo ni de todas las encuestas.
  - (a.2) La versión inline (RF-11) muestra los 4 círculos en pequeño, sin detalle.
  - (b) Distribución 1–5 por dimensión.
  - (c) Tendencia mensual por dimensión, agrupada por el mes de `Creado`.
  - (d) Resultado Sí/Parcialmente/No.
  - (e) Comentarios recientes, destacando los de calificaciones bajas.
- RF-13: Si hay **menos de 5 respuestas** en el periodo, se muestra "datos insuficientes" en lugar de promedios.
- RF-14: **Todos** los usuarios pueden ver el tablero de cualquier técnico (decisión del autor). Las calificaciones se muestran agregadas y el nombre de quien respondió nunca aparece en el tablero. La lista `Encuestas` debe dar acceso de lectura a todos los usuarios de la demo.

**Épica 4 — Datos y aprovisionamiento**
- RF-14b: Script que crea una **nueva colección de sitios de comunicación** para la demo (`New-PnPSite -Type CommunicationSite`), p. ej. `https://<tenant>.sharepoint.com/sites/encuestas`. Recibe como parámetros la URL del tenant, el alias, el título y el idioma (1034 = español). Si el sitio ya existe, no falla: solo lo reutiliza. La lista `Encuestas` se crea en ese sitio.
- RF-15: Script idempotente que crea la lista `Encuestas` con sus columnas y carga los datos de ejemplo. Los técnicos de ejemplo deben ser usuarios que existan en el tenant, porque `Técnico` es un campo de persona. El script los recibe como parámetro, para que funcione en cualquier tenant. Para que el tablero tenga historia, el script **reescribe la fecha `Creado`** de cada respuesta de ejemplo y las reparte en los últimos 6 meses (con `Set-PnPListItem -UpdateType UpdateOverwriteVersion`, que permite fijar `Created` y `Author`; el parámetro ya se verificó en PnP.PowerShell 1.5.0). Esto solo aplica a los datos de ejemplo; las encuestas reales usan la fecha automática.
- RF-16: Script para limpiar o reiniciar los datos de la demo entre ensayos.

**Épica 5 — Demo y repositorio**
- RF-17: Guion con frases exactas, tiempos y plan B, para una **sesión de 60 minutos en español**. Agenda propuesta: (1) qué son los Copilot UX components y su estado actual, ~10 min; (2) demo en vivo como usuario: encuesta y tablero, ~10 min; (3) cómo se construyó: estructura del proyecto, manifiestos, tools, instrucciones del agente, Copilot Workbench y despliegue, ~20 min; (4) limitaciones de la preview y roadmap, ~5 min; (5) preguntas y enlace al repositorio, ~15 min.
- RF-18: README reproducible, capturas y verificación automática de que no queden marcas reales en el código ni en los datos.

## Technical Stack & Constraints

- **SPFx 1.24** (GA si ya salió. Si no, la versión `@next` y el generador `@microsoft/generator-sharepoint@next`). Toolchain **heft**, TypeScript y **React 18** (el default en 1.24).
- **Node.js**: la versión soportada por SPFx 1.24 (22 LTS. El soporte para 24/26 llega con RC/GA). El entorno del autor tiene Node 22.23.1.
- **UI**: Fluent UI React v9, para que se vea como Microsoft 365 y siga el tema del host. Gráficas en SVG ligero o una librería compatible con React 18. El paquete debe ser pequeño.
- **Datos**: lista `Encuestas` en el sitio de comunicación de la demo, accedida con `SPHttpClient` o PnPjs con los permisos del usuario (SSO). No hay backend propio. Dentro de Copilot el componente no se ejecuta en una página de ese sitio, así que **la URL del sitio debe ser configurable**: una constante de configuración de la solución o una propiedad del tenant. Se decide en el spec, pero nunca va fija en el código público.
- **Agente**: `declarativeAgent.json` (manifiesto v1.8 al generar el proyecto con beta 5 o superior), `instruction.txt` y `ai-plugin.json`. **Subir la `version` del agente con cada cambio.**
- **Aprovisionamiento**: **PnP.PowerShell 1.5.0** sobre PowerShell 7, decidido por el autor.
  - Cada script carga el módulo de forma explícita (`Import-Module PnP.PowerShell -RequiredVersion 1.5.0`). En la máquina del autor también está instalado el módulo antiguo `SharePointPnPPowerShellOnline` 3.29, que define cmdlets con los mismos nombres.
  - **Toda conexión a SharePoint usa `Connect-PnPOnline -Url <url> -UseWebLogin`**. Es un inicio de sesión con el navegador basado en cookies y no necesita registrar una aplicación en Entra ID.
  - Consecuencias de usar `-UseWebLogin`:
    - (a) Solo funciona en **Windows**, porque abre una ventana de navegador embebida. En el README se indica como requisito.
    - (b) Solo da acceso a SharePoint, no a Microsoft Graph. Los cmdlets usados deben ser solo de SharePoint (`New-PnPSite`, `New-PnPList`, `Add-PnPField`, `Add-PnPListItem`, `Set-PnPListItem`).
    - (c) Crear la colección de sitios requiere una cuenta con permiso para crear sitios en el tenant.
  - Sin IDs de tenant ni URLs fijas en el código público: la URL del tenant (`https://bajaworks.sharepoint.com` para el autor) se pasa como parámetro o va en un archivo de configuración local excluido de Git.
- **Accesibilidad**: WCAG 2.1 AA (teclado, contraste, etiquetas en la escala).
- **Restricciones de la preview**:
  - Solo se muestra en Microsoft 365 Copilot y Copilot Chat. Todavía no funciona en Copilot dentro de Teams, Outlook ni Word.
  - La sincronización del agente al catálogo puede tardar, así que hay que **desplegar con anticipación** (mínimo 24 h antes del evento).
  - Las APIs y los esquemas pueden cambiar.
  - Durante la preview no se necesita licencia de Copilot. El licenciamiento de la GA no está confirmado.
- **Repositorio público**: licencia MIT, sin secretos, sin datos personales reales, sin marcas reales. Usar Contoso y personas ficticias.
- **Ubicación del código**: el proyecto SPFx 1.24 vive en **`apps/satisfaction-survey/`**. **El autor hace el scaffolding** con el generador de SPFx. Los sprints parten de ese proyecto generado y no deben regenerarlo. Los scripts de aprovisionamiento y los datos de ejemplo pueden ir en `apps/satisfaction-survey/provisioning/` (por confirmar en el spec).

## Success Criteria

- En los ensayos, **≥ 9 de 10** frases del guion abren el componente correcto con los parámetros correctos.
- Un asistente de prueba responde la encuesta en **≤ 30 s** sin ayuda.
- El tablero se carga en **≤ 2 s** con los datos de ejemplo y la historia de los datos se entiende sin explicación extra.
- Una persona externa clona el repo y despliega en su tenant en **≤ 30 min** solo con el README.
- La verificación de marcas reales no encuentra nada (`Konica`, `Minolta`, `KMBS`, `SKNA`).
- El plan B (video y capturas) está listo y probado antes del evento.

## Open Questions / Risks

**Decisiones tomadas (2026-10-24)**
- Sesión de **1 hora**, en **español**, para **profesionales de TI y desarrolladores de SharePoint**. Se puede mostrar código con detalle. La fecha todavía no está definida.
- Tenant de la demo: **https://bajaworks.sharepoint.com**, con una **nueva colección de sitios de comunicación** solo para la demo. El nombre y la URL del tenant **no** deben aparecer en el código público: se configuran por parámetro.
- Aprovisionamiento con **PnP.PowerShell 1.5.0** y `Connect-PnPOnline -UseWebLogin` (requiere Windows).
- Recomendación: **Sí / No / No estoy seguro** (sin NPS).
- Visibilidad del tablero: **todos** los usuarios.
- Visualización: **círculos por dimensión** que se rellenan del 1 (solo contorno) al 5 (relleno completo), sin comparación contra un promedio general (RF-12).

- **Licencia (2026-10-24):** en Copilot real los componentes devuelven `403 copilot_license_required` con una cuenta *Copilot Chat (Basic)*. Decisión (opción C): la demo en vivo usa el **Copilot Workbench**, y en la sesión se muestra el diagnóstico con **`-developer on`** (versión del agente, herramienta Matched/Selected, argumentos, URL del MCP y el 403) como lección sobre la versión final. Si se consigue una licencia de Microsoft 365 Copilot antes del evento, la demo pasa a Copilot real.

**Preguntas abiertas**
1. **Fecha del evento.** El evento es **Microsoft 365 Live 2026** y la sesión quedó confirmada en Sessionize el 2026-10-23. Los organizadores publicarán los horarios definitivos a principios de la semana del 26 de octubre.
2. ¿El comentario es **obligatorio** u **opcional con insistencia** cuando la calificación es baja?
3. ¿Nombre del repositorio y del agente? ¿README principal en inglés o en español?
4. ¿El tenant bajaworks ya tiene App Catalog, permisos de administrador y Copilot Chat habilitado?
5. ~~Alias del sitio~~ → decidido: `/sites/encuestas`.

**Riesgos**
- **Cambios de última hora en la preview** (nombre, esquemas, comportamiento). Mitigación: fijar versiones, probar la semana del evento y tener el plan B.
- **Retraso en la sincronización del agente** o en la propagación del CDN. Mitigación: desplegar con 24–48 h de anticipación y no redesplegar el día del evento.
- **La intención no se detecta de forma consistente**. Mitigación: instrucciones con ejemplos, frases de inicio y un guion con frases ya probadas.
- **Conectividad del lugar del evento**. Mitigación: video grabado y hotspot de respaldo.
- **Privacidad percibida** al mostrar el "desempeño de una persona", sobre todo porque el tablero es visible para **todos**. Mitigación: datos ficticios, mínimo de respuestas, calificaciones agregadas, nunca mostrar quién respondió y mensaje de que se trata de una herramienta de mejora y no de castigo. En el README se recomienda restringir el acceso si alguien lo usa en un entorno real.
- **Lectura engañosa de los círculos** si el relleno se escala por radio en lugar de por área. Mitigación: escalar por área (RF-12) y mostrar siempre el número.
- **Licenciamiento en la GA**: puede cambiar lo que la audiencia necesita para probarlo. Hay que mencionarlo en la sesión.

## Input Sources

- refdocs: `refdocs/narrative.md`, `refdocs/formexample.png` (analizada visualmente), `refdocs/project-constraints.md`, `refdocs/README.md`
- clarifications: `planning/clarifications/brief.json`
- externas (verificadas 2026-10-24): Microsoft Learn *Overview of Copilot UX components*; Microsoft 365 Developer Blog (anuncio de la preview, 2026-07-09; renombre y roadmap, 2026-09-30); muestras `github.com/pnp/spfx-copilot-apps`
- source-code: no aplica (reverse engineering = no)
