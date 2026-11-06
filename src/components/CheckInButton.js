/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:51:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-004
 */

import { toggleCheckIn, formatLocalIsoDate } from '../services/streakEngine.js';
import { storage } from '../services/storage.js';

export class CheckInButton {
  /**
   * Genera el HTML del botón de check-in interactivo
   * @param {Object} habit 
   * @returns {string}
   */
  static render(habit) {
    const today = formatLocalIsoDate();
    const isCompleted = habit.completedDates && habit.completedDates.includes(today);

    return `
      <button 
        type="button" 
        class="check-in-btn ${isCompleted ? 'is-completed' : ''}" 
        data-habit-id="${habit.id}"
        aria-label="${isCompleted ? 'Marcar como no completado hoy' : 'Marcar como completado hoy'}"
        title="${isCompleted ? 'Completado hoy (clic para desmarcar)' : 'Marcar check-in hoy'}"
      >
        <div class="check-circle">
          <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span class="check-label">${isCompleted ? '¡Completado!' : 'Marcar'}</span>
      </button>
    `;
  }

  /**
   * Manejador de eventos delegado para clics en botones de check-in
   * @param {Event} event 
   */
  static handleClick(event) {
    const button = event.target.closest('.check-in-btn');
    if (!button) return;

    const habitId = button.dataset.habitId;
    if (!habitId) return;

    event.stopPropagation();

    const habits = storage.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    // Alternar check-in y recalcular rachas
    const updated = toggleCheckIn(habit);
    storage.updateHabit(habitId, updated);

    // Animación de pulso visual
    button.classList.add('pulse-anim');
    setTimeout(() => button.classList.remove('pulse-anim'), 400);
  }
}

