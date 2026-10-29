---
generated_by_model: 'gpt-6'
generated_at: '2026-10-24T16:46:30Z'
agent_roles: 'testing-reality-checker + engineering-technical-writer'
vision_command: 'continue_sprint --sprint 4'
sprint_number: 4
task_id: 'T-006'
---

# Sprint 4 — Registro de evidencia pendiente

## Verificación local de esta continuación

El 2026-10-24 se ejecutaron desde `apps/satisfaction-survey/`:

| Comprobación | Resultado |
|---|---|
| `npm run sample-data:check` | PASA: datos de ejemplo al día |
| `npm run check-branding` | FALLA: coincidencia en `provisioning/demo.config.sample.psd1:11`; se conserva la decisión del autor de no restaurarlo todavía |
| Build y pruebas unitarias | No ejecutados en esta continuación; el handoff reporta 73 pruebas previas en verde |

## Workbench: pantalla completa y tema oscuro

Ejecuta con el técnico de prueba y datos suficientes. Registra fecha, navegador, versión del código probado y referencia a cada captura. Usa `PASA`, `FALLA` o `BLOQUEADO`; las filas pendientes no acreditan una validación visual.

| Caso | Pasos y resultado esperado | Resultado y evidencia |
|---|---|---|
| W9 claro | Abrir tablero inline, pasar a pantalla completa y volver. Se conservan técnico, periodo y cifras; distribución y tendencia visibles en pantalla completa, sin recortes | Pendiente |
| W10 oscuro inline | Cambiar a tema oscuro. Textos, etiquetas, números, círculos y foco de teclado visibles | Pendiente |
| W9/W10 oscuro completo | Pasar a pantalla completa y volver en tema oscuro. Comprobar leyendas, ejes, distribución, tendencia y desplazamiento | Pendiente |
| Teclado | Recorrer controles con Tab y activar el cambio de vista con teclado; foco visible y navegación utilizable al volver | Pendiente |

Guarda las capturas publicables según [la guía del plan B](../../../apps/satisfaction-survey/docs/screenshots/README.md), ocultando tenant y personas reales. Una captura por sí sola no prueba el recorrido ni el contraste medido; anota también los resultados observados.

## R2 del plan de pruebas §6: README en otro tenant

Esta prueba es distinta de la prueba de permisos con una cuenta no administradora (P5 del plan de pruebas).

| Dato | Registro |
|---|---|
| Persona sin contexto previo y tenant distinto (usar alias) | Pendiente |
| Fecha, versión del repositorio y requisitos disponibles | Pendiente |
| Inicio, fin y duración (objetivo ≤ 30 minutos) | Pendiente |
| Instalación siguiendo el README | Pendiente |
| Aprovisionamiento con configuración local propia | Pendiente |
| Encuesta guardada y tablero abierto en Workbench | Pendiente |
| Despliegue y diagnóstico siguiendo el README | Pendiente |
| Pasos confusos, errores y correcciones necesarias | Pendiente |
| Resultado final y referencia a evidencia | Pendiente |

La persona que prueba ejecuta los comandos en su tenant. No guardar credenciales, correos reales ni identificadores de tenant en este registro.

## Condiciones que siguen abiertas

- T-001: completar [las tres corridas de intención](../../../apps/satisfaction-survey/docs/intent-matrix.md).
- T-002: fijar horario y ejecutar los hitos de despliegue y ensayo.
- T-004: producir las diez capturas y el video, y reproducir el plan B en el equipo de la sesión.
- T-006: resolver branding antes de publicar, build final del autor y prueba R2 en otro tenant.
- T-007: [versión de trabajo del deck](../../../apps/satisfaction-survey/docs/slides/README.md) generada. Validador del paquete y geometría sin hallazgos; 18 notas pobladas y 18 páginas PDF verificadas, metadata incorporada en ambos formatos. Se revisaron individualmente las 18 vistas previas a 1280×720. Pendientes: capturas reales, URL pública final, revisión de contenido por el autor, comprobación en PowerPoint/Teams y ensayo de 60 minutos. No se ha probado en PowerPoint. El PDF rasteriza las diapositivas por un fallo de fuentes del exportador directo.

No se marca ninguna tarea como terminada con este registro.
