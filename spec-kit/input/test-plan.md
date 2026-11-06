---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-06T05:37:00Z'
agent_roles: 'engineering-software-architect + engineering-frontend-developer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
---

# Test Plan — Level Up Habit Tracker

## 1. Estrategia y Enfoque de Pruebas

El plan de calidad para **Level Up Habit Tracker** combina pruebas unitarias sobre los algoritmos centrales (especialmente el cálculo de rachas y persistencia), pruebas de integración de la interfaz (interacción modal, check-ins y reactividad del dashboard) y verificación visual de diseño (glassmorphism en diferentes resoluciones y navegadores).

```
┌────────────────────────────────────────────────────────┐
│            Pruebas Visuales y de Usabilidad            │
│  Glassmorphism · Responsive (Mobile/Desktop) · Contraste│
├────────────────────────────────────────────────────────┤
│          Pruebas de Integración y Componentes          │
│  Check-ins reactivos · Modales CRUD · Filtros cruzados │
├────────────────────────────────────────────────────────┤
│             Pruebas Unitarias Algorítmicas             │
│  StreakEngine · Storage Serialization · Date Utilities  │
└────────────────────────────────────────────────────────┘
```

## 2. Matriz de Casos de Prueba Críticos

| ID | Área | Escenario | Resultado Esperado | Prioridad |
|---|---|---|---|---|
| **TC-01** | Persistencia | Primera carga con `localStorage` vacío. | Se cargan automáticamente los 5 hábitos de prueba con historial. | Alta |
| **TC-02** | Persistencia | Recarga de página tras marcar un hábito. | El hábito permanece marcado y la racha mantiene su valor incrementado. | Crítica |
| **TC-03** | Rachas | Check-in consecutivo: completado ayer y marcado hoy. | La racha actual se incrementa exactamente en +1 día. | Crítica |
| **TC-04** | Rachas | Racha rota: último check-in hace 2 días, marcado hoy. | La racha actual se reinicia a 1 día; `longestStreak` conserva el récord previo. | Crítica |
| **TC-05** | Rachas | Desmarcado (uncheck) accidental el mismo día. | La racha actual vuelve al valor previo y la fecha actual se elimina del historial. | Alta |
| **TC-06** | Dashboard | Marcado de hábito con medidor al 0%. | El círculo SVG de progreso avanza suavemente y el texto motivacional se actualiza. | Media |
| **TC-07** | CRUD | Creación de nuevo hábito con nombre válido. | Aparece de inmediato en la lista, guardado con fecha y categoría correspondiente. | Alta |
| **TC-08** | CRUD | Edición de hábito existente. | El nombre y categoría cambian sin alterar las fechas completadas en el historial. | Alta |
| **TC-09** | CRUD | Eliminación de hábito. | Desaparece de la lista y el contador total del dashboard se actualiza. | Alta |
| **TC-10** | Filtros | Búsqueda por palabra clave combinada con categoría. | Solo se muestran los hábitos que cumplen simultáneamente ambos criterios. | Media |
| **TC-11** | Insignias | Hábito que alcanza 3 días de racha. | La insignia "En Llamas" pasa de bloqueada a desbloqueada con resplandor. | Media |
| **TC-12** | Responsive | Visualización en pantalla móvil de 375px (iPhone). | Sin desbordamiento horizontal, fuentes legibles y botones táctiles cómodos. | Alta |

## 3. Casos Borde y Pruebas de Esquinas (Edge Cases)

### 3.1 Cambio de Día a Medianoche
- **Comportamiento:** Si el usuario tiene la app abierta al cruzar la medianoche, los hábitos completados el día anterior pasan al estado "ayer", el día de hoy aparece como no completado y la racha se preserva a la espera del check-in de hoy.

### 3.2 Formato de Fechas y Zonas Horarias
- **Regla:** Se utiliza la fecha local del dispositivo en formato estandarizado `YYYY-MM-DD` (`Date.getFullYear()`, `Date.getMonth() + 1`, `Date.getDate()`) para evitar desfases causados por el UTC offset en `toISOString()`.

### 3.3 Cuota de LocalStorage Excedida
- **Manejo:** El serializador envuelve las escrituras en un bloque `try/catch`. En caso de error de cuota, se notifica de forma no intrusiva al usuario y se conserva el estado en memoria para la sesión activa.

## 4. Criterios de Aceptación para Salida a Producción (DoD)

1. 100% de los casos de prueba de la matriz (TC-01 a TC-12) verificados y aprobados.
2. Interfaz 100% libre de saltos de layout visibles (CLS = 0).
3. Efecto glassmorphism renderizado correctamente con aceleración por hardware en Chrome, Firefox y Safari.
4. Carga inicial completa y funcional en < 1 segundo en entorno local.
