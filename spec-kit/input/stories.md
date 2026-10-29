---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:10:00Z'
agent_roles: 'IDE Agent + product-manager + engineering-frontend-developer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Historias de usuario

Estimación en puntos: 1 = trivial, 2 = pequeño, 3 = medio, 5 = grande.

## EP-01 — Datos y aprovisionamiento

### ST-01 — Configuración local y conexión (2)
Como presentador, quiero un único archivo de configuración local y un helper de conexión, para no repetir la URL del tenant ni el método de login en cada script.
- **CA1:** existe `provisioning/demo.config.sample.psd1` con valores de ejemplo (`contoso`). `demo.config.local.psd1` está en `.gitignore`.
- **CA2:** `Connect-Demo.ps1` importa `PnP.PowerShell -RequiredVersion 1.5.0` y se conecta con `Connect-PnPOnline -Url <url> -UseWebLogin`.
- **CA3:** si falta la configuración local, el error dice qué archivo copiar.

### ST-02 — Crear el sitio de comunicación (2) · RF-15
Como presentador, quiero crear el sitio de la demo con un comando.
- **CA1:** `New-DemoSite.ps1` crea `/sites/<alias>` como sitio de comunicación con el título y el LCID configurados.
- **CA2:** si el sitio ya existe, termina sin error e indica que lo reutilizó.
- **CA3:** al final muestra la URL del sitio.

### ST-03 — Crear la lista Encuestas (3) · RF-16
Como presentador, quiero la lista con sus columnas, vistas y permisos correctos.
- **CA1:** los campos, tipos, opciones e índices coinciden con `data-model.md`. `Title` se muestra como "Ticket #".
- **CA2:** la lista no hereda permisos del sitio: *Everyone except external users* tiene Contribute, con `ReadSecurity = 1` y `WriteSecurity = 2`.
- **CA3:** si se ejecuta dos veces, no duplica nada ni falla.
- **CA4:** existen las vistas "Todas las encuestas" y "Por técnico".

### ST-04 — Generar y cargar los datos de ejemplo (5) · RF-17
Como presentador, quiero unas 120 respuestas ficticias que cuenten una historia en 6 meses.
- **CA1:** `sample-data/surveys.json` existe, es determinista y cumple los perfiles T1–T6 de `technical-spec.md` §9, con comentarios ficticios en español.
- **CA2:** `Import-SampleData.ps1` relaciona T1…Tn con los correos configurados y crea los elementos con `m365live_IsSample = Sí`.
- **CA3:** la fecha `Created` de cada elemento queda en `hoy − daysAgo` (con `UpdateOverwriteVersion`).
- **CA4:** con menos de 6 técnicos configurados, carga solo los perfiles disponibles y avisa.

### ST-05 — Reiniciar los datos de la demo (2) · RF-18
- **CA1:** `Reset-DemoData.ps1 -OnlyLive` borra solo los elementos con `m365live_IsSample = No`.
- **CA2:** `Reset-DemoData.ps1 -Reseed` borra todo y vuelve a cargar los datos de ejemplo.
- **CA3:** pide confirmación, salvo que se use `-Force`.

### ST-06 — Configuración opcional en el tenant (1) · RF-19
- **CA1:** `Set-DemoConfig.ps1` guarda la storage entity `SatisfactionSurveySite` (conectándose al App Catalog).
- **CA2:** el README explica que este paso es opcional si se usa el alias predeterminado.

## EP-02 — Fundaciones compartidas

### ST-07 — Modelo, configuración y resolución del sitio (2) · RF-19
- **CA1:** `shared/model/survey.ts` y `shared/config/settings.ts` coinciden con `data-model.md`.
- **CA2:** `SiteResolver` usa la storage entity si existe y, si no, `origin + DEFAULT_SITE_PATH`. Tiene pruebas unitarias con respuestas simuladas.

### ST-08 — Repositorio de datos (3)
- **CA1:** `SurveyRepository` implementa `getCurrentUser`, `findExisting(ticket)`, `create(draft)`, `getByTechnician(email, period)` y `listTechnicians()` según `api-spec.yaml`.
- **CA2:** `create` resuelve el técnico con `ensureuser` y hace `POST items` con `m365live_TechnicianId` (plan B: `AddValidateUpdateItemUsingPath`). Ante un error, lanza un mensaje legible. El repositorio recibe un puerto HTTP (`IHttpPort`), así que se puede probar sin SPFx.
- **CA3:** convierte los elementos de la lista a `ISurveyRecord` (con pruebas).

### ST-09 — Lógica pura con pruebas (3)
- **CA1:** `validation`, `period`, `aggregation` y `scoreGeometry` tienen pruebas unitarias que pasan con `heft test`.
- **CA2:** cubren: la regla del comentario, `n < 5`, empates en la dimensión más fuerte o débil, la agrupación mensual, `fillRadius(1) = 0` y `fillRadius(5) = R`.

### ST-10 — Controles de UI reutilizables (3)
- **CA1:** `RatingScale` (radiogroup accesible, sin valor inicial, etiquetas por punto), `ChoiceGroup` (botones segmentados) y `PersonField` (búsqueda y foto).
- **CA2:** `ScoreCircle` dibuja el relleno por área, los contornos guía 2–4, el valor y su `aria-label`.
- **CA3:** funcionan en tema claro y oscuro.

## EP-03 — Encuesta en Copilot

### ST-11 — Parámetros y manifiesto de la encuesta (1) · RF-05
- **CA1:** el schema de zod tiene `ticketNumber?` y `technician?` con descripciones. La tool se llama `OpenSatisfactionSurvey` y su descripción incluye palabras clave en español e inglés. Su único modo es `inline`.

### ST-12 — Formulario rediseñado (5) · RF-06, RF-07
Como solicitante, quiero calificar la atención en menos de 30 segundos.
- **CA1:** se reemplaza la interfaz de ejemplo. Los bloques son Contexto → Resultado → Calificación (4) → Recomendación → Comentario.
- **CA2:** los parámetros recibidos se precargan y se pueden editar. Si el técnico viene como nombre, se resuelve con `PersonField`.
- **CA3:** el comentario se vuelve obligatorio, con su pregunta específica, según la regla.
- **CA4:** "Enviar" está deshabilitado hasta que todo sea válido, y los errores se muestran junto a cada campo.
- **CA5:** textos en es-ES y en-US.

### ST-13 — Envío, duplicados y seguimiento (3) · RF-08, RF-09
- **CA1:** si ya existe una respuesta del usuario para ese Ticket #, se muestra en modo lectura.
- **CA2:** al enviar se crea el elemento y aparece una confirmación con un resumen.
- **CA3:** el botón "Ver desempeño de {técnico}" llama a `sendFollowUpMessageAsync` con "¿Cómo va el desempeño de {técnico}?".
- **CA4:** los errores de red o de permisos muestran un mensaje claro y la opción de reintentar.

## EP-04 — Tablero del técnico

### ST-14 — Agregar el componente TechnicianScorecard (1) · *lo hace el autor*
- **CA1:** el autor ejecuta `yo @microsoft/sharepoint` en `apps/satisfaction-survey`: Copilot Component, nombre `technician-scorecard`, plantilla React.
- **CA2:** `config/copilot-agent.json` incluye los dos IDs de componente en el mismo agente.

### ST-15 — Parámetros, identificación del técnico y carga de datos (3) · RF-10
- **CA1:** el schema de zod tiene `technician` y `period?` (predeterminado `quarter`). La tool se llama `ShowTechnicianScorecard` y sus modos son `inline` y `fullscreen`.
- **CA2:** el técnico se identifica según `technical-spec.md` §5.2. Si no se encuentra, se muestran sugerencias; si hay ambigüedad, un selector.

### ST-16 — Vista inline (3) · RF-11, RF-13
- **CA1:** muestra la calificación general, n, los 4 círculos pequeños, % resuelto, % que recomienda, la dimensión más fuerte y la más débil.
- **CA2:** con `n < 5` muestra "Datos insuficientes (n = X)".
- **CA3:** "Ver detalle" llama a `requestDisplayModeAsync('fullscreen')`.

### ST-17 — Vista de pantalla completa (5) · RF-12, RF-14
- **CA1:** 4 círculos grandes, distribución 1–5, tendencia mensual, resultado y comentarios recientes, con los de calificaciones bajas destacados.
- **CA2:** el selector de periodo vuelve a calcular todo sin volver a llamar a la tool.
- **CA3:** no aparece ningún dato del solicitante.
- **CA4:** se adapta cuando el host vuelve a inline (`onHostContextChanged`).

## EP-05 — Agente declarativo e intención

### ST-18 — Agente, instrucciones y frases de inicio (2) · RF-01 a RF-04
- **CA1:** `manifest.json`, `declarativeAgent.json` y `ai-plugin.json` tienen nombre y descripción en español con Contoso como desarrollador. Las frases de inicio son las de RF-04.
- **CA2:** `instruction.txt` sigue `technical-spec.md` §3.
- **CA3:** la `version` del agente sube en cada cambio, y esa regla está documentada en el README.

### ST-19 — Ajuste de intención con la matriz de frases (2)
- **CA1:** la matriz de `test-plan.md` §4 (≥ 15 frases) se ejecuta en Copilot sobre bajaworks, con ≥ 90 % de aciertos en las 10 frases del guion.
- **CA2:** los ajustes a las instrucciones y descripciones quedan registrados.

## EP-06 — Demo y repositorio público

### ST-20 — Despliegue en bajaworks (2)
- **CA1:** el `.sppkg` se sube, se activa y se sincroniza con **Add to Teams**. El agente aparece en Copilot Chat.
- **CA2:** hay un checklist de "T−48 h / T−24 h / T−1 h" en `docs/deployment.md`.

### ST-21 — Guion de la demo y plan B (3) · RF-20
- **CA1:** `docs/demo-script.md` tiene la agenda de 60 minutos, las frases exactas, qué código mostrar (archivo y línea) y los tiempos.
- **CA2:** hay video grabado y capturas de cada paso en `docs/screenshots/`.
- **CA3:** se hicieron al menos 2 ensayos completos con el tiempo medido.

### ST-22 — README, licencia y verificación de marcas (3) · RF-21
- **CA1:** `README.md` (es) y `README.en.md` explican requisitos, aprovisionamiento, build, Workbench, despliegue y limitaciones de la preview, en ≤ 30 minutos de lectura y ejecución.
- **CA2:** licencia MIT. `package-solution.json` y el manifiesto con Contoso como desarrollador.
- **CA3:** `node tools/check-branding.js` termina sin errores. Se ejecuta antes de publicar.
