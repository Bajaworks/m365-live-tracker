/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:46:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-005
 */

import { storage } from '../services/storage.js';

export class AppHeader {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <header class="glass-panel app-header">
        <div class="brand-area">
          <div class="logo-badge">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div>
            <div class="brand-title">
              <span class="text-gradient-cyan">LEVEL</span>
              <span class="text-gradient-fire">UP</span>
              <span class="brand-tag">HABIT TRACKER</span>
            </div>
            <p class="brand-motto">Construye constancia, supera tus límites día tras día</p>
          </div>
        </div>

        <div class="header-actions">
          <button id="btn-reset-demo" class="btn btn-outline" title="Restablecer hábitos de demostración">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            <span>Reiniciar Demo</span>
          </button>
          
          <button id="btn-open-create-modal" class="btn btn-primary" title="Crear nuevo hábito">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Nuevo Hábito</span>
          </button>
        </div>
      </header>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const resetBtn = this.container.querySelector('#btn-reset-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('¿Deseas reiniciar los hábitos al conjunto de demostración inicial?')) {
          storage.resetToSeed();
        }
      });
    }

    const createBtn = this.container.querySelector('#btn-open-create-modal');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-habit-modal', { detail: { mode: 'create' } }));
      });
    }
  }
}

