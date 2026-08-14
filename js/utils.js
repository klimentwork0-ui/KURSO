/* ============================================
   KURSO — Utilities
   ============================================ */

const KursoUtils = (() => {

  // Format number with thousands separator (space)
  function formatNumber(num, decimals = 2) {
    if (num == null || isNaN(num)) return '0';
    const parts = parseFloat(num).toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (decimals === 0) return parts[0];
    return parts.join('.');
  }

  // Format rate (keep necessary decimals)
  function formatRate(rate) {
    if (rate >= 10) return parseFloat(rate).toFixed(2);
    if (rate >= 1) return parseFloat(rate).toFixed(3);
    return parseFloat(rate).toFixed(4);
  }

  // Format date for display
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Format time for display
  function formatTime(dateStr) {
    const d = new Date(dateStr);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  // Format date for input[type=date]
  function toDateInputValue(date) {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Check if today
  function isToday(dateStr) {
    const today = new Date();
    const d = new Date(dateStr);
    return d.toDateString() === today.toDateString();
  }

  // Get today as readable string
  function getTodayLabel() {
    return 'Сьогодні';
  }

  // Get tomorrow as readable string
  function getTomorrowDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }

  // Validate phone number (Ukrainian)
  function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+?380|0)\d{9}$/.test(cleaned);
  }

  // Validate Telegram username
  function isValidTelegram(tg) {
    return /^@?[a-zA-Z0-9_]{5,32}$/.test(tg.trim());
  }

  // Debounce function
  function debounce(fn, delay = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Generate Google Maps route URL
  function getRouteUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  // Scroll to element
  function scrollTo(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return {
    formatNumber,
    formatRate,
    formatDate,
    formatTime,
    toDateInputValue,
    isToday,
    getTodayLabel,
    getTomorrowDate,
    isValidPhone,
    isValidTelegram,
    debounce,
    getRouteUrl,
    scrollTo,
  };

})();
