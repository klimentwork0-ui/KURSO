/* ============================================
   KURSO — Admin Panel Logic
   ============================================ */

const KursoAdmin = (() => {

  function init() {
    setupNavigation();
    renderRates();
    renderBranches();
    renderBookings();
    
    // Setup modal close events
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.admin-modal').classList.remove('active');
      });
    });
  }

  function setupNavigation() {
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Update active nav
        document.querySelectorAll('.admin-nav-item').forEach(nav => nav.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Show correct panel
        const target = e.currentTarget.dataset.target;
        document.querySelectorAll('.admin-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(`panel-${target}`).classList.add('active');
        
        // Update title
        document.getElementById('admin-title').textContent = e.currentTarget.textContent.trim();
      });
    });
  }

  // ── RATES ──
  function renderRates() {
    const tbody = document.getElementById('admin-rates-tbody');
    if (!tbody) return;
    
    const rates = KursoData.getAllRates();
    
    tbody.innerHTML = rates.map(r => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">${r.flag}</span>
            <span style="font-weight:600;">${r.code}</span>
          </div>
        </td>
        <td>${r.name}</td>
        <td>
          <input type="number" step="0.0001" value="${r.buy}" id="rate-buy-${r.code}">
        </td>
        <td>
          <input type="number" step="0.0001" value="${r.sell}" id="rate-sell-${r.code}">
        </td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${r.active ? 'checked' : ''} onchange="KursoAdmin.toggleRate('${r.code}')">
            <span class="toggle-slider"></span>
          </label>
        </td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="KursoAdmin.saveRate('${r.code}')">Зберегти</button>
        </td>
      </tr>
    `).join('');
  }

  function saveRate(code) {
    const buy = document.getElementById(`rate-buy-${code}`).value;
    const sell = document.getElementById(`rate-sell-${code}`).value;
    
    KursoData.updateRate(code, buy, sell);
    showToast('Курс успішно оновлено');
  }

  function toggleRate(code) {
    KursoData.toggleRateActive(code);
    showToast('Статус валюти змінено');
  }

  // ── BRANCHES ──
  function renderBranches() {
    const tbody = document.getElementById('admin-branches-tbody');
    if (!tbody) return;
    
    const branches = KursoData.getAllBranches();
    
    tbody.innerHTML = branches.map(b => `
      <tr>
        <td>${b.id}</td>
        <td style="font-weight:500;">${b.name}</td>
        <td style="font-size:12px;">${b.address}</td>
        <td>
          <select class="form-select" style="min-height:32px; padding:4px 24px 4px 8px; font-size:12px;" onchange="KursoAdmin.updateBranchStatus(${b.id}, this.value)">
            <option value="open" ${b.status === 'open' ? 'selected' : ''}>Відчинено</option>
            <option value="closed" ${b.status === 'closed' ? 'selected' : ''}>Зачинено (назавжди)</option>
            <option value="temporarily_closed" ${b.status === 'temporarily_closed' ? 'selected' : ''}>Тимчасово закрито</option>
          </select>
        </td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${b.booking_enabled ? 'checked' : ''} onchange="KursoAdmin.toggleBranchBooking(${b.id}, this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="KursoAdmin.editBranch(${b.id})">Редагувати</button>
        </td>
      </tr>
    `).join('');
  }

  function updateBranchStatus(id, status) {
    KursoData.updateBranchStatus(id, status);
    showToast('Статус каси оновлено');
    renderBranches(); // re-render to update toggle if needed
  }

  function toggleBranchBooking(id, enabled) {
    KursoData.updateBranch(id, { booking_enabled: enabled });
    showToast('Доступність бронювання оновлено');
  }

  function editBranch(id) {
    const branch = KursoData.getBranch(id);
    if (!branch) return;
    
    document.getElementById('edit-branch-id').value = branch.id;
    document.getElementById('edit-branch-name').value = branch.name;
    document.getElementById('edit-branch-address').value = branch.address;
    document.getElementById('edit-branch-hours').value = branch.hours;
    
    document.getElementById('modal-edit-branch').classList.add('active');
  }

  function saveBranchEdit() {
    const id = parseInt(document.getElementById('edit-branch-id').value);
    const data = {
      name: document.getElementById('edit-branch-name').value,
      address: document.getElementById('edit-branch-address').value,
      hours: document.getElementById('edit-branch-hours').value
    };
    
    KursoData.updateBranch(id, data);
    document.getElementById('modal-edit-branch').classList.remove('active');
    showToast('Дані каси збережено');
    renderBranches();
  }

  // ── BOOKINGS ──
  function renderBookings() {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;
    
    const bookings = KursoData.getBookings();
    
    // Sort descending by id
    bookings.sort((a, b) => b.id - a.id);
    
    if (bookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px;">Бронювань немає</td></tr>`;
      return;
    }
    
    tbody.innerHTML = bookings.map(b => {
      let statusBadge = '';
      switch(b.status) {
        case 'pending': statusBadge = '<span class="status-pending">Очікує</span>'; break;
        case 'confirmed': statusBadge = '<span class="status-confirmed">Підтверджено</span>'; break;
        case 'completed': statusBadge = '<span class="status-completed">Виконано</span>'; break;
        case 'cancelled': statusBadge = '<span class="status-cancelled">Скасовано</span>'; break;
        case 'expired': statusBadge = '<span class="status-expired">Прострочено</span>'; break;
      }
      
      const dateStr = KursoUtils.formatDate(b.date + 'T00:00:00');
      
      return `
        <tr>
          <td style="font-weight:600;">${b.booking_number}</td>
          <td>${dateStr} <br><span class="text-muted">${b.time}</span></td>
          <td>${b.client_name} <br><span class="text-muted" style="font-size:11px;">${b.client_phone || b.client_telegram}</span></td>
          <td style="font-weight:600;">${KursoUtils.formatNumber(b.amount_from, 0)} ${b.currency_from} <br><span style="font-size:12px; font-weight:400;" class="text-muted">→ ${KursoUtils.formatNumber(b.amount_to, 0)} ${b.currency_to}</span></td>
          <td style="font-size:12px;">${b.branch_name}</td>
          <td>${statusBadge}</td>
          <td>
            <select class="form-select" style="min-height:32px; padding:4px 24px 4px 8px; font-size:12px;" onchange="KursoAdmin.updateBookingStatus(${b.id}, this.value)">
              <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Очікує</option>
              <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Підтверджено</option>
              <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Виконано</option>
              <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Скасовано</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateBookingStatus(id, status) {
    KursoData.updateBookingStatus(id, status);
    showToast('Статус бронювання оновлено');
    renderBookings();
  }

  // ── HELPERS ──
  function showToast(message) {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<span style="color:var(--status-open)">✓</span> ${message}`;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  return {
    init,
    saveRate,
    toggleRate,
    updateBranchStatus,
    toggleBranchBooking,
    editBranch,
    saveBranchEdit,
    updateBookingStatus
  };

})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  KursoAdmin.init();
});
