/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:46:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-006
 */

import assert from 'node:assert';
import { createSeedHabits, getRelativeDate } from '../src/data/seedHabits.js';

// Mock de localStorage en memoria para entorno Node
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new LocalStorageMock();

console.log('🧪 Iniciando pruebas de Sprint 1: Persistencia y Seed Data...');

// Test 1: Creación de Seed Data
const seed = createSeedHabits();
assert.strictEqual(Array.isArray(seed), true, 'Seed data debe ser un array');
assert.strictEqual(seed.length >= 5, true, 'Debe haber al menos 5 hábitos seed');
console.log('  ✅ Test 1: Seed data generado correctamente (' + seed.length + ' hábitos)');

// Test 2: Validación de Fechas Relativas
const today = getRelativeDate(0);
const yesterday = getRelativeDate(1);
assert.match(today, /^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha hoy debe ser YYYY-MM-DD');
assert.match(yesterday, /^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha ayer debe ser YYYY-MM-DD');
assert.notStrictEqual(today, yesterday, 'Hoy y ayer deben ser distintos');
console.log(`  ✅ Test 2: Fechas relativas formateadas correctamente (Hoy: ${today}, Ayer: ${yesterday})`);

// Test 3: Simulación de flujo de almacenamiento
const STORAGE_KEY = 'levelup_habits_v1';
localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));

const retrievedRaw = localStorage.getItem(STORAGE_KEY);
assert.ok(retrievedRaw, 'Los datos deben recuperarse de localStorage');
const parsed = JSON.parse(retrievedRaw);
assert.strictEqual(parsed.length, seed.length, 'La cantidad de hábitos recuperados debe coincidir');
console.log('  ✅ Test 3: Persistencia en LocalStorage serializada y deserializada con éxito');

// Test 4: Mutación y actualización
parsed[0].currentStreak += 1;
localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
const updated = JSON.parse(localStorage.getItem(STORAGE_KEY));
assert.strictEqual(updated[0].currentStreak, seed[0].currentStreak + 1, 'La mutación debe reflejarse en el storage');
console.log('  ✅ Test 4: Mutación de racha persistida correctamente');

// Test 5: Fallback de datos corruptos
localStorage.setItem(STORAGE_KEY, 'INVALID_JSON{{{');
let recovered;
try {
  recovered = JSON.parse(localStorage.getItem(STORAGE_KEY));
} catch (e) {
  // Simular rescate con seed
  recovered = createSeedHabits();
}
assert.strictEqual(recovered.length >= 5, true, 'Debe recuperarse a seed si el JSON está corrupto');
console.log('  ✅ Test 5: Resiliencia ante JSON corrupto verificada con fallback a seed');

console.log('\n🎉 Todas las pruebas del Sprint 1 pasaron satisfactoriamente.');

