/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:51:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-003
 */

/**
 * Convierte un objeto Date o timestamp a formato YYYY-MM-DD en la zona horaria local
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatLocalIsoDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parsea un string YYYY-MM-DD a un objeto Date local
 * @param {string} dateStr 
 * @returns {Date}
 */
export function parseLocalIsoDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Calcula de manera determinística la racha actual y la racha máxima histórica
 * @param {string[]} completedDates - Array de fechas YYYY-MM-DD
 * @param {string} [todayStr] - Fecha de referencia (por defecto hoy local)
 * @returns {{ currentStreak: number, longestStreak: number, isCompletedToday: boolean }}
 */
export function calculateStreakStats(completedDates = [], todayStr = formatLocalIsoDate()) {
  const uniqueDates = Array.from(new Set(completedDates.filter(Boolean)));
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, isCompletedToday: false };
  }

  const dateSet = new Set(uniqueDates);
  const isCompletedToday = dateSet.has(todayStr);

  const today = parseLocalIsoDate(todayStr);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalIsoDate(yesterday);

  let currentStreak = 0;
  let checkDate = new Date(today);

  // Si hoy no está completado, verificar si ayer sí lo estuvo para mantener la racha activa
  if (!isCompletedToday) {
    if (dateSet.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      currentStreak = 0;
    }
  }

  // Contar días consecutivos hacia atrás
  if (dateSet.has(formatLocalIsoDate(checkDate))) {
    while (dateSet.has(formatLocalIsoDate(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calcular longestStreak recorriendo todas las fechas ordenadas ascendentemente
  const sortedAsc = uniqueDates.slice().sort();
  let longestStreak = currentStreak;
  let runningStreak = 0;
  let prevDate = null;

  for (const dStr of sortedAsc) {
    const curDate = parseLocalIsoDate(dStr);
    if (prevDate) {
      const diffMs = curDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    } else {
      runningStreak = 1;
    }

    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = curDate;
  }

  return {
    currentStreak,
    longestStreak,
    isCompletedToday,
  };
}

/**
 * Alterna el estado de check-in para una fecha dada (toggle) y recalcula rachas
 * @param {Object} habit 
 * @param {string} [targetDate] 
 * @returns {Object} Hábito actualizado
 */
export function toggleCheckIn(habit, targetDate = formatLocalIsoDate()) {
  const dates = new Set(habit.completedDates || []);
  let wasCompleted = dates.has(targetDate);

  if (wasCompleted) {
    dates.delete(targetDate);
  } else {
    dates.add(targetDate);
  }

  const updatedDates = Array.from(dates).sort();
  const stats = calculateStreakStats(updatedDates, formatLocalIsoDate());

  return {
    ...habit,
    completedDates: updatedDates,
    currentStreak: stats.currentStreak,
    longestStreak: Math.max(habit.longestStreak || 0, stats.longestStreak),
  };
}

/**
 * Evalúa los hitos de insignias alcanzados para una racha determinada
 * @param {number} streak 
 * @returns {Array} Insignias desbloqueadas
 */
export function evaluateMilestones(streak) {
  const milestones = [
    { id: 'badge-1', name: 'Primer Paso', days: 1, icon: '🌟', description: '¡Completaste tu primer día!' },
    { id: 'badge-3', name: 'En Llamas', days: 3, icon: '🔥', description: 'Racha de 3 días consecutivos.' },
    { id: 'badge-7', name: 'Imparable', days: 7, icon: '⚡', description: 'Racha de 7 días consecutivos.' },
    { id: 'badge-21', name: 'Hábito de Hierro', days: 21, icon: '🏆', description: '21 días: el hábito está formado.' },
    { id: 'badge-30', name: 'Maestría Total', days: 30, icon: '👑', description: '30 días de disciplina absoluta.' },
  ];

  return milestones.map((m) => ({
    ...m,
    unlocked: streak >= m.days,
  }));
}

