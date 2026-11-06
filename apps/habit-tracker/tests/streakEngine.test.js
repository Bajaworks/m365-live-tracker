/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:51:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-006
 */

import assert from 'node:assert';
import { 
  calculateStreakStats, 
  toggleCheckIn, 
  formatLocalIsoDate, 
  evaluateMilestones 
} from '../src/services/streakEngine.js';

console.log('🧪 Iniciando pruebas de Sprint 2: StreakEngine & Check-ins...');

const today = formatLocalIsoDate(new Date('2026-11-05T12:00:00'));
const d1 = '2026-11-04';
const d2 = '2026-11-03';
const d3 = '2026-11-02';

// Test 1: Racha consecutiva con hoy completado (d3, d2, d1, today) -> 4 días
const stats1 = calculateStreakStats([d3, d2, d1, today], today);
assert.strictEqual(stats1.currentStreak, 4, 'La racha actual debe ser 4');
assert.strictEqual(stats1.longestStreak, 4, 'La racha máxima debe ser 4');
assert.strictEqual(stats1.isCompletedToday, true, 'isCompletedToday debe ser true');
console.log('  ✅ Test 1: Racha consecutiva con hoy marcado calculada correctamente (4 días)');

// Test 2: Racha viva cuando hoy aún no está marcado pero ayer sí (d2, d1) -> 2 días
const stats2 = calculateStreakStats([d2, d1], today);
assert.strictEqual(stats2.currentStreak, 2, 'La racha debe preservarse en 2 aunque hoy no esté marcado aún');
assert.strictEqual(stats2.isCompletedToday, false, 'isCompletedToday debe ser false');
console.log('  ✅ Test 2: Preservación de racha de ayer cuando hoy está pendiente');

// Test 3: Racha rota cuando el último check-in fue hace 2 días (d2, d3) y hoy no está marcado -> 0 días
const stats3 = calculateStreakStats([d3, d2], today);
assert.strictEqual(stats3.currentStreak, 0, 'La racha debe reiniciarse a 0 si ayer no se marcó y hoy tampoco');
assert.strictEqual(stats3.longestStreak, 2, 'La racha histórica debe conservar 2');
console.log('  ✅ Test 3: Racha rota detectada correctamente cuando hay un hueco mayor a 1 día');

// Test 4: Toggle check-in (marcar hoy en un hábito vacío)
const habitMock = {
  id: 'test-1',
  name: 'Test Habit',
  completedDates: [],
  currentStreak: 0,
  longestStreak: 0,
};

const markedHabit = toggleCheckIn(habitMock, today);
assert.strictEqual(markedHabit.completedDates.includes(today), true, 'Debe incluir hoy en completedDates');
assert.strictEqual(markedHabit.currentStreak, 1, 'Racha debe subir a 1');
assert.strictEqual(markedHabit.longestStreak, 1, 'Longest streak debe ser 1');
console.log('  ✅ Test 4: Toggle check-in (marcar) agrega la fecha y actualiza racha a 1');

// Test 5: Toggle check-in (desmarcar hoy para corrección de error)
const unmarkedHabit = toggleCheckIn(markedHabit, today);
assert.strictEqual(unmarkedHabit.completedDates.includes(today), false, 'Hoy no debe estar en completedDates');
assert.strictEqual(unmarkedHabit.currentStreak, 0, 'Racha debe volver a 0');
console.log('  ✅ Test 5: Toggle check-in (desmarcar) remueve la fecha y recalcula racha');

// Test 6: Evaluación de Insignias de Hitos
const milestones1 = evaluateMilestones(1);
assert.strictEqual(milestones1.find((m) => m.days === 1).unlocked, true);
assert.strictEqual(milestones1.find((m) => m.days === 3).unlocked, false);

const milestones7 = evaluateMilestones(7);
assert.strictEqual(milestones7.find((m) => m.days === 7).unlocked, true);
assert.strictEqual(milestones7.find((m) => m.days === 21).unlocked, false);
console.log('  ✅ Test 6: Evaluación de insignias por hitos de racha (1d, 3d, 7d, 21d, 30d) validada');

console.log('\n🎉 Todas las pruebas del Sprint 2 pasaron satisfactoriamente.');

