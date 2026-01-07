// SparkSave - Savings Goal Tracker

// DOM Elements
const goalForm = document.getElementById('goal-form');
const goalsContainer = document.getElementById('goals-container');
const emptyState = document.getElementById('empty-state');
const totalSavedEl = document.getElementById('total-saved');
const totalGoalEl = document.getElementById('total-goal');
const progressPercentEl = document.getElementById('progress-percent');

// State
let goals = [];
let currentView = 'active'; // 'active' or 'history'
let currentSort = 'recent'; // 'recent', 'highest', 'lowest'

// Initialize app
// Initialize app
function init() {
  loadGoals();
  setupFilterButtons();
  setupSortDropdown();
  renderGoals();
  updateStats();
  setupEventListeners();
}

// Load goals from localStorage
function loadGoals() {
  const stored = localStorage.getItem('sparksave-goals');
  if (stored) {
    goals = JSON.parse(stored);
  } else {
    // Add a sample goal for demo
    goals = [
      {
        id: Date.now(),
        name: 'Emergency Fund',
        target: 10000,
        saved: 2500,
        description: 'Saving for a rainy day'
      }
    ];
    saveGoals();
  }
}

// Save goals to localStorage
function saveGoals() {
  localStorage.setItem('sparksave-goals', JSON.stringify(goals));
}

// Format currency (Philippine Peso)
function formatCurrency(amount) {
  return '₱' + amount.toLocaleString('en-PH');
}

// Calculate percentage
function calculatePercent(saved, target) {
  if (target === 0) return 0;
  return Math.min(100, Math.round((saved / target) * 100 * 10) / 10);
}

// Update stats display
function updateStats() {
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalGoal = goals.reduce((sum, g) => sum + g.target, 0);
  const percent = calculatePercent(totalSaved, totalGoal);

  totalSavedEl.textContent = formatCurrency(totalSaved);
  totalGoalEl.textContent = formatCurrency(totalGoal);
  progressPercentEl.textContent = percent + '%';
}

// Render all goals
function renderGoals() {
  goalsContainer.innerHTML = '';

  // Filter goals based on current view
  let filteredGoals = goals.filter(goal => {
    const isCompleted = goal.saved >= goal.target;
    return currentView === 'active' ? !isCompleted : isCompleted;
  });

  // Sort goals if in history view
  if (currentView === 'history') {
    filteredGoals.sort((a, b) => {
      if (currentSort === 'recent') {
        const dateA = a.completedAt || a.id;
        const dateB = b.completedAt || b.id;
        return dateB - dateA; // Descending
      } else if (currentSort === 'highest') {
        return b.target - a.target; // Descending
      } else if (currentSort === 'lowest') {
        return a.target - b.target; // Ascending
      }
      return 0;
    });
  }

  if (filteredGoals.length === 0) {
    emptyState.classList.remove('hidden');
    // Update empty state text based on view
    const emptyText = emptyState.querySelector('p');
    if (emptyText) {
      emptyText.textContent = currentView === 'active'
        ? "No active goals. Add a new one!"
        : "No completed goals yet. Keep saving!";
    }
    return;
  }

  emptyState.classList.add('hidden');

  filteredGoals.forEach(goal => {
    const card = createGoalCard(goal);
    goalsContainer.appendChild(card);
  });
}

// Create a goal card element
function createGoalCard(goal) {
  const percent = calculatePercent(goal.saved, goal.target);
  const isComplete = goal.saved >= goal.target;

  const card = document.createElement('div');
  card.className = 'goal-card';
  card.dataset.id = goal.id;

  card.innerHTML = `
    <div class="goal-header">
      <h3 class="goal-name">${escapeHtml(goal.name)}</h3>
      <button class="goal-delete" title="Delete goal" aria-label="Delete goal">×</button>
    </div>
    <span class="goal-icon">${isComplete ? '✅' : '🎯'}</span>
    ${goal.description ? `<p class="goal-description">${escapeHtml(goal.description)}</p>` : ''}
    <div class="goal-progress">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%;"></div>
      </div>
    </div>
    <div class="goal-amounts">
      ${formatCurrency(goal.saved)}<span>of ${formatCurrency(goal.target)}</span>
    </div>
    <div class="goal-card-actions">
      <button class="goal-add-savings-btn" ${isComplete ? 'disabled' : ''}>
        <span>💰</span> Add Savings
      </button>
      <button class="goal-edit-btn">
        <span>✏️</span> Edit
      </button>
    </div>
    <div class="goal-add-savings-form hidden">
      <div class="goal-add-savings-input-group">
        <input type="number" class="goal-savings-input" placeholder="Amount to add" min="1">
        <button class="goal-savings-confirm">Add</button>
        <button class="goal-savings-cancel">Cancel</button>
      </div>
    </div>
    <div class="goal-edit-form hidden">
      <div class="goal-edit-fields">
        <div class="edit-field">
          <label>Goal Name</label>
          <input type="text" class="edit-name-input" value="${escapeHtml(goal.name)}">
        </div>
        <div class="edit-field">
          <label>Target (₱)</label>
          <input type="number" class="edit-target-input" value="${goal.target}" min="1">
        </div>
        <div class="edit-field">
          <label>Description</label>
          <input type="text" class="edit-description-input" value="${escapeHtml(goal.description || '')}">
        </div>
      </div>
      <div class="goal-edit-actions">
        <button class="goal-edit-save">Save</button>
        <button class="goal-edit-cancel">Cancel</button>
      </div>
    </div>
  `;

  // Add delete handler
  card.querySelector('.goal-delete').addEventListener('click', () => {
    showDeleteConfirmation(goal);
  });



  // Add savings button handler
  const addSavingsBtn = card.querySelector('.goal-add-savings-btn');
  const addSavingsForm = card.querySelector('.goal-add-savings-form');
  const savingsInput = card.querySelector('.goal-savings-input');
  const confirmBtn = card.querySelector('.goal-savings-confirm');
  const cancelBtn = card.querySelector('.goal-savings-cancel');
  const cardActions = card.querySelector('.goal-card-actions');

  addSavingsBtn.addEventListener('click', () => {
    addSavingsForm.classList.remove('hidden');
    cardActions.classList.add('hidden');
    savingsInput.focus();
  });

  cancelBtn.addEventListener('click', () => {
    addSavingsForm.classList.add('hidden');
    cardActions.classList.remove('hidden');
    savingsInput.value = '';
  });

  confirmBtn.addEventListener('click', () => {
    const amount = parseFloat(savingsInput.value);
    if (!amount || amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    const newSaved = goal.saved + amount;
    if (newSaved > goal.target) {
      const maxAdd = goal.target - goal.saved;
      showError(`Maximum you can add is ${formatCurrency(maxAdd)}`);
      return;
    }

    // Update goal
    goal.saved = newSaved;
    saveGoals();
    renderGoals();
    updateStats();
    showNotification(`✅ Added ${formatCurrency(amount)} to "${goal.name}"!`);

    // Check for milestone
    if (goal.saved >= goal.target) {
      if (!goal.completedAt) {
        goal.completedAt = Date.now();
        saveGoals();
      }
      showCelebrationModal(goal);
    }
  });

  // Edit button handler
  const editBtn = card.querySelector('.goal-edit-btn');
  const editForm = card.querySelector('.goal-edit-form');
  const editNameInput = card.querySelector('.edit-name-input');
  const editTargetInput = card.querySelector('.edit-target-input');
  const editDescInput = card.querySelector('.edit-description-input');
  const editSaveBtn = card.querySelector('.goal-edit-save');
  const editCancelBtn = card.querySelector('.goal-edit-cancel');

  editBtn.addEventListener('click', () => {
    editForm.classList.remove('hidden');
    cardActions.classList.add('hidden');
    editNameInput.focus();
  });

  editCancelBtn.addEventListener('click', () => {
    editForm.classList.add('hidden');
    cardActions.classList.remove('hidden');
    // Reset values
    editNameInput.value = goal.name;
    editTargetInput.value = goal.target;
    editDescInput.value = goal.description || '';
  });

  editSaveBtn.addEventListener('click', () => {
    const newName = editNameInput.value.trim();
    const newTarget = parseFloat(editTargetInput.value);
    const newDesc = editDescInput.value.trim();

    if (!newName) {
      showError('Goal name cannot be empty');
      return;
    }

    if (!newTarget || newTarget <= 0) {
      showError('Please enter a valid target amount');
      return;
    }

    if (newTarget < goal.saved) {
      showError(`Target cannot be less than current saved amount (${formatCurrency(goal.saved)})`);
      return;
    }

    // Update goal
    goal.name = newName;
    goal.target = newTarget;
    goal.description = newDesc;
    saveGoals();
    renderGoals();
    updateStats();
    showNotification(`✅ Updated "${newName}"!`);
  });

  return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add a new goal
function addGoal(name, target, saved, description) {
  const goal = {
    id: Date.now(),
    name: name.trim(),
    target: parseFloat(target),
    saved: parseFloat(saved),
    description: description.trim()
  };

  goals.push(goal);
  saveGoals();
  renderGoals();
  updateStats();
}

// Delete a goal
function deleteGoal(id) {
  goals = goals.filter(g => g.id !== id);
  saveGoals();
  renderGoals();
  updateStats();
}

// Setup event listeners
function setupEventListeners() {
  goalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('goal-name').value;
    const target = parseFloat(document.getElementById('target-amount').value);
    const saved = parseFloat(document.getElementById('saved-amount').value);
    const description = document.getElementById('goal-description').value;

    // Validate: saved cannot be greater than target
    if (saved > target) {
      showError('Saved amount cannot be greater than the target amount!');
      return;
    }

    // Clear any existing errors
    hideError();

    addGoal(name, target, saved, description);

    // Reset form
    goalForm.reset();
  });

  // Setup navigation buttons
  setupNavigation();

  // Setup header profile button
  setupProfileButton();

  // Setup stats buttons
  setupStatsButtons();
}

// Show error message
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  errorContainer.textContent = message;
  errorContainer.classList.remove('hidden');

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

// Hide error message
function hideError() {
  const errorContainer = document.getElementById('error-container');
  errorContainer.classList.add('hidden');
}

// Setup profile button
function setupProfileButton() {
  const profileBtn = document.getElementById('header-profile');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      showProfileModal();
    });
  }
}

// Show profile modal
function showProfileModal() {
  // Create modal if it doesn't exist
  let modal = document.getElementById('profile-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>👤 Profile</h2>
          <button class="modal-close" id="close-profile-modal">×</button>
        </div>
        <div class="modal-body">
          <div class="profile-avatar">👤</div>
          <div class="profile-info">
            <h3>SparkSave User</h3>
            <p>Member since ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="profile-stats">
            <div class="profile-stat">
              <span class="profile-stat-value">${goals.length}</span>
              <span class="profile-stat-label">Goals</span>
            </div>
            <div class="profile-stat">
              <span class="profile-stat-value">${goals.filter(g => g.saved >= g.target).length}</span>
              <span class="profile-stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-profile-modal').addEventListener('click', () => {
      modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  } else {
    // Update stats in existing modal
    modal.querySelector('.profile-stat-value').textContent = goals.length;
  }

  modal.classList.add('show');
}

// Setup stats buttons
function setupStatsButtons() {
  const addSavingsBtn = document.getElementById('add-savings-btn');
  const editGoalsBtn = document.getElementById('edit-goals-btn');

  if (addSavingsBtn) {
    addSavingsBtn.addEventListener('click', () => {
      showAddSavingsModal();
    });
  }

  if (editGoalsBtn) {
    editGoalsBtn.addEventListener('click', () => {
      // Scroll to goals section
      document.querySelector('.goals-section').scrollIntoView({ behavior: 'smooth' });
      showNotification('✏️ Click the × on any goal to delete it');
    });
  }
}

// Show Add Savings modal
function showAddSavingsModal() {
  if (goals.length === 0) {
    showNotification('📝 Add a goal first before adding savings!');
    return;
  }

  let modal = document.getElementById('add-savings-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'add-savings-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  // Build goal options
  const goalOptions = goals.map(g => `
    <option value="${g.id}">${g.name} (${formatCurrency(g.saved)} / ${formatCurrency(g.target)})</option>
  `).join('');

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>💰 Add Savings</h2>
        <button class="modal-close" id="close-savings-modal">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Select Goal</label>
          <select id="savings-goal-select" class="form-input">
            ${goalOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Amount to Add (₱)</label>
          <input type="number" id="savings-amount" class="form-input" placeholder="500" min="1">
        </div>
        <button class="submit-btn" id="confirm-add-savings">
          <span class="btn-icon">💰</span>
          Add to Savings
        </button>
      </div>
    </div>
  `;

  document.getElementById('close-savings-modal').addEventListener('click', () => {
    modal.classList.remove('show');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  document.getElementById('confirm-add-savings').addEventListener('click', () => {
    const goalId = parseInt(document.getElementById('savings-goal-select').value);
    const amount = parseFloat(document.getElementById('savings-amount').value);

    if (!amount || amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    // Find and update the goal
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const newSaved = goal.saved + amount;

      // Check if new saved amount exceeds target
      if (newSaved > goal.target) {
        showError(`Adding ${formatCurrency(amount)} would exceed the target of ${formatCurrency(goal.target)}. Maximum you can add: ${formatCurrency(goal.target - goal.saved)}`);
        return;
      }

      goal.saved = newSaved;
      saveGoals();
      renderGoals();
      updateStats();
      modal.classList.remove('show');
      showNotification(`✅ Added ${formatCurrency(amount)} to "${goal.name}"!`);
    }
  });

  modal.classList.add('show');
}

// Setup navigation
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      navButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const page = btn.dataset.page;
      handleNavigation(page);
    });
  });
}

// Handle navigation
function handleNavigation(page) {
  switch (page) {
    case 'home':
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'add':
      // Scroll to add goal form
      document.querySelector('.add-goal-section').scrollIntoView({ behavior: 'smooth' });
      break;
    case 'stats':
      // Scroll to stats card
      const statsCard = document.querySelector('.stats-card');
      statsCard.scrollIntoView({ behavior: 'smooth' });
      // Highlight card
      statsCard.classList.remove('highlight');
      void statsCard.offsetWidth; // Trigger reflow
      statsCard.classList.add('highlight');

      showNotification('📊 Stats Dashboard');
      break;
    case 'settings':
      showNotification('⚙️ Settings - Coming Soon!');
      break;
    case 'profile':
      showNotification('👤 Profile - Coming Soon!');
      break;
  }
}

// Show notification toast
function showNotification(message) {
  // Remove existing notification
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Initialize when DOM is ready
// Setup filter buttons
function setupFilterButtons() {
  const activeBtn = document.getElementById('view-active');
  const historyBtn = document.getElementById('view-history');
  const sortSelect = document.getElementById('history-sort');

  if (activeBtn && historyBtn) {
    activeBtn.addEventListener('click', () => {
      currentView = 'active';
      activeBtn.classList.add('active');
      historyBtn.classList.remove('active');
      sortSelect.classList.add('hidden');
      renderGoals();
    });

    historyBtn.addEventListener('click', () => {
      currentView = 'history';
      historyBtn.classList.add('active');
      activeBtn.classList.remove('active');
      sortSelect.classList.remove('hidden');
      renderGoals();
    });
  }
}

// Setup sort dropdown
function setupSortDropdown() {
  const sortSelect = document.getElementById('history-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderGoals();
    });
  }
}

// Show delete confirmation modal
function showDeleteConfirmation(goal) {
  let modal = document.getElementById('delete-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'delete-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>⚠️ Delete Goal?</h2>
        <button class="modal-close" id="close-delete-modal">×</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete <strong>${escapeHtml(goal.name)}</strong>?</p>
        <p class="modal-subtitle">This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="modal-btn cancel-btn" id="cancel-delete">Cancel</button>
          <button class="modal-btn delete-confirm-btn" id="confirm-delete">Delete</button>
        </div>
      </div>
    </div>
  `;

  const closeBtn = document.getElementById('close-delete-modal');
  const cancelBtn = document.getElementById('cancel-delete');
  const confirmBtn = document.getElementById('confirm-delete');

  const closeModal = () => modal.classList.remove('show');

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  confirmBtn.addEventListener('click', () => {
    deleteGoal(goal.id);
    closeModal();
    showNotification(`🗑️ Deleted "${goal.name}"`);
  });

  modal.classList.add('show');
}

// Setup filter buttons
function setupFilterButtons() {
  const activeBtn = document.getElementById('view-active');
  const historyBtn = document.getElementById('view-history');

  if (activeBtn && historyBtn) {
    activeBtn.addEventListener('click', () => {
      currentView = 'active';
      activeBtn.classList.add('active');
      historyBtn.classList.remove('active');
      renderGoals();
    });

    historyBtn.addEventListener('click', () => {
      currentView = 'history';
      historyBtn.classList.add('active');
      activeBtn.classList.remove('active');
      renderGoals();
    });
  }
}

// Show celebration modal with confetti
function showCelebrationModal(goal) {
  const modal = document.getElementById('celebration-modal');
  const nameEl = document.getElementById('celebration-goal-name');
  const amountEl = document.getElementById('celebration-amount');
  const closeBtn = document.getElementById('close-celebration');
  const confettiContainer = document.getElementById('confetti-container');

  if (nameEl) nameEl.textContent = goal.name;
  if (amountEl) amountEl.textContent = formatCurrency(goal.target);

  // Create confetti
  if (confettiContainer) {
    confettiContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confettiContainer.appendChild(confetti);
    }
  }

  modal.classList.add('show');

  const closeModal = () => {
    modal.classList.remove('show');
  };

  closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
