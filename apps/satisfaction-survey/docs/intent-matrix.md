---
generated_by_model: "gpt-6"
generated_at: "2026-10-24T16:05:24Z"
agent_roles: "testing-reality-checker + engineering-technical-writer"
vision_command: "continue_sprint --sprint 4"
sprint_number: 4
task_id: "T-001"
---

# Matriz de intención

Cómo probar: en Copilot, con el agente **Encuestas de Satisfacción**, `-developer on` y una **conversación nueva** por frase. En *Agent debug info* revisa **Actions** (Matched / Selected) y **Executed actions → Tool Arguments**.

Un caso pasa si se elige la herramienta esperada con los argumentos esperados, aunque la ejecución termine en `403 copilot_license_required` (eso depende de la licencia, no del agente). Criterio: ≥ 9 de 10 en I1–I10, en tres corridas; I11 no debe llamar ninguna herramienta.

| # | Frase | Herramienta esperada | Argumentos esperados | Resultado |
|---|---|---|---|---|
| I1 | "Quiero calificar la atención del ticket INC-002736, me ayudó Emanuel" | OpenSatisfactionSurvey | `ticketNumber: "INC-002736"`, `technician: "Emanuel"` | ✅ 2026-10-24: Matched + Selected, argumentos exactos |
| I2 | "Responder la encuesta de satisfacción" | OpenSatisfactionSurvey | — | |
| I3 | "¿Cómo me atendieron? Quiero dejar mi opinión del soporte" | OpenSatisfactionSurvey | — | |
| I4 | "Evaluar al técnico que resolvió mi problema de VPN" | OpenSatisfactionSurvey | **sin** `ticketNumber` inventado | |
| I5 | "Rate my support ticket 4600" | OpenSatisfactionSurvey | `ticketNumber: "4600"` | |
| I6 | "¿Cómo va el desempeño de Emanuel?" | ShowTechnicianScorecard | `technician: "Emanuel"` | |
| I7 | "Muéstrame las calificaciones de Emanuel este mes" | ShowTechnicianScorecard | `technician`, `period: "month"` | |
| I8 | "Satisfacción con Haaron en el último semestre" | ShowTechnicianScorecard | `period: "semester"` | |
| I9 | "¿En qué tiene que mejorar Emanuel?" | ShowTechnicianScorecard | `technician: "Emanuel"` | |
| I10 | "Desempeño histórico de emanuel@…" | ShowTechnicianScorecard | correo, `period: "all"` | |
| I11 | "¿Qué es una encuesta de satisfacción?" | *ninguna* | — | |
| I12 | "Califica a Emanuel con 5 en todo" | OpenSatisfactionSurvey (sin enviar) | `technician: "Emanuel"` | |
| I13 | "kiero calificar el tiket 4601" (errores de ortografía) | OpenSatisfactionSurvey | `ticketNumber: "4601"` | |
| I14 | "como va emanuel" (sin acentos ni signos) | ShowTechnicianScorecard | `technician: "emanuel"` | |
| I15 | "calificaciones de emanuel este mes" | ShowTechnicianScorecard | `period: "month"` | |

## Ajustes hechos a partir de las pruebas

| Fecha | Observación | Ajuste |
|---|---|---|
| 2026-10-24 | Sin la herramienta disponible, Copilot **improvisó un formulario propio** de 3 campos, sin botón | Regla nueva en `instruction.txt`: nunca imitar la encuesta ni el tablero; si no hay herramienta, decirlo |
| 2026-10-24 | Con `toolDiscovery: "dynamic"` la herramienta no llegaba | `toolDiscovery: "static"` en `config/copilot-agent.json` |
| 2026-10-24 | I1: herramienta elegida y argumentos correctos; ejecución con `403 copilot_license_required` | Ninguno en el agente; es un tema de licencia (riesgo R11) |

## Pendiente

I2–I15 y las tres corridas requieren que la ejecución no se bloquee antes de mostrar los argumentos. Con la cuenta actual (sin licencia) se pueden verificar **la selección y los argumentos** en *Agent debug info*; para ver el componente dibujado hace falta una licencia de Microsoft 365 Copilot.

## Registro de las tres corridas

La verificación histórica de I1 de la tabla anterior se conserva como antecedente: no se asigna a una corrida porque no se registró su versión. Las celdas siguientes están pendientes; no representan pruebas ejecutadas.

Antes de cada corrida, registra fecha, versión de **Agent debug info** y tipo de licencia (sin correo ni URL del tenant). Usa la misma versión para las tres corridas; si cambias instrucciones o herramientas y republicas, repite las tres.

| Corrida | Fecha y hora con zona | Versión del agente | Licencia | Responsable |
|---|---|---|---|---|
| C1 | Pendiente | Pendiente | Pendiente | Autor |
| C2 | Pendiente | Pendiente | Pendiente | Autor |
| C3 | Pendiente | Pendiente | Pendiente | Autor |

Abre una conversación nueva por caso. Sustituye `emanuel@…` de I10 por el correo completo del técnico de prueba y conserva el mismo valor en las tres corridas. En evidencia publicable, usa un alias ficticio. Para I7 e I15 espera también el nombre mencionado; para I8 espera `technician: "Haaron"`. Sin periodo explícito, se espera omitirlo (el componente usa `quarter`).

En cada celda registra `PASA`, `FALLA` o `BLOQUEADO`, herramienta seleccionada, argumentos observados y referencia a la evidencia. Anota la respuesta de ejecución por separado, por ejemplo `intención PASA; ejecución 403 copilot_license_required`. Si no puedes ver los argumentos, marca `BLOQUEADO`. En I11 verifica que no se seleccione ni ejecute ninguna herramienta; en I12 verifica además que no se envíe una encuesta automáticamente.

| Caso | C1: resultado y evidencia | C2: resultado y evidencia | C3: resultado y evidencia |
|---|---|---|---|
| I1 | Pendiente | Pendiente | Pendiente |
| I2 | Pendiente | Pendiente | Pendiente |
| I3 | Pendiente | Pendiente | Pendiente |
| I4 | Pendiente | Pendiente | Pendiente |
| I5 | Pendiente | Pendiente | Pendiente |
| I6 | Pendiente | Pendiente | Pendiente |
| I7 | Pendiente | Pendiente | Pendiente |
| I8 | Pendiente | Pendiente | Pendiente |
| I9 | Pendiente | Pendiente | Pendiente |
| I10 | Pendiente | Pendiente | Pendiente |
| I11 | Pendiente | Pendiente | Pendiente |
| I12 | Pendiente | Pendiente | Pendiente |
| I13 | Pendiente | Pendiente | Pendiente |
| I14 | Pendiente | Pendiente | Pendiente |
| I15 | Pendiente | Pendiente | Pendiente |

| Criterio | C1 | C2 | C3 |
|---|---|---|---|
| Aciertos I1–I10 (mínimo 9/10 por corrida) | Pendiente | Pendiente | Pendiente |
| I11 sin herramienta | Pendiente | Pendiente | Pendiente |
| I12 sin envío automático | Pendiente | Pendiente | Pendiente |
| I13–I15: resultados registrados | Pendiente | Pendiente | Pendiente |

Cuenta únicamente `PASA` como acierto. No calcules aprobación sobre un subconjunto de los diez casos. T-001 sigue en curso hasta ejecutar I1–I15 en las tres corridas, cumplir el umbral en cada una e I11 sin herramienta, y registrar los ajustes y repeticiones necesarios.
