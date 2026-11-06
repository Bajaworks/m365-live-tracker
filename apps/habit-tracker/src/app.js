/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:56:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-001
 */

import { AppHeader } from './components/Header.js';
import { Dashboard } from './components/Dashboard.js';
import { SearchFilterBar } from './components/SearchFilterBar.js';
import { HabitCard } from './components/HabitCard.js';
import { CheckInButton } from './components/CheckInButton.js';
import { BadgeGallery } from './components/BadgeGallery.js';
import { HabitModal } from './components/HabitModal.js';
import { storage } from './services/storage.js';
import { formatLocalIsoDate } from './services/streakEngine.js';

class HabitTrackerApp {
  constructor() {
    this.header = new AppHeader('header-root');
    this.dashboard = new Dashboard('dashboard-root');
    this.badgeGallery = new BadgeGallery('badges-root');
    this.modal = new HabitModal('modal-root');
    this.habitsRoot = document.getElementById('habits-root');

    this.searchFilterBar = new SearchFilterBar('filters-root', () => {
      this.renderFilteredHabits();
    });
  }

  init() {
    console.log('🚀 Inicializando Level Up Habit Tracker (Sprint 3 Completo)...');
    
    // 1. Renderizar Header
    this.header.render();

    // 2. Adjuntar eventos para check-in y acciones de tarjetas
    this.attachEventListeners();

    // 3. Render inicial con hábitos actuales
    this.refreshAll();

    // 4. Suscripción a cambios del almacenamiento (reactividad total)
    storage.subscribe(() => {
      this.refreshAll();
    });
  }

  refreshAll() {
    const habits = storage.getHabits();
    
    // Renderizar Dashboard y métricas
    this.dashboard.render(habits);

    // Renderizar barra de filtros
    this.searchFilterBar.render(habits);

    // Renderizar lista filtrada de hábitos
    this.renderFilteredHabits();

    // Renderizar galería de logros e insignias
    this.badgeGallery.render(habits);
  }

  attachEventListeners() {
    if (!this.habitsRoot) return;

    this.habitsRoot.addEventListener('click', (e) => {
      CheckInButton.handleClick(e);
      HabitCard.handleActions(e);
    });
  }

  renderFilteredHabits() {
    if (!this.habitsRoot) return;

    const allHabits = storage.getHabits();
    const todayIso = formatLocalIsoDate();
    const filteredHabits = this.searchFilterBar.filterHabits(allHabits, todayIso);

    if (allHabits.length === 0) {
      this.habitsRoot.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 3.5rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
          <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.5rem;" class="text-gradient-cyan">
            No tienes hábitos registrados aún
          </h3>
          <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 1.5rem; font-size: 0.9rem;">
            Comienza creando tu primer hábito o restablece la colección de demostración para explorar la aplicación.
          </p>
          <button type="button" class="btn btn-primary" onclick="window.dispatchEvent(new CustomEvent('open-habit-modal', { detail: { mode: 'create' } }))">
            + Crear Mi Primer Hábito
          </button>
        </div>
      `;
      return;
    }

    if (filteredHabits.length === 0) {
      this.habitsRoot.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.35rem;">
            No se encontraron hábitos coincidentes
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.25rem;">
            Intenta cambiar el término de búsqueda o selecciona otro filtro de categoría o estado.
          </p>
          <button type="button" class="btn btn-outline" id="btn-reset-filters-empty">
            Limpiar Todos los Filtros
          </button>
        </div>
      `;

      const resetBtn = this.habitsRoot.querySelector('#btn-reset-filters-empty');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.searchFilterBar.filters = { search: '', category: 'all', status: 'all' };
          this.searchFilterBar.render(allHabits);
          this.renderFilteredHabits();
        });
      }
      return;
    }

    this.habitsRoot.innerHTML = `
      <section class="habits-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
            <span>Hábitos</span>
            <span class="badge" style="background: rgba(0, 242, 254, 0.1); color: var(--neon-cyan); border-color: rgba(0, 242, 254, 0.3);">
              Mostrando ${filteredHabits.length} de ${allHabits.length}
            </span>
          </h3>
          <span style="font-size: 0.78rem; color: var(--text-muted);">
            Toca el botón para completar el check-in de hoy
          </span>
        </div>

        <div class="habits-grid">
          ${filteredHabits.map((habit) => HabitCard.render(habit)).join('')}
        </div>
      </section>
    `;
  }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => {
  const app = new HabitTrackerApp();
  app.init();
});
