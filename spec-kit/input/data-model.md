---
generated_by_model: 'claude-opus-5-5'
generated_at: '2026-10-24T13:10:00Z'
agent_roles: 'IDE Agent + engineering-software-architect + engineering-database-optimizer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Modelo de datos

## Sitio
- Colección de sitios de **comunicación**: `https://<tenant>.sharepoint.com/sites/encuestas`. El alias se puede cambiar.
- Título: "Encuestas de Satisfacción". LCID 3082 (español).

## Lista `Encuestas` (lista genérica, plantilla 100)

Los nombres internos están en inglés y sin acentos (para el código) y los nombres visibles en español. **Todas las columnas propias llevan el prefijo `m365live_` (con guion bajo, p. ej. `m365live_Communication`)**, que es decisión del autor. Así se distinguen de las columnas de sistema (`Title`, `Created`, `Author`) y no chocan con otros campos del sitio. El campo Persona se escribe por REST como `m365live_TechnicianId` y se lee con `$expand=m365live_Technician`.

| Nombre interno | Nombre visible | Tipo | Obligatorio | Índice | Valores / reglas |
|---|---|---|---|---|---|
| `Title` | **Ticket #** | Texto (50) | Sí | Sí | El que escriba el usuario, sin espacios al inicio ni al final |
| `m365live_Technician` | Técnico | Persona (solo personas, una sola) | Sí | Sí | — |
| `m365live_Resolved` | Resuelto | Opción | Sí | — | `Sí` · `Parcialmente` · `No` |
| `m365live_Understanding` | Comprensión | Número | Sí | — | Entero de 1 a 5 |
| `m365live_Speed` | Rapidez | Número | Sí | — | Entero de 1 a 5 |
| `m365live_Skill` | Habilidad | Número | Sí | — | Entero de 1 a 5 |
| `m365live_Communication` | Comunicación | Número | Sí | — | Entero de 1 a 5 |
| `m365live_WouldRecommend` | Recomendaría | Opción | Sí | — | `Sí` · `No` · `No estoy seguro` |
| `m365live_Comments` | Comentarios | Texto multilínea (texto sin formato) | Condicional (lo valida el cliente) | — | Máximo 2000 caracteres |
| `m365live_IsSample` | Dato de ejemplo | Sí/No | — | — | Predeterminado `No`. Lo pone el script de datos de ejemplo |
| `Created` | Creado | Sistema | — | (índice de sistema) | **Define el periodo del tablero** |
| `Author` | Creado por | Sistema | — | — | Es el solicitante. **Nunca se muestra en el tablero** |

**Reglas que se aplican en el cliente** (la lista no las impone):
- El comentario es obligatorio si `m365live_Resolved ≠ 'Sí'` o si `min(m365live_Understanding, m365live_Speed, m365live_Skill, m365live_Communication) ≤ 2`.
- Solo puede haber una respuesta por `(Title, Author)`. Antes de crear, se busca con el filtro `Title eq X and AuthorId eq me`.

**Permisos de la lista:**
- La lista no hereda permisos del sitio.
- *Everyone except external users* tiene **Contribute**.
- Configuración de elementos: `ReadSecurity = 1` (todos leen todo) y `WriteSecurity = 2` (cada quien crea y edita solo sus elementos).
- Los dueños del sitio conservan el control total. **`WriteSecurity` no aplica a quien tiene el permiso "Override List Behaviors"** (en la interfaz: "Cancelar desprotección"), incluido en los niveles Control total y Diseño. Por eso los dueños del sitio sí pueden leer, editar y borrar cualquier encuesta, aunque no la hayan creado. Los miembros (nivel Editar) y los visitantes no tienen ese permiso, así que solo editan lo suyo.

**Vistas:**
- "Todas las encuestas" (predeterminada): Ticket #, Técnico, Resuelto, las 4 dimensiones, Recomendaría, Creado.
- "Por técnico": agrupada por Técnico.

**Volumen esperado:** unos 120 elementos de ejemplo más los de la demo, muy por debajo del umbral de 5,000. Igual se indexan `m365live_Technician` y `Title` como buena práctica.

## Tipos en TypeScript (`src/shared/model/survey.ts`)

El código usa **claves lógicas sin prefijo** (`Understanding`, `Speed`…) y traduce a nombres internos en un único lugar, `src/shared/config/fields.ts`. Si alguien quiere otro prefijo, solo cambia ese archivo y el script de aprovisionamiento.

```ts
export const FIELD_PREFIX = 'm365live_';
export const FIELDS = {
  ticket: 'Title',
  technician: `${FIELD_PREFIX}Technician`,          // escritura: `${FIELD_PREFIX}TechnicianId`
  resolved: `${FIELD_PREFIX}Resolved`,
  Understanding: `${FIELD_PREFIX}Understanding`,
  Speed: `${FIELD_PREFIX}Speed`,
  Skill: `${FIELD_PREFIX}Skill`,
  Communication: `${FIELD_PREFIX}Communication`,
  wouldRecommend: `${FIELD_PREFIX}WouldRecommend`,
  comments: `${FIELD_PREFIX}Comments`,
  isSample: `${FIELD_PREFIX}IsSample`
} as const;
```

En PowerShell, el prefijo es el parámetro `FieldPrefix = 'm365live_'` de la configuración.

```ts
export type ResolvedValue = 'Sí' | 'Parcialmente' | 'No';
export type RecommendValue = 'Sí' | 'No' | 'No estoy seguro';
export type DimensionKey = 'Understanding' | 'Speed' | 'Skill' | 'Communication';
export type Score = 1 | 2 | 3 | 4 | 5;
export type Period = 'month' | 'quarter' | 'semester' | 'all';

export const DIMENSIONS: ReadonlyArray<{ key: DimensionKey; labelKey: string; questionKey: string }> = [
  { key: 'Understanding', labelKey: 'DimUnderstanding', questionKey: 'QUnderstanding' }, // Comprensión
  { key: 'Speed',         labelKey: 'DimSpeed',         questionKey: 'QSpeed' },         // Rapidez
  { key: 'Skill',         labelKey: 'DimSkill',         questionKey: 'QSkill' },         // Habilidad
  { key: 'Communication', labelKey: 'DimCommunication', questionKey: 'QCommunication' }  // Comunicación
];

export interface IPerson { email: string; displayName: string; }

export interface ISurveyDraft {
  ticketNumber: string;
  technician?: IPerson;
  resolved?: ResolvedValue;
  scores: Partial<Record<DimensionKey, Score>>;
  wouldRecommend?: RecommendValue;
  comments: string;
}

export interface ISurveyRecord {
  id: number;
  ticketNumber: string;
  technician: IPerson;
  resolved: ResolvedValue;
  scores: Record<DimensionKey, Score>;
  wouldRecommend: RecommendValue;
  comments?: string;
  created: Date;          // de `Created`
}

export interface IDimensionSummary { avg: number; distribution: [number, number, number, number, number]; }

export interface IScorecardSummary {
  n: number;
  insufficient: boolean;  // n < 5
  overall: number;        // promedio de los 4 promedios
  byDimension: Record<DimensionKey, IDimensionSummary>;
  resolved: Record<ResolvedValue, number>;   // porcentajes 0–100
  recommendPct: number;                      // % de 'Sí'
  strongest: DimensionKey;
  weakest: DimensionKey;
  monthly: Array<{ month: string /* AAAA-MM */; n: number; byDimension: Record<DimensionKey, number> }>;
  recentComments: Array<{ text: string; created: Date; low: boolean }>; // low = alguna dimensión <= 2
}
```

## Datos de ejemplo (`provisioning/sample-data/surveys.json`)

```json
{
  "version": 1,
  "generatedWithSeed": 2026,
  "items": [
    { "ticket": "4012", "tech": "T2", "daysAgo": 163, "resolved": "Sí",
      "scores": { "Understanding": 4, "Speed": 2, "Skill": 4, "Communication": 5 },
      "recommend": "Sí", "comments": "Muy amable, pero tardó dos días en contestar." }
  ]
}
```

`tech` (T1–T6) se relaciona en tiempo de ejecución con los correos de `demo.config.local.psd1`. `daysAgo` se convierte en `Created = hoy − daysAgo`, con una hora laboral aleatoria pero determinista.

## Configuración

| Clave | Dónde | Valor |
|---|---|---|
| `SatisfactionSurveySite` | Storage entity del tenant (opcional) | Ruta (`/sites/encuestas`) o URL completa del sitio de datos |
| `DEFAULT_SITE_PATH` | `src/shared/config/settings.ts` | `/sites/encuestas` |
| `SURVEY_LIST_TITLE` | `settings.ts` | `Encuestas` |
| `MIN_RESPONSES` | `settings.ts` | `5` |
