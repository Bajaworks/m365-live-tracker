/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:58:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-006
 */

import assert from 'node:assert';
import { Dashboard } from '../src/components/Dashboard.js';
import { SearchFilterBar } from '../src/components/SearchFilterBar.js';
import { createSeedHabits } from '../src/data/seedHabits.js';
import { evaluateMilestones, formatLocalIsoDate } from '../src/services/streakEngine.js';

console.log('🧪 Iniciando pruebas de Sprint 3: Dashboard, Filtros y Badges...');

// Test 1: Microtextos del Dashboard
assert.match(Dashboard.getMotivationalMessage(0), /primer paso/i);
assert.match(Dashboard.getMotivationalMessage(35), /ganando impulso/i);
assert.match(Dashboard.getMotivationalMessage(75), /mitad del camino/i);
assert.match(Dashboard.getMotivationalMessage(100), /día perfecto/i);
console.log('  ✅ Test 1: Microcopia motivacional según porcentaje evaluada con éxito');

// Test 2: Historial semanal de 7 días
const seedHabits = createSeedHabits();
const weekly = Dashboard.computeWeeklyHistory(seedHabits);
assert.strictEqual(weekly.length, 7, 'Deben generarse exactamente 7 días');
assert.strictEqual(weekly[6].isToday, true, 'El último elemento debe ser hoy');
console.log('  ✅ Test 2: Historial de 7 días calculado correctamente');

// Test 3: Filtrado por búsqueda de texto
const searchBar = new SearchFilterBar('mock-root');
searchBar.filters.search = 'código';
const todayIso = formatLocalIsoDate();
const filteredSearch = searchBar.filterHabits(seedHabits, todayIso);
assert.strictEqual(filteredSearch.length >= 1, true, 'Debe encontrar al menos el hábito de código');
assert.strictEqual(filteredSearch[0].category, 'study');
console.log('  ✅ Test 3: Filtro de búsqueda textual en tiempo real validado');

// Test 4: Filtrado por categoría
searchBar.filters.search = '';
searchBar.filters.category = 'fitness';
const filteredCat = searchBar.filterHabits(seedHabits, todayIso);
assert.strictEqual(filteredCat.length >= 1, true);
assert.strictEqual(filteredCat.every((h) => h.category === 'fitness'), true);
console.log('  ✅ Test 4: Filtro por categoría temática verificado');

// Test 5: Filtrado por estado de racha
searchBar.filters.category = 'all';
searchBar.filters.status = 'streaking';
const streakingHabits = searchBar.filterHabits(seedHabits, todayIso);
assert.strictEqual(streakingHabits.every((h) => h.currentStreak > 0), true);
console.log('  ✅ Test 5: Filtro por estado "En Racha" verificado');

// Test 6: Desbloqueo de insignias de hitos
const maxStreak = seedHabits.reduce((m, h) => Math.max(m, h.longestStreak || 0), 0);
const milestones = evaluateMilestones(maxStreak);
const unlocked = milestones.filter((m) => m.unlocked);
assert.strictEqual(unlocked.length >= 2, true, 'Con seed habits deben desbloquearse al menos 2 insignias');
console.log(`  ✅ Test 6: Insignias evaluadas con éxito (${unlocked.length} desbloqueadas para récord de ${maxStreak} días)`);

console.log('\n🎉 Todas las pruebas del Sprint 3 pasaron satisfactoriamente.');

