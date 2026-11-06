/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:56:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-001
 */

import { formatLocalIsoDate } from '../services/streakEngine.js';

export class Dashboard {
  constructor(containerId = 'dashboard-root') {
    this.container = document.getElementById(containerId);
  }

  /**
   * Obtiene la microcopia motivacional según el porcentaje de completitud
   * @param {number} rate 
   * @returns {string}
   */
  static getMotivationalMessage(rate) {
    if (rate === 0) return '¡Todo gran viaje comienza con el primer paso! Marca tu primer hábito hoy 💪';
    if (rate < 50) return '¡Estás ganando impulso! La constancia se construye día a día ⚡';
    if (rate < 100) return '¡Más de la mitad del camino recorrido! Mantén el ritmo 🔥';
    return '¡Día Perfecto! Has completado el 100% de tus metas diarias. ¡Imparable! 👑';
  }

  /**
   * Genera las métricas de los últimos 7 días
   * @param {Array} habits 
   * @returns {Array}
   */
  static computeWeeklyHistory(habits) {
    const days = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = formatLocalIsoDate(d);
      const dayName = dayNames[d.getDay()];

      const completedInDay = habits.filter(
        (h) => h.completedDates && h.completedDates.includes(iso)
      ).length;

      const rate = habits.length > 0 ? Math.round((completedInDay / habits.length) * 100) : 0;

      days.push({
        iso,
        dayName,
        completed: completedInDay,
        total: habits.length,
        rate,
        isToday: i === 0,
      });
    }

    return days;
  }

  render(habits = []) {
    if (!this.container) return;

    const todayIso = formatLocalIsoDate();
    const totalHabits = habits.length;

    const completedToday = habits.filter(
      (h) => h.completedDates && h.completedDates.includes(todayIso)
    ).length;

    const percent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const motivationalQuote = Dashboard.getMotivationalMessage(percent);

    // Métricas de racha
    const activeStreaksCount = habits.filter((h) => (h.currentStreak || 0) > 0).length;
    const maxStreakRecord = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);

    // Historial semanal de 7 días
    const weeklyHistory = Dashboard.computeWeeklyHistory(habits);

    // Parámetros del círculo SVG
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    this.container.innerHTML = `
      <section class="glass-panel dashboard-panel animate-fade-in">
        <div class="dashboard-grid">
          <!-- Columna 1: Medidor Circular de Progreso Diario -->
          <div class="progress-hero-card">
            <div class="circular-progress-wrap">
              <svg class="progress-ring" width="136" height="136">
                <circle
                  class="progress-ring-bg"
                  stroke="rgba(255, 255, 255, 0.06)"
                  stroke-width="10"
                  fill="transparent"
                  r="${radius}"
                  cx="68"
                  cy="68"
                />
                <circle
                  class="progress-ring-fill"
                  stroke="url(#progress-gradient)"
                  stroke-width="10"
                  stroke-linecap="round"
                  fill="transparent"
                  r="${radius}"
                  cx="68"
                  cy="68"
                  style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00f2fe" />
                    <stop offset="100%" stop-color="#4facfe" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="progress-ring-label">
                <span class="progress-percent">${percent}%</span>
                <span class="progress-subtext">Hoy</span>
              </div>
            </div>

            <div class="progress-hero-text">
              <span class="badge" style="color: var(--neon-cyan); border-color: rgba(0, 242, 254, 0.3);">
                PROGRESO DEL DÍA
              </span>
              <h3 class="daily-progress-title">
                ${completedToday} de ${totalHabits} completados
              </h3>
              <p class="motivational-quote">${motivationalQuote}</p>
            </div>
          </div>

          <!-- Columna 2: Métricas Resumen y Gráfica Semanal -->
          <div class="metrics-weekly-card">
            <div class="quick-stats-row">
              <div class="stat-box">
                <span class="stat-number text-gradient-cyan">${totalHabits}</span>
                <span class="stat-label">Hábitos Activos</span>
              </div>
              <div class="stat-box">
                <span class="stat-number text-gradient-fire">${activeStreaksCount}</span>
                <span class="stat-label">En Racha Activa</span>
              </div>
              <div class="stat-box">
                <span class="stat-number" style="color: #ff8a00;">${maxStreakRecord}d</span>
                <span class="stat-label">Mejor Racha Récord</span>
              </div>
            </div>

            <!-- Gráfica de 7 días -->
            <div class="weekly-section">
              <div class="weekly-header">
                <span class="weekly-title">Últimos 7 Días</span>
                <span class="weekly-legend">Cumplimiento diario</span>
              </div>

              <div class="weekly-bars-container">
                ${weeklyHistory.map((day) => `
                  <div class="weekly-bar-col ${day.isToday ? 'is-current-day' : ''}">
                    <div class="bar-track">
                      <div class="bar-fill" style="height: ${Math.max(day.rate, 6)}%; background: ${day.rate >= 80 ? 'var(--grad-emerald)' : (day.rate > 0 ? 'var(--grad-cyan-blue)' : 'rgba(255,255,255,0.08)')};"></div>
                    </div>
                    <span class="bar-day-name">${day.dayName}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

