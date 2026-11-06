/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:56:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-003
 */

import { CATEGORIES } from '../data/seedHabits.js';

export class SearchFilterBar {
  constructor(containerId = 'filters-root', onFilterChange) {
    this.container = typeof document !== 'undefined' ? document.getElementById(containerId) : null;
    this.onFilterChange = onFilterChange;
    this.filters = {
      search: '',
      category: 'all',
      status: 'all', // all, pending, completed, streaking
    };
  }

  render(habits = []) {
    if (!this.container) return;

    // Calcular conteo por categoría
    const counts = { all: habits.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = habits.filter((h) => h.category === cat.id).length;
    });

    this.container.innerHTML = `
      <section class="filters-panel glass-panel">
        <div class="filters-top-row">
          <!-- Buscador en tiempo real -->
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              id="search-input" 
              class="search-input" 
              placeholder="Buscar por nombre o descripción..." 
              value="${this.filters.search}"
            />
            ${this.filters.search ? `
              <button type="button" id="btn-clear-search" class="clear-search-btn" title="Limpiar búsqueda">✕</button>
            ` : ''}
          </div>

          <!-- Filtros de Estado -->
          <div class="status-pills-row">
            <button type="button" class="status-pill ${this.filters.status === 'all' ? 'active' : ''}" data-status="all">
              Todos
            </button>
            <button type="button" class="status-pill ${this.filters.status === 'pending' ? 'active' : ''}" data-status="pending">
              ⏳ Pendientes
            </button>
            <button type="button" class="status-pill ${this.filters.status === 'completed' ? 'active' : ''}" data-status="completed">
              ✅ Completados
            </button>
            <button type="button" class="status-pill ${this.filters.status === 'streaking' ? 'active' : ''}" data-status="streaking">
              🔥 En Racha
            </button>
          </div>
        </div>

        <!-- Filtros de Categorías -->
        <div class="category-pills-wrapper">
          <button 
            type="button" 
            class="cat-filter-pill ${this.filters.category === 'all' ? 'active' : ''}" 
            data-category="all"
          >
            Todas las categorías
            <span class="cat-count-badge">${counts.all}</span>
          </button>

          ${CATEGORIES.map((cat) => `
            <button 
              type="button" 
              class="cat-filter-pill ${this.filters.category === cat.id ? 'active' : ''}" 
              data-category="${cat.id}"
              style="--cat-c: ${cat.color};"
            >
              <span>${cat.label}</span>
              <span class="cat-count-badge">${counts[cat.id] || 0}</span>
            </button>
          `).join('')}
        </div>
      </section>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const searchInput = this.container.querySelector('#search-input');
    const clearBtn = this.container.querySelector('#btn-clear-search');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.triggerChange();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.filters.search = '';
        searchInput.value = '';
        this.triggerChange();
      });
    }

    // Filtros de estado
    this.container.querySelectorAll('.status-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.filters.status = btn.dataset.status;
        this.updateActiveStatusButton(btn);
        this.triggerChange();
      });
    });

    // Filtros de categoría
    this.container.querySelectorAll('.cat-filter-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.filters.category = btn.dataset.category;
        this.updateActiveCategoryButton(btn);
        this.triggerChange();
      });
    });
  }

  updateActiveStatusButton(activeBtn) {
    this.container.querySelectorAll('.status-pill').forEach((b) => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  updateActiveCategoryButton(activeBtn) {
    this.container.querySelectorAll('.cat-filter-pill').forEach((b) => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  triggerChange() {
    if (typeof this.onFilterChange === 'function') {
      this.onFilterChange({ ...this.filters });
    }
  }

  /**
   * Aplica los filtros actuales sobre una lista de hábitos
   * @param {Array} habits 
   * @param {string} todayIso 
   * @returns {Array}
   */
  filterHabits(habits, todayIso) {
    return habits.filter((habit) => {
      // 1. Filtro por búsqueda
      if (this.filters.search) {
        const query = this.filters.search;
        const matchesName = (habit.name || '').toLowerCase().includes(query);
        const matchesDesc = (habit.description || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // 2. Filtro por categoría
      if (this.filters.category !== 'all') {
        if (habit.category !== this.filters.category) return false;
      }

      // 3. Filtro por estado
      const isCompletedToday = habit.completedDates && habit.completedDates.includes(todayIso);
      if (this.filters.status === 'completed' && !isCompletedToday) return false;
      if (this.filters.status === 'pending' && isCompletedToday) return false;
      if (this.filters.status === 'streaking' && (habit.currentStreak || 0) <= 0) return false;

      return true;
    });
  }
}
