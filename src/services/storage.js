/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:46:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-003
 */

import { createSeedHabits } from '../data/seedHabits.js';

const STORAGE_KEY = 'levelup_habits_v1';
const STORAGE_BACKUP_KEY = 'levelup_habits_backup_error';

class StorageService {
  constructor() {
    this.subscribers = new Set();
  }

  /**
   * Suscribe un callback a cualquier mutación de hábitos
   * @param {Function} callback 
   * @returns {Function} función para desuscribirse
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notifica a todos los suscriptores con los hábitos actualizados
   */
  notify(habits) {
    this.subscribers.forEach((cb) => {
      try {
        cb(habits);
      } catch (err) {
        console.error('Error in storage subscriber:', err);
      }
    });
  }

  /**
   * Recupera todos los hábitos de localStorage. Si no existen o hay error, carga seed data.
   * @returns {Array}
   */
  getHabits() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seed = createSeedHabits();
        this.saveHabits(seed);
        return seed;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const seed = createSeedHabits();
        this.saveHabits(seed);
        return seed;
      }
      return parsed;
    } catch (error) {
      console.warn('LocalStorage error reading habits, falling back to seed:', error);
      try {
        const corrupt = localStorage.getItem(STORAGE_KEY);
        if (corrupt) localStorage.setItem(STORAGE_BACKUP_KEY, corrupt);
      } catch (_) {}
      const seed = createSeedHabits();
      this.saveHabits(seed);
      return seed;
    }
  }

  /**
   * Guarda la colección completa de hábitos en localStorage
   * @param {Array} habits 
   */
  saveHabits(habits) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      this.notify(habits);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Agrega un nuevo hábito
   * @param {Object} habit 
   */
  addHabit(habit) {
    const habits = this.getHabits();
    const newHabit = {
      ...habit,
      id: habit.id || 'habit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      createdAt: habit.createdAt || new Date().toISOString(),
      completedDates: habit.completedDates || [],
      currentStreak: habit.currentStreak || 0,
      longestStreak: habit.longestStreak || 0,
    };
    habits.unshift(newHabit);
    this.saveHabits(habits);
    return newHabit;
  }

  /**
   * Actualiza un hábito existente
   * @param {string} id 
   * @param {Object} updates 
   */
  updateHabit(id, updates) {
    const habits = this.getHabits();
    const idx = habits.findIndex((h) => h.id === id);
    if (idx === -1) return null;

    habits[idx] = {
      ...habits[idx],
      ...updates,
      id: habits[idx].id, // inmutable
      createdAt: habits[idx].createdAt, // inmutable
    };
    this.saveHabits(habits);
    return habits[idx];
  }

  /**
   * Elimina un hábito por su ID
   * @param {string} id 
   */
  deleteHabit(id) {
    const habits = this.getHabits();
    const filtered = habits.filter((h) => h.id !== id);
    this.saveHabits(filtered);
    return filtered.length !== habits.length;
  }

  /**
   * Restablece la persistencia a los datos semilla de fábrica
   */
  resetToSeed() {
    const seed = createSeedHabits();
    this.saveHabits(seed);
    return seed;
  }
}

export const storage = new StorageService();

