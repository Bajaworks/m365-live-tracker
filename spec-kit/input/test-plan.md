---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:10:00Z'
agent_roles: 'IDE Agent + testing-reality-checker + testing-accessibility-auditor'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Plan de pruebas

## 1. Pruebas unitarias (jest con `heft test`, automáticas)

| Módulo | Casos clave |
|---|---|
| `validation` | Formulario vacío → errores en Ticket #, Técnico, Resultado y las 4 dimensiones. Resultado "Sí" con todo > 2 → comentario opcional. Resultado "Parcialmente" o "No" → comentario obligatorio. Alguna dimensión = 2 → comentario obligatorio. Ticket # solo con espacios → error |
| `period` | month/quarter/semester restan 1/3/6 meses; `all` no filtra; meses cortos (31 → 30) |
| `aggregation` | n = 0, n = 4 → `insufficient`; promedios exactos; `overall` = promedio de los 4 promedios; distribución que suma n; % resuelto y % que recomienda; empates en la dimensión más fuerte o débil; agrupación mensual por `Created`; los comentarios bajos marcados `low` |
| `scoreGeometry` | `fillRadius(1) = 0`, `fillRadius(5) = R`, `fillRadius(3) = R·√0.5`, valores fuera de rango se limitan a [1, 5] |
| `SiteResolver` | Hay storage entity → se usa. Vacía o con error → ruta por defecto |
| `SurveyRepository` (mapeo) | Elemento REST → `ISurveyRecord`; `AddValidate` con `HasException` → error legible |

## 2. Componentes en el Copilot Workbench (manual, cada sprint)

| # | Caso | Resultado esperado |
|---|---|---|
| W1 | Encuesta sin parámetros | Contexto vacío y editable; Enviar deshabilitado |
| W2 | Encuesta con `ticketNumber` y `technician` | Precargados y editables; foto del técnico |
| W3 | Enviar una respuesta válida | Elemento creado en `Encuestas` con `Created` = ahora y `Author` = el usuario |
| W4 | Repetir el mismo ticket | Modo lectura con la respuesta anterior |
| W5 | Usuario sin permisos o sitio inexistente | Mensaje claro y opción de reintentar |
| W6 | Tablero de T1 (quarter) | Valores iguales a los calculados a mano a partir del JSON |
| W7 | Tablero de T6 | "Datos insuficientes (n = 3)" |
| W8 | Nombre ambiguo o inexistente | Selector o sugerencias |
| W9 | Inline → fullscreen → inline | La vista se adapta sin errores |
| W10 | Tema oscuro | Contraste correcto y círculos visibles |

## 3. Aprovisionamiento (manual, en bajaworks y en un segundo sitio de prueba)

- P1: `New-DemoSite` dos veces → la segunda vez reutiliza el sitio.
- P2: `New-SurveyList` dos veces → sin duplicados. Los permisos y `WriteSecurity = 2` se verifican en la configuración de la lista.
- P3: `Import-SampleData` → unos 120 elementos con `Created` repartido en 6 meses (se verifica en la vista ordenando por Creado).
- P4: `Reset-DemoData -OnlyLive` borra solo lo creado en vivo.
- P5: una cuenta sin permisos de administrador (en bajaworks, la segunda cuenta con licencia) puede crear un elemento y no puede editar el de otra persona.
- P7: un técnico **sin licencia** se resuelve en el campo Persona, tanto al importar los datos como en el selector del formulario (R8).
- P6: los scripts fallan con un mensaje claro si no está PnP.PowerShell 1.5.0 o falta la configuración local.

## 4. Matriz de intención en Copilot (bajaworks, S2 y S4)

| # | Frase | Tool esperada | Parámetros esperados |
|---|---|---|---|
| I1 | "Quiero calificar la atención del ticket 4521, me ayudó Ana López" | OpenSatisfactionSurvey | 4521, Ana López |
| I2 | "Responder la encuesta de satisfacción" | OpenSatisfactionSurvey | — |
| I3 | "¿Cómo me atendieron? Quiero dejar mi opinión del soporte" | OpenSatisfactionSurvey | — |
| I4 | "Evaluar al técnico que resolvió mi problema de VPN" | OpenSatisfactionSurvey | — (sin inventar ticket) |
| I5 | "Rate my support ticket 4600" | OpenSatisfactionSurvey | 4600 |
| I6 | "¿Cómo va el desempeño de Ana López?" | ShowTechnicianScorecard | Ana López, quarter |
| I7 | "Muéstrame las calificaciones de Ana este mes" | ShowTechnicianScorecard | Ana, month |
| I8 | "Satisfacción de los usuarios con Luis en el último semestre" | ShowTechnicianScorecard | Luis, semester |
| I9 | "¿En qué tiene que mejorar Ana?" | ShowTechnicianScorecard | Ana |
| I10 | "Desempeño histórico de ana.lopez@…" | ShowTechnicianScorecard | correo, all |
| I11 | "¿Qué es una encuesta de satisfacción?" | *Ninguna* (respuesta en texto) | — |
| I12 | "Califica a Ana con 5 en todo" | OpenSatisfactionSurvey, sin enviar | Ana (el usuario confirma en el formulario) |
| I13–I15 | Variantes con errores de ortografía y sin acentos de I1, I6 e I7 | Igual que la original | — |

Criterio: ≥ 9/10 aciertos en I1–I10 en tres corridas. I11 no debe abrir ningún componente.

## 5. Accesibilidad (WCAG 2.1 AA)
- Todo el formulario se puede llenar solo con teclado, con el foco visible.
- El lector de pantalla anuncia "Comprensión, 4 de 5, Bueno" en la escala, y "Comunicación: 4.3 de 5" en los círculos.
- Contraste ≥ 4.5:1 en textos y ≥ 3:1 en los contornos de los círculos, en los dos temas.
- El tablero no depende solo del color: siempre muestra el número y etiquetas de texto.

## 6. Preparación para publicar y para el escenario
- R1: `node tools/check-branding.js` en verde: no aparecen Konica, Minolta, KMBS, SKNA ni bajaworks.
- R2: una persona sin contexto sigue el README en un tenant distinto en ≤ 30 minutos.
- R3: dos ensayos completos de 60 minutos con el tiempo medido. El plan B (video) se probó en el equipo del evento.
- R4: el checklist T−48 h / T−24 h / T−1 h de `docs/deployment.md` está completo.
