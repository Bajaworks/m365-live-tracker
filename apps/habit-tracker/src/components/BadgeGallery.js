/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:56:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-004
 */

import { evaluateMilestones } from '../services/streakEngine.js';

export class BadgeGallery {
  constructor(containerId = 'badges-root') {
    this.container = document.getElementById(containerId);
  }

  render(habits = []) {
    if (!this.container) return;

    // Obtener la racha máxima alcanzada entre todos los hábitos
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0, h.currentStreak || 0), 0);
    const milestones = evaluateMilestones(bestStreak);
    const unlockedCount = milestones.filter((m) => m.unlocked).length;

    this.container.innerHTML = `
      <section class="badges-panel glass-panel animate-fade-in">
        <div class="badges-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <h3 class="badges-title text-gradient-fire">Galería de Insignias y Logros</h3>
              <span class="badge" style="color: var(--neon-fire); border-color: rgba(255, 78, 80, 0.4);">
                ${unlockedCount} / ${milestones.length} Desbloqueadas
              </span>
            </div>
            <p class="badges-subtitle">Desbloquea hitos de constancia acumulando rachas continuas en tus hábitos.</p>
          </div>
          <div class="best-streak-chip">
            <span>Récord Actual:</span>
            <strong style="color: var(--neon-fire); font-size: 1.1rem;">🔥 ${bestStreak} días</strong>
          </div>
        </div>

        <div class="badges-grid">
          ${milestones.map((b) => `
            <div class="badge-card ${b.unlocked ? 'is-unlocked' : 'is-locked'}">
              <div class="badge-icon-box">
                <span class="badge-emoji">${b.icon}</span>
                ${b.unlocked ? '<div class="badge-shine-effect"></div>' : ''}
              </div>
              <div class="badge-info">
                <h4 class="badge-name">${b.name}</h4>
                <span class="badge-threshold">${b.days} ${b.days === 1 ? 'Día de racha' : 'Días de racha'}</span>
                <p class="badge-desc">${b.description}</p>
              </div>
              <div class="badge-status-tag">
                ${b.unlocked ? '<span class="unlocked-label">🏆 Desbloqueada</span>' : '<span class="locked-label">🔒 Bloqueada</span>'}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
}

