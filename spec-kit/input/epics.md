---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:10:00Z'
agent_roles: 'IDE Agent + product-manager + product-sprint-prioritizer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Épicas

| ID | Épica | RF | Valor para la demo | Prioridad |
|---|---|---|---|---|
| EP-01 | **Datos y aprovisionamiento**: sitio de comunicación, lista `Encuestas`, permisos, datos de ejemplo y reinicio | RF-15, RF-16, RF-17, RF-18 | Sin datos no hay demo. También es lo primero que hará quien clone el repo | Must |
| EP-02 | **Fundaciones compartidas**: modelo, configuración, resolución del sitio, repositorio de datos, lógica pura y controles de UI reutilizables | RF-07, RF-19 | Base para los dos componentes. La lógica tiene pruebas | Must |
| EP-03 | **Encuesta en Copilot** (`SatisfactionSurveyForm`) | RF-05 a RF-09 | El momento de "wow" principal: una frase abre un formulario útil | Must |
| EP-04 | **Tablero del técnico** (`TechnicianScorecard`) | RF-10 a RF-14 | El cierre visual: los círculos por dimensión | Must |
| EP-05 | **Agente declarativo e intención** | RF-01 a RF-04 | Lo que hace que Copilot elija el componente correcto | Must |
| EP-06 | **Demo y repositorio público**: guion, plan B, README, verificación de marcas, despliegue en bajaworks | RF-20, RF-21 | Que la sesión salga bien y la comunidad lo pueda reproducir | Must |

## Dependencias

```
EP-01 ──► EP-02 ──► EP-03 ──┐
             │              ├──► EP-05 (ajuste fino de intención) ──► EP-06
             └────► EP-04 ──┘
```

- Una versión mínima de EP-05 (instrucciones y descripciones de las tools) se hace junto con EP-03, porque sin ella no se puede probar en Copilot.
- EP-04 necesita que el autor agregue el segundo componente con el generador. Ver ST-14.
