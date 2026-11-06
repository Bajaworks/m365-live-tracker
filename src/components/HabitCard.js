/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:51:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-001
 */

import { CheckInButton } from './CheckInButton.js';
import { CATEGORIES } from '../data/seedHabits.js';
import { storage } from '../services/storage.js';

export class HabitCard {
  /**
   * Renderiza el markup HTML de una tarjeta de hábito individual
   * @param {Object} habit 
   * @returns {string}
   */
  static render(habit) {
    const categoryMeta = CATEGORIES.find((c) => c.id === habit.category) || {
      label: habit.category,
      color: habit.color || '#4facfe',
    };

    const hasStreak = (habit.currentStreak || 0) > 0;
    const streakFlameClass = habit.currentStreak >= 7 ? 'streak-super' : (hasStreak ? 'streak-active' : 'streak-none');

    return `
      <article class="glass-card habit-card" data-id="${habit.id}" style="--habit-color: ${habit.color || categoryMeta.color};">
        <div class="habit-card-header">
          <div class="category-pill" style="border-color: ${habit.color || categoryMeta.color}; color: ${habit.color || categoryMeta.color};">
            <span class="category-dot" style="background: ${habit.color || categoryMeta.color};"></span>
            <span>${categoryMeta.label}</span>
          </div>

          <div class="habit-card-actions">
            <button type="button" class="action-btn btn-edit-habit" data-habit-id="${habit.id}" title="Editar hábito">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button type="button" class="action-btn btn-delete-habit" data-habit-id="${habit.id}" title="Eliminar hábito">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="habit-body">
          <h3 class="habit-title">${habit.name}</h3>
          ${habit.description ? `<p class="habit-description">${habit.description}</p>` : ''}
        </div>

        <div class="habit-stats-row">
          <div class="streak-badge ${streakFlameClass}">
            <span class="flame-icon">🔥</span>
            <span class="streak-count">${habit.currentStreak || 0}</span>
            <span class="streak-text">${habit.currentStreak === 1 ? 'día racha' : 'días racha'}</span>
          </div>

          <div class="longest-streak-hint" title="Mejor racha histórica">
            <span>🏆 Récord: <strong>${habit.longestStreak || 0}d</strong></span>
          </div>
        </div>

        <div class="habit-card-footer">
          <span class="frequency-indicator">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${habit.frequency === 'daily' ? 'Diario' : (habit.frequency === 'weekdays' ? 'Entre semana' : 'Fin de semana')}
          </span>

          <div class="check-in-container">
            ${CheckInButton.render(habit)}
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Manejador delegado para acciones de edición y eliminación
   * @param {Event} event 
   */
  static handleActions(event) {
    // 1. Eliminar
    const deleteBtn = event.target.closest('.btn-delete-habit');
    if (deleteBtn) {
      event.stopPropagation();
      const habitId = deleteBtn.dataset.habitId;
      const habits = storage.getHabits();
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      if (confirm(`¿Estás seguro de que deseas eliminar el hábito "${habit.name}"? Esta acción no se puede deshacer.`)) {
        storage.deleteHabit(habitId);
      }
      return;
    }

    // 2. Editar
    const editBtn = event.target.closest('.btn-edit-habit');
    if (editBtn) {
      event.stopPropagation();
      const habitId = editBtn.dataset.habitId;
      const habits = storage.getHabits();
      const habit = habits.find((h) => h.id === habitId);
      if (habit) {
        window.dispatchEvent(new CustomEvent('open-habit-modal', { detail: { mode: 'edit', habit } }));
      }
    }
  }
}

