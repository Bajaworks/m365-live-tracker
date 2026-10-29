# Encuesta de Satisfacción en Copilot — demo de Copilot UX components

Planeación y construcción de una **demo en vivo de 60 minutos** sobre **Copilot UX components** (antes *SharePoint Copilot Apps*), la capacidad de SharePoint Framework 1.24 que dibuja interfaces interactivas dentro de Microsoft 365 Copilot.

El caso de uso: una **encuesta de satisfacción de soporte** que Copilot abre cuando el usuario quiere calificar una atención, y un **tablero** con el desempeño de cada técnico en cuatro dimensiones. Todo se planeó y construyó con el **framework VISION** (brief → spec kit → sprints → ejecución).

| | |
|---|---|
| **Estado** | Sprints 1–3 cerrados · Sprint 4 (*Listo para el escenario*) en curso |
| **Código** | [apps/satisfaction-survey/](apps/satisfaction-survey/) — SPFx 1.24.0 (GA), React 18, Fluent UI v9 |
| **Evento** | **Microsoft 365 Live 2026** — sesión confirmada; horario por publicar (semana del 26 de octubre) |
| **Audiencia de la sesión** | Profesionales de TI y desarrolladores de SharePoint · español · 1 hora |
| **Formato de la demo** | Copilot Workbench en vivo + diagnóstico en Copilot real con `-developer on` |
| **Datos** | Empresa ficticia (Contoso) y respuestas de ejemplo generadas |

---

## Qué se construyó

Un **agente declarativo**, "Encuestas de Satisfacción", con **dos Copilot UX components** en un solo proyecto SPFx:

| Componente | Herramienta | Qué hace |
|---|---|---|
| Encuesta | `OpenSatisfactionSurvey(ticketNumber?, technician?)` | Formulario dentro del chat, con ticket y técnico precargados desde la frase del usuario. Guarda en SharePoint. |
| Tablero | `ShowTechnicianScorecard(technician, period?)` | Un círculo por dimensión, % resuelto y % que recomienda, distribución 1–5, tendencia mensual y comentarios sin autor. Vista inline y pantalla completa. |

**El formulario original se rediseñó** a partir del análisis del ejemplo en `refdocs/`:
- **Identificación:** ahora pide el técnico, que el original no identificaba.
- **Respuestas explícitas:** "Resultado" usa Sí / Parcialmente / No y "¿Recomendarías?" usa Sí / No / No estoy seguro. El original usaba casillas, y una casilla vacía no distingue "No" de "no contestó".
- **Escalas sin sesgo:** van del 1 al 5 sin valor preseleccionado (el original traía el 3 marcado) y con una etiqueta en cada punto.
- **Comentario condicional:** es obligatorio cuando el problema no se resolvió del todo o hay una calificación ≤ 2.
- **Sin duplicados:** una sola respuesta por ticket y por usuario.

**Dimensiones:** Comprensión · Rapidez · Habilidad · Comunicación.
**Visualización:** cada círculo se llena **por área** según el promedio. Con 1 se ve solo el contorno y con 5 queda lleno, sin comparación con otros técnicos.

**Lado de SharePoint:** un sitio de comunicación `/sites/encuestas` y la lista **Encuestas**:
- Columnas con el prefijo `m365live_`, como `m365live_Communication`.
- Permisos: todos leen todo y cada quien edita solo lo suyo.
- Se aprovisiona con **PnP.PowerShell 1.5.0** y `-UseWebLogin`, más datos de ejemplo con fechas repartidas en 6 meses.

Detalles técnicos y cómo probarlo: **[apps/satisfaction-survey/README.md](apps/satisfaction-survey/README.md)**.

---

## Cómo se llevó el proceso (VISION)

```
init → generate_brief → generate_spec_kit → generate_sprints
     → start_sprint 1 → start_sprint 2 → start_sprint 3 → start_sprint 4 (en curso)
```

| Paso | Resultado |
|---|---|
| `init` | Proyecto nuevo, sin ingeniería inversa. Se reinició el estado de un proyecto anterior |
| `generate_brief` | [spec-kit/input/brief.md](spec-kit/input/brief.md): objetivos, alcance, análisis del formulario y decisiones del autor |
| `generate_spec_kit` | [spec-kit/input/](spec-kit/input/): PRD, especificación técnica, modelo de datos, api-spec, épicas, 22 historias, plan de sprints y plan de pruebas |
| `generate_sprints` | 4 sprints en [planning/sprints/](planning/sprints/) (40 tareas). Se escribieron a mano porque el generador automático convertía cada criterio de aceptación en una historia |
| Sprint 1 — Datos y fundaciones | Sitio, lista, permisos y datos de ejemplo en el tenant; capa compartida con pruebas |
| Sprint 2 — Encuesta en Copilot | Formulario completo, probado en el Workbench con escritura real en la lista; primer despliegue |
| Sprint 3 — Tablero | Tablero inline y en pantalla completa, con gráficas validadas para daltonismo y tema oscuro |
| Sprint 4 — Listo para el escenario | Guion de 60 minutos, README en español e inglés, licencia MIT y matriz de intención (en curso) |

**Calidad:** 73 pruebas unitarias, build sin advertencias de lint y un verificador de marcas (`npm run check-branding`) que falla si aparece una marca real o un tenant concreto.

---

## Hallazgos clave

Están documentados en [docs/spikes.md](apps/satisfaction-survey/docs/spikes.md) y en los riesgos de [technical-spec.md](spec-kit/input/technical-spec.md).

| # | Hallazgo | Qué hicimos |
|---|---|---|
| 1 | **Licencia:** en Copilot real los componentes devuelven `403 {"reason":"copilot_license_required"}` con una cuenta *Copilot Chat (Basic)*. Le pasa también al ejemplo *My Day* de Microsoft. El Workbench funciona sin licencia | Demo en el Workbench, y el 403 se muestra en la sesión como lección (riesgo R11) |
| 2 | **`-developer on`** en Copilot muestra la versión del agente, la herramienta *Matched/Selected*, los argumentos, la URL del servidor MCP y la respuesta | Es la primera herramienta de diagnóstico y un segmento de la demo |
| 3 | En Copilot no hay página de SharePoint: el "sitio actual" es la **raíz del tenant** | El sitio se resuelve con el origin + `/sites/encuestas`, o con una propiedad del tenant |
| 4 | Con `toolDiscovery: "dynamic"` la herramienta no le llegaba a Copilot | `toolDiscovery: "static"` en `config/copilot-agent.json` |
| 5 | Sin herramienta disponible, Copilot **improvisó un formulario propio** que no guardaba nada | Regla en las instrucciones: nunca imitar la encuesta ni el tablero |
| 6 | No existe un campo de "keywords": Copilot decide con las instrucciones, la descripción de la herramienta y el `.describe()` de cada parámetro | Esos tres textos llevan las frases que disparan cada herramienta |
| 7 | El componente puede informarle al modelo lo que pasó (`updateModelContextAsync`) | Copilot puede confirmar una encuesta guardada y responder sobre el tablero con cifras reales, nunca con comentarios |
| 8 | **PnP.PowerShell 1.5.0:** `Set-PnPList -ReadSecurity 1` dejaba "leer solo los propios", y un correo en un campo Persona llegaba vacío | Permisos asignados con CSOM y verificados; el campo Persona se escribe con el Id del usuario como texto |
| 9 | Dos versiones distintas: *App version* (`package-solution.json`) y la del agente (la sube el build) | `npm run release` sube la versión del paquete y compila |
| 10 | El empaquetado mete **todos** los zips de `teams/`; uno viejo habría publicado un segundo agente | `teams/*.zip` en `.gitignore`; borrar los zips viejos al renombrar el agente |

---

## Cómo continuar

**Ver en qué etapa está VISION:**
```bash
npm run status          # o: node scripts/status-report.js
```

**Retomar el sprint 4:** escribe `continue_sprint` en el agente del IDE. Pendientes (ver [planning/sprints/sprint-04/tasks.md](planning/sprints/sprint-04/tasks.md)):

| Tarea | Qué falta | Quién |
|---|---|---|
| T-001 Matriz de intención | Correr I2–I15 con `-developer on`. Se puede **sin licencia**: la tarjeta muestra herramienta y argumentos aunque la respuesta sea 403 | Autor |
| T-002 Despliegue final | Con el horario de Microsoft 365 Live 2026 (por publicar) → publicar a T−48 h (`npm run release` → App Catalog → **Add to Teams**) | Autor |
| T-004 Plan B | 10 capturas y el video, según [docs/screenshots/README.md](apps/satisfaction-survey/docs/screenshots/README.md) | Autor |
| T-006 Verificación final | `npm run check-branding` en verde (hoy falla por `provisioning/demo.config.sample.psd1`) y probar el README en otro tenant | Autor + agente |

**Antes de publicar en GitHub:**
1. Decidir qué se publica: todo este repositorio o solo `apps/satisfaction-survey`.
2. `npm run check-branding` en verde: el archivo de ejemplo no debe tener la URL ni el Id del tenant real.
3. Agregar las capturas, porque el README de la app usa `docs/screenshots/scorecard-fullscreen.png`.
4. Hacer el commit. Hasta ahora todos los cambios están sin commit, por decisión del autor.

**Si consigues una licencia de Microsoft 365 Copilot:** asígnala a la cuenta del presentador y a la cuenta sin permisos de administrador. Después repite la matriz de intención y la prueba de permisos (R2), y pasa los bloques 2 y 4 del guion a Copilot real.

**Documentos de la sesión:**
- [Guion de 60 minutos](apps/satisfaction-survey/docs/demo-script.md)
- [Despliegue, pruebas y diagnóstico](apps/satisfaction-survey/docs/deployment.md)
- [Matriz de intención](apps/satisfaction-survey/docs/intent-matrix.md)
- [Aprovisionamiento](apps/satisfaction-survey/provisioning/README.md)

---

## Estructura del repositorio

```
apps/satisfaction-survey/  Proyecto SPFx: componentes, agente, scripts de PnP, documentación
refdocs/                   Material de origen: formulario de ejemplo, narrativa, restricciones (no se versiona)
spec-kit/input/            Brief, PRD, especificación técnica, modelo de datos, historias, planes
planning/                  Estado del workflow, clarificaciones y los 4 sprints
commands/                  Comandos de VISION (fuente de verdad)
agency-agents/agents/      Definiciones de roles de agentes
scripts/                   Scripts Node.js de VISION
docs/                      Documentación y curso de VISION
```

## Trabajar con VISION

El flujo se gobierna con comandos que se escriben en el agente del IDE (Claude Code, Cursor, Copilot…). El agente lee `commands/<nombre>.md`, ejecuta los scripts y propone el siguiente paso.

```bash
npm install
npm run setup:ide     # configuración del agente del IDE (local, no se versiona)
npm run status        # ¿en qué etapa está el proyecto?
npm run status:web    # tablero local en http://127.0.0.1:4173
```

Si no sabes qué sigue, usa `next_step`. Más información: [AGENTS.md](AGENTS.md) · [GUIA_COMPLETA_VISION.md](GUIA_COMPLETA_VISION.md) · [commands/agent_declaration.md](commands/agent_declaration.md).
