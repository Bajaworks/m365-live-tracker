/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T14:30:00Z
 * @agent_roles IDE Agent + engineering-backend-architect
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-006
 *
 * Generates provisioning/sample-data/surveys.json — fictional, deterministic
 * survey responses for 6 technician profiles (T1…T6) over the last 6 months.
 *
 *   node tools/generate-sample-data.js            (writes the file)
 *   node tools/generate-sample-data.js --check    (fails if the file is out of date)
 *
 * Rules kept consistent with the app:
 *  - A comment is ALWAYS present when Resolved ≠ "Sí" or any dimension ≤ 2.
 *  - Tickets 1000–3999 only (4000+ is reserved for the live demo).
 *  - `daysAgo` is relative to the day the import script runs, so the demo
 *    always has recent data.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SEED = 2026;
const OUTPUT = path.join(__dirname, '..', 'provisioning', 'sample-data', 'surveys.json');
// Same data bundled into the components for the offline demo fallback (sprint 3).
const BUNDLED = path.join(__dirname, '..', 'src', 'shared', 'data', 'sample-surveys.json');
const OUTPUTS = [OUTPUT, BUNDLED];
const DIMS = ['Understanding', 'Speed', 'Skill', 'Communication'];

// Mulberry32: small deterministic PRNG.
function prng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = prng(SEED);
const pick = (list) => list[Math.floor(rand() * list.length)];
// Approximate normal noise (sum of uniforms).
const noise = () => (rand() + rand() + rand() + rand() - 2) * 0.9;
const clampScore = (v) => Math.max(1, Math.min(5, Math.round(v)));

/**
 * Profiles. `means(t)` gets t ∈ [0, 1] where 0 = oldest (180 days ago) and
 * 1 = today, so a profile can improve over time.
 */
const PROFILES = [
  {
    tech: 'T1', // Ana López — protagonist: communicates very well, slow to respond.
    count: 30,
    means: () => ({ Understanding: 4.3, Speed: 2.4, Skill: 4.0, Communication: 4.7 }),
    themes: ['slow', 'friendly']
  },
  {
    tech: 'T2', // Sofía Herrera — excellent at everything.
    count: 25,
    means: () => ({ Understanding: 4.6, Speed: 4.6, Skill: 4.7, Communication: 4.6 }),
    themes: ['excellent']
  },
  {
    tech: 'T3', // Luis Ramírez — improves month after month (2.5 → 4.5).
    count: 25,
    means: (t) => {
      const v = 2.5 + 2 * t;
      return { Understanding: v, Speed: v + 0.1, Skill: v, Communication: v - 0.1 };
    },
    themes: ['improving']
  },
  {
    tech: 'T4', // Diego Torres — high skill, low communication.
    count: 20,
    means: () => ({ Understanding: 3.8, Speed: 3.6, Skill: 4.6, Communication: 2.3 }),
    themes: ['skilledQuiet']
  },
  {
    tech: 'T5', // Carmen Vega — average.
    count: 16,
    means: () => ({ Understanding: 3.2, Speed: 3.3, Skill: 3.1, Communication: 3.2 }),
    themes: ['average']
  },
  {
    tech: 'T6', // Jorge Mendoza — only 3 responses ("datos insuficientes").
    count: 3,
    means: () => ({ Understanding: 3.9, Speed: 3.8, Skill: 4.0, Communication: 3.9 }),
    themes: ['average']
  }
];

const COMMENTS = {
  slow: [
    'Muy amable y me explicó todo, pero tardó dos días en contestar.',
    'La solución fue buena, aunque la primera respuesta llegó muy tarde.',
    'Excelente trato; solo ojalá hubiera respondido más rápido.',
    'Tuve que escribir dos veces para que me hicieran caso.'
  ],
  friendly: [
    'Me explicó con paciencia qué había pasado y cómo evitarlo.',
    'Muy clara la comunicación en todo momento.',
    'Siempre me mantuvo al tanto del avance.'
  ],
  excellent: [
    'Resolvió el problema en minutos. ¡Gracias!',
    'Rápida, clara y muy profesional.',
    'De las mejores atenciones que he recibido.',
    'Entendió el problema a la primera.'
  ],
  improving: [
    'Se nota que conoce mejor el sistema que hace unos meses.',
    'Esta vez fue mucho más ágil.',
    'Le costó entender el problema, pero al final lo resolvió.',
    'Tuvimos que intentar varias cosas antes de dar con la solución.'
  ],
  skilledQuiet: [
    'Lo arregló rápido, pero no me explicó qué hizo.',
    'Muy buena solución técnica; casi no hubo comunicación.',
    'Cerró el ticket sin avisarme.',
    'Sabe mucho, pero me costó entender sus respuestas.'
  ],
  average: [
    'Cumplió, sin más.',
    'Se resolvió, aunque tomó algo de tiempo.',
    'Atención correcta.'
  ],
  notResolved: [
    'El problema volvió a aparecer al día siguiente.',
    'Me dieron una solución temporal; sigue fallando.',
    'No se resolvió y tuve que abrir otro ticket.',
    'Funciona a medias; falta revisar la configuración.'
  ],
  low: [
    '¿Qué pudimos hacer mejor? Responder antes y avisar del avance.',
    'Esperaba más seguimiento.',
    'Faltó explicar los pasos que siguió.'
  ]
};

function resolvedFor(avg) {
  const r = rand();
  if (avg >= 3.8) return r < 0.92 ? 'Sí' : 'Parcialmente';
  if (avg >= 3.0) return r < 0.65 ? 'Sí' : r < 0.92 ? 'Parcialmente' : 'No';
  return r < 0.3 ? 'Sí' : r < 0.7 ? 'Parcialmente' : 'No';
}

function recommendFor(avg) {
  const r = rand();
  if (avg >= 4.0) return r < 0.9 ? 'Sí' : 'No estoy seguro';
  if (avg >= 3.0) return r < 0.5 ? 'Sí' : r < 0.85 ? 'No estoy seguro' : 'No';
  return r < 0.15 ? 'Sí' : r < 0.5 ? 'No estoy seguro' : 'No';
}

function generate() {
  // Unique ticket numbers 1000–3999, shuffled deterministically.
  const tickets = [];
  for (let n = 1000; n <= 3999; n++) tickets.push(n);
  for (let i = tickets.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [tickets[i], tickets[j]] = [tickets[j], tickets[i]];
  }
  let ticketIndex = 0;

  const items = [];
  for (const profile of PROFILES) {
    for (let i = 0; i < profile.count; i++) {
      // T6 stays within the default quarter so the scorecard shows "insufficient".
      const maxDays = profile.tech === 'T6' ? 80 : 180;
      const daysAgo = 1 + Math.floor(rand() * maxDays);
      const t = 1 - daysAgo / 180;
      const means = profile.means(t);
      const scores = {};
      DIMS.forEach((d) => {
        scores[d] = clampScore(means[d] + noise());
      });
      const avg = DIMS.reduce((s, d) => s + scores[d], 0) / DIMS.length;
      const resolved = resolvedFor(avg);
      const recommend = recommendFor(avg);
      const low = DIMS.some((d) => scores[d] <= 2);

      let comments = '';
      if (resolved !== 'Sí') {
        comments = pick(COMMENTS.notResolved);
      } else if (low) {
        comments = pick(COMMENTS[profile.themes[0]].concat(COMMENTS.low));
      } else if (rand() < 0.4) {
        comments = pick(COMMENTS[pick(profile.themes)]);
      }

      items.push({
        ticket: String(tickets[ticketIndex++]),
        tech: profile.tech,
        daysAgo,
        hour: 8 + Math.floor(rand() * 10),
        minute: Math.floor(rand() * 60),
        resolved,
        scores,
        recommend,
        comments
      });
    }
  }
  items.sort((a, b) => b.daysAgo - a.daysAgo || a.ticket.localeCompare(b.ticket));

  return {
    _meta: {
      description:
        'Respuestas ficticias de ejemplo (Contoso). Generadas por tools/generate-sample-data.js; no editar a mano.',
      generated_by_model: 'claude-opus-5-5',
      vision_command: 'start_sprint --sprint 1',
      task_id: 'T-006',
      seed: SEED,
      profiles: {
        T1: 'Comunicación alta, Rapidez baja (protagonista)',
        T2: 'Excelente en todo',
        T3: 'Mejora mes a mes',
        T4: 'Habilidad alta, Comunicación baja',
        T5: 'Regular',
        T6: 'Solo 3 respuestas'
      }
    },
    version: 1,
    items
  };
}

const json = JSON.stringify(generate(), null, 2) + '\n';
if (process.argv.includes('--check')) {
  const stale = OUTPUTS.filter((file) => !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== json);
  if (stale.length > 0) {
    console.error('Out of date: ' + stale.join(', ') + '. Run: node tools/generate-sample-data.js');
    process.exit(1);
  }
  console.log('sample data is up to date.');
} else {
  OUTPUTS.forEach((file) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, json, 'utf8');
    console.log(`Wrote ${file}`);
  });
}
