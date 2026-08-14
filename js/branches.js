/* ============================================
   KURSO — Branches logic
   Requires Leaflet.js to be loaded
   ============================================ */

const KursoBranches = (() => {
  let map = null;
  let markers = [];
  let currentFilter = 'all';
  let currentSearch = '';
  let activeBranchId = null;

  function init() {
    renderList();
    setupEvents();
    
    // Defer map initialization to ensure DOM is ready and visible
    setTimeout(() => {
      initMap();
    }, 100);
  }

  function setupEvents() {
    // Search
    const searchInput = document.getElementById('branches-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', KursoUtils.debounce((e) => {
        currentSearch = e.target.value.toLowerCase();
        renderList();
        updateMarkers();
      }, 300));
    }
  }

  function setFilter(filter, btn) {
    currentFilter = filter;
    
    document.querySelectorAll('.branch-filter-btn').forEach(el => el.classList.remove('active'));
    if (btn) {
      btn.classList.add('active');
    }
    
    renderList();
    updateMarkers();
  }

  function toggleView(view, btn) {
    document.querySelectorAll('.view-toggle-btn').forEach(el => el.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    const layout = document.getElementById('branches-layout');
    const listContainer = document.querySelector('.branches-list-container');
    const mapContainer = document.querySelector('.branches-map-container');
    
    if (!layout || !listContainer || !mapContainer) return;
    
    if (window.innerWidth < 768) {
      // Mobile logic
      if (view === 'map') {
        listContainer.style.display = 'none';
        mapContainer.classList.add('visible');
        // Need to invalidate size when map becomes visible
        if (map) {
          setTimeout(() => map.invalidateSize(), 50);
        }
      } else {
        listContainer.style.display = 'flex';
        mapContainer.classList.remove('visible');
      }
    } else {
      // Desktop logic
      if (view === 'list') {
        layout.classList.add('map-hidden');
        mapContainer.style.display = 'none';
      } else {
        layout.classList.remove('map-hidden');
        mapContainer.style.display = 'block';
        if (map) {
          setTimeout(() => map.invalidateSize(), 50);
        }
      }
    }
  }

  function toggleMobileMap() {
    const btn = document.getElementById('mobile-map-toggle-btn');
    const isMap = btn.dataset.view === 'map';
    
    if (isMap) {
      btn.dataset.view = 'list';
      btn.innerHTML = 'Показати список';
      toggleView('map');
    } else {
      btn.dataset.view = 'map';
      btn.innerHTML = 'Показати карту';
      toggleView('list');
    }
  }

  function getFilteredBranches() {
    let branches = KursoData.getBranches(); // already excludes 'closed' status
    
    // Apply status filter
    if (currentFilter === 'open') {
      branches = branches.filter(b => b.status === 'open');
    }
    
    // Apply search filter
    if (currentSearch) {
      branches = branches.filter(b => 
        b.name.toLowerCase().includes(currentSearch) || 
        b.address.toLowerCase().includes(currentSearch)
      );
    }
    
    return branches;
  }

  function renderList() {
    const container = document.getElementById('branches-list');
    const countEl = document.getElementById('branches-count');
    if (!container) return;
    
    const branches = getFilteredBranches();
    
    if (countEl) {
      countEl.innerHTML = `Знайдено: <strong>${branches.length}</strong> кас`;
    }
    
    if (branches.length === 0) {
      container.innerHTML = `
        <div class="branches-empty">
          <div class="branches-empty-icon">🔍</div>
          <p>За вашим запитом кас не знайдено</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = branches.map(b => `
      <div class="branch-card ${b.id === activeBranchId ? 'active' : ''}" id="branch-card-${b.id}" onclick="KursoBranches.selectBranch(${b.id})">
        <div class="branch-card-top">
          <div>
            <div class="branch-card-name">${b.name}</div>
            <div class="branch-card-address">${b.address}</div>
            <div class="branch-card-hours">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${b.hours}
            </div>
          </div>
          <div>
            <span class="badge ${b.status === 'open' ? 'badge-open' : 'badge-closed'}">
              ${b.status === 'open' ? 'Відчинено' : 'Зачинено'}
            </span>
          </div>
        </div>
        ${b.id === activeBranchId ? `
          <div class="branch-card-actions animate-fade-in">
            <button class="btn btn-primary" onclick="event.stopPropagation(); KursoBranches.bookBranch(${b.id})">
              Забронювати
            </button>
            <a href="${KursoUtils.getRouteUrl(b.lat, b.lng)}" target="_blank" class="btn btn-secondary" onclick="event.stopPropagation();">
              Маршрут
            </a>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  function initMap() {
    const mapEl = document.getElementById('branches-map');
    if (!mapEl || typeof L === 'undefined') return;
    
    // Check if already initialized
    if (map) return;
    
    // Kyiv center
    map = L.map('branches-map').setView([50.45, 30.52], 11);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    }).addTo(map);
    
    updateMarkers();
  }

  function updateMarkers() {
    if (!map) return;
    
    // Clear existing markers
    markers.forEach(m => map.removeLayer(m.marker));
    markers = [];
    
    const branches = getFilteredBranches();
    
    // Custom icon
    const style = getComputedStyle(document.body);
    const accentColor = style.getPropertyValue('--accent').trim() || '#C9A84C';
    
    const svgIcon = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${accentColor}" stroke="#151820" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#151820"></circle>
      </svg>
    `);
    
    const customIcon = L.icon({
      iconUrl: `data:image/svg+xml;charset=utf-8,${svgIcon}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    
    const activeSvgIcon = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#E8E9ED" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="${accentColor}"></circle>
      </svg>
    `);
    
    const activeIcon = L.icon({
      iconUrl: `data:image/svg+xml;charset=utf-8,${activeSvgIcon}`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
    
    const bounds = L.latLngBounds();
    
    branches.forEach(b => {
      const marker = L.marker([b.lat, b.lng], {
        icon: b.id === activeBranchId ? activeIcon : customIcon
      });
      
      const popupContent = `
        <div class="map-popup-name">${b.name}</div>
        <div class="map-popup-address">${b.address}</div>
        <a href="#" class="map-popup-btn" onclick="event.preventDefault(); KursoBranches.bookBranch(${b.id})">Забронювати</a>
      `;
      
      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        selectBranch(b.id, true);
      });
      
      marker.addTo(map);
      bounds.extend([b.lat, b.lng]);
      
      markers.push({ id: b.id, marker });
      
      if (b.id === activeBranchId) {
        marker.openPopup();
      }
    });
    
    // Adjust map view to fit all markers if no active branch and there are markers
    if (!activeBranchId && branches.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  function selectBranch(id, fromMap = false) {
    activeBranchId = id;
    renderList();
    
    if (map) {
      updateMarkers(); // Update icons
      const branch = KursoData.getBranch(id);
      if (branch) {
        map.setView([branch.lat, branch.lng], 14, { animate: true });
        
        // Find and open popup
        const markerObj = markers.find(m => m.id === id);
        if (markerObj) {
          markerObj.marker.openPopup();
        }
      }
    }
    
    // Scroll list to active item if not clicked from map
    if (!fromMap) {
      const card = document.getElementById(`branch-card-${id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function bookBranch(id) {
    // Navigate to booking tab
    if (typeof KursoApp !== 'undefined') KursoApp.navigate('home');
    
    setTimeout(() => {
      KursoUtils.scrollTo('booking');
      KursoBooking.setupStep1();
      
      // Simulate completing step 1 if valid, then select branch in step 2
      if (document.getElementById('booking-continue') && !document.getElementById('booking-continue').disabled) {
        KursoBooking.goToStep2();
        setTimeout(() => {
          KursoBooking.selectBranch(id);
        }, 100);
      }
    }, 100);
  }

  return {
    init,
    setFilter,
    toggleView,
    toggleMobileMap,
    selectBranch,
    bookBranch
  };

})();
