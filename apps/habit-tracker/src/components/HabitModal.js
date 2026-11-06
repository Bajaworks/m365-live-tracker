/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-06T05:51:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id T-002
 */

import { CATEGORIES } from '../data/seedHabits.js';
import { storage } from '../services/storage.js';

const COLOR_PRESETS = [
  '#4facfe', // Azul cian
  '#ff4e50', // Naranja fuego
  '#10b981', // Verde esmeralda
  '#f59e0b', // Ámbar dorado
  '#e100ff', // Magenta neón
  '#00f2fe', // Cian eléctrico
  '#7f00ff', // Violeta intenso
];

export class HabitModal {
  constructor(rootId = 'modal-root') {
    this.root = document.getElementById(rootId);
    this.currentMode = 'create';
    this.editingHabit = null;
    this.initListener();
  }

  initListener() {
    window.addEventListener('open-habit-modal', (e) => {
      const { mode, habit } = e.detail || {};
      this.open(mode || 'create', habit || null);
    });
  }

  open(mode = 'create', habit = null) {
    this.currentMode = mode;
    this.editingHabit = habit;
    this.render();
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.root) this.root.innerHTML = '';
    document.body.style.overflow = '';
  }

  render() {
    if (!this.root) return;

    const isEdit = this.currentMode === 'edit' && this.editingHabit;
    const title = isEdit ? 'Editar Hábito' : 'Crear Nuevo Hábito';
    const habit = this.editingHabit || {};
    const defaultColor = habit.color || COLOR_PRESETS[0];

    this.root.innerHTML = `
      <div class="modal-backdrop animate-fade-in" id="habit-modal-backdrop">
        <div class="glass-modal habit-modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-header">
            <h2 id="modal-title" class="modal-title text-gradient-cyan">${title}</h2>
            <button type="button" class="btn-close-modal" id="btn-close-modal" aria-label="Cerrar ventana">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form id="habit-form" class="modal-form">
            <!-- Nombre -->
            <div class="form-group">
              <label for="habit-name" class="form-label">Nombre del Hábito <span class="required">*</span></label>
              <input 
                type="text" 
                id="habit-name" 
                name="name" 
                class="form-input" 
                placeholder="Ej. Leer 20 páginas, Meditar, Correr 5km..." 
                value="${habit.name || ''}" 
                required 
                minlength="3" 
                maxlength="60"
                autofocus
              />
              <span class="form-hint">Entre 3 y 60 caracteres</span>
            </div>

            <!-- Categoría y Frecuencia -->
            <div class="form-row">
              <div class="form-group">
                <label for="habit-category" class="form-label">Categoría <span class="required">*</span></label>
                <select id="habit-category" name="category" class="form-select" required>
                  ${CATEGORIES.map((c) => `
                    <option value="${c.id}" ${habit.category === c.id ? 'selected' : ''}>
                      ${c.label}
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="habit-frequency" class="form-label">Frecuencia Objetivo</label>
                <select id="habit-frequency" name="frequency" class="form-select">
                  <option value="daily" ${habit.frequency === 'daily' ? 'selected' : ''}>Diaria (todos los días)</option>
                  <option value="weekdays" ${habit.frequency === 'weekdays' ? 'selected' : ''}>Entre semana (Lun a Vie)</option>
                  <option value="weekends" ${habit.frequency === 'weekends' ? 'selected' : ''}>Fines de semana (Sáb y Dom)</option>
                </select>
              </div>
            </div>

            <!-- Paleta de Color -->
            <div class="form-group">
              <label class="form-label">Color de Identidad</label>
              <div class="color-picker-palette">
                ${COLOR_PRESETS.map((color) => `
                  <label class="color-pill-label">
                    <input 
                      type="radio" 
                      name="color" 
                      value="${color}" 
                      ${defaultColor === color ? 'checked' : ''} 
                    />
                    <span class="color-pill" style="--c: ${color};"></span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Descripción breve -->
            <div class="form-group">
              <label for="habit-description" class="form-label">Descripción o Motivación (Opcional)</label>
              <textarea 
                id="habit-description" 
                name="description" 
                class="form-textarea" 
                rows="2" 
                placeholder="¿Por qué es importante este hábito para ti?"
                maxlength="140"
              >${habit.description || ''}</textarea>
            </div>

            <!-- Botones de Acción -->
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" id="btn-cancel-modal">Cancelar</button>
              <button type="submit" class="btn btn-primary">
                ${isEdit ? 'Guardar Cambios' : 'Crear Hábito'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const backdrop = document.getElementById('habit-modal-backdrop');
    const closeBtn = document.getElementById('btn-close-modal');
    const cancelBtn = document.getElementById('btn-cancel-modal');
    const form = document.getElementById('habit-form');

    const handleClose = () => this.close();

    if (closeBtn) closeBtn.addEventListener('click', handleClose);
    if (cancelBtn) cancelBtn.addEventListener('click', handleClose);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) handleClose();
      });
    }

    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        this.close();
        window.removeEventListener('keydown', handleKeydown);
      }
    };
    window.addEventListener('keydown', handleKeydown);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const category = formData.get('category');
        const frequency = formData.get('frequency') || 'daily';
        const color = formData.get('color') || COLOR_PRESETS[0];
        const description = (formData.get('description') || '').trim();

        if (name.length < 3) {
          alert('El nombre debe tener al menos 3 caracteres.');
          return;
        }

        if (this.currentMode === 'edit' && this.editingHabit) {
          storage.updateHabit(this.editingHabit.id, {
            name,
            category,
            frequency,
            color,
            description,
          });
        } else {
          storage.addHabit({
            name,
            category,
            frequency,
            color,
            description,
          });
        }

        this.close();
      });
    }
  }
}

