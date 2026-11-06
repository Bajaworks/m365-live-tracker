/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:46:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id T-004
 */

/**
 * Genera fechas ISO (YYYY-MM-DD) relativas a la fecha actual local
 * @param {number} daysAgo 
 * @returns {string}
 */
export function getRelativeDate(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Catálogo de categorías predeterminadas con metadatos visuales
 */
export const CATEGORIES = [
  { id: 'study', label: 'Estudio', icon: 'book-open', color: '#4facfe', glow: 'rgba(79, 172, 254, 0.4)' },
  { id: 'fitness', label: 'Fitness', icon: 'flame', color: '#ff4e50', glow: 'rgba(255, 78, 80, 0.4)' },
  { id: 'health', label: 'Salud', icon: 'droplet', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'productivity', label: 'Productividad', icon: 'zap', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'content_creation', label: 'Contenido', icon: 'sparkles', color: '#e100ff', glow: 'rgba(225, 0, 255, 0.4)' },
  { id: 'mindset', label: 'Mentalidad', icon: 'moon', color: '#00f2fe', glow: 'rgba(0, 242, 254, 0.4)' },
];

/**
 * Lista de hábitos semilla vivos con historial reciente para demostración inmediata
 */
export function createSeedHabits() {
  const today = getRelativeDate(0);
  const d1 = getRelativeDate(1);
  const d2 = getRelativeDate(2);
  const d3 = getRelativeDate(3);
  const d4 = getRelativeDate(4);
  const d5 = getRelativeDate(5);

  return [
    {
      id: 'habit-seed-1',
      name: 'Aprender algo nuevo de código',
      description: 'Dedicar 30 min a practicar TypeScript o nuevas APIs',
      category: 'study',
      frequency: 'daily',
      color: '#4facfe',
      icon: 'code',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      completedDates: [d4, d3, d2, d1, today],
      currentStreak: 5,
      longestStreak: 12,
    },
    {
      id: 'habit-seed-2',
      name: 'Entrenamiento de fuerza o cardio',
      description: 'Rutina de 45 min o sesión de running',
      category: 'fitness',
      frequency: 'daily',
      color: '#ff4e50',
      icon: 'flame',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      completedDates: [d2, d1],
      currentStreak: 2,
      longestStreak: 6,
    },
    {
      id: 'habit-seed-3',
      name: 'Tomar 2.5L de agua',
      description: 'Mantener hidratación constante con termo personal',
      category: 'health',
      frequency: 'daily',
      color: '#10b981',
      icon: 'droplet',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      completedDates: [d5, d4, d3, d2, d1, today],
      currentStreak: 6,
      longestStreak: 15,
    },
    {
      id: 'habit-seed-4',
      name: 'Borrador de contenido / video',
      description: 'Escribir un hilo, guion corto o preparar post',
      category: 'content_creation',
      frequency: 'weekdays',
      color: '#e100ff',
      icon: 'sparkles',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      completedDates: [d1],
      currentStreak: 1,
      longestStreak: 4,
    },
    {
      id: 'habit-seed-5',
      name: 'Meditación y desconexión 10 min',
      description: 'Respiración consciente sin pantallas antes de dormir',
      category: 'mindset',
      frequency: 'daily',
      color: '#00f2fe',
      icon: 'moon',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 7,
    },
    {
      id: 'habit-seed-6',
      name: 'Planificar prioridades del día',
      description: 'Definir las 3 tareas de alto impacto por la mañana',
      category: 'productivity',
      frequency: 'weekdays',
      color: '#f59e0b',
      icon: 'zap',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      completedDates: [d3, d2, d1, today],
      currentStreak: 4,
      longestStreak: 8,
    },
  ];
}

