/* ============================================
   KURSO — Rates logic
   ============================================ */

const KursoRates = (() => {

  function init() {
    renderRatesTable();
    renderMobileCards();
    updateTimestamp();
  }

  function renderRatesTable() {
    const tbody = document.getElementById('rates-table-body');
    const crossTbody = document.getElementById('cross-rates-table-body');
    if (!tbody || !crossTbody) return;

    const rates = KursoData.getRates();
    const crossRates = KursoData.getCrossRates();

    // Update preview row values
    const usd = rates.find(r => r.code === 'USD');
    const eur = rates.find(r => r.code === 'EUR');
    const usdBuyEl = document.getElementById('preview-usd-buy');
    const usdSellEl = document.getElementById('preview-usd-sell');
    const eurBuyEl = document.getElementById('preview-eur-buy');
    const eurSellEl = document.getElementById('preview-eur-sell');
    if (usd) {
      if (usdBuyEl) usdBuyEl.textContent = KursoUtils.formatRate(usd.buy);
      if (usdSellEl) usdSellEl.textContent = KursoUtils.formatRate(usd.sell);
    }
    if (eur) {
      if (eurBuyEl) eurBuyEl.textContent = KursoUtils.formatRate(eur.buy);
      if (eurSellEl) eurSellEl.textContent = KursoUtils.formatRate(eur.sell);
    }

    // Render main rates
    tbody.innerHTML = rates.map((r, i) => `
      <tr class="${i >= 5 ? 'rates-hidden' : ''}">
        <td>
          <div class="rate-currency-cell">
            <div class="rate-currency-flag">${r.flag}</div>
            <div>
              <div class="rate-currency-name">${r.code}</div>
              <div class="rate-currency-full">${r.name}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="rate-value rate-buy">${KursoUtils.formatRate(r.buy)}</div>
        </td>
        <td>
          <div class="rate-value rate-sell">${KursoUtils.formatRate(r.sell)}</div>
        </td>
        <td>
          <button class="btn btn-outline rate-book-btn" onclick="KursoBooking.startWithCurrency('${r.code}', 'sell')">
            Забронювати
          </button>
        </td>
      </tr>
    `).join('');

    // Render cross rates (hidden by default)
    crossTbody.innerHTML = crossRates.map(r => `
      <tr class="rates-hidden">
        <td>
          <div class="rate-currency-cell">
            <div class="rate-currency-name">${r.pair}</div>
          </div>
        </td>
        <td>
          <div class="rate-value rate-buy">${KursoUtils.formatRate(r.buy)}</div>
        </td>
        <td>
          <div class="rate-value rate-sell">${KursoUtils.formatRate(r.sell)}</div>
        </td>
        <td></td>
      </tr>
    `).join('');
  }

  function renderMobileCards() {
    const container = document.getElementById('rates-mobile-container');
    if (!container) return;

    const rates = KursoData.getRates();

    container.innerHTML = rates.map((r, i) => `
      <div class="rate-card ${i >= 5 ? 'hidden-card' : ''}">
        <div class="rate-card-header">
          <div class="rate-card-currency">
            <span>${r.flag}</span>
            <span>${r.code}</span>
          </div>
          <div class="rate-currency-full">${r.name}</div>
        </div>
        <div class="rate-card-values">
          <div class="rate-card-col">
            <span class="rate-card-col-label">Купівля</span>
            <span class="rate-card-col-value rate-buy">${KursoUtils.formatRate(r.buy)}</span>
          </div>
          <div class="rate-card-col">
            <span class="rate-card-col-label">Продаж</span>
            <span class="rate-card-col-value rate-sell">${KursoUtils.formatRate(r.sell)}</span>
          </div>
        </div>
        <div class="rate-card-action">
          <button class="btn btn-outline btn-block" onclick="KursoBooking.startWithCurrency('${r.code}', 'sell')">
            Забронювати курс →
          </button>
        </div>
      </div>
    `).join('');
  }

  function toggleShowMore() {
    const btn = document.getElementById('rates-show-more-btn');
    if (!btn) return;

    const hiddenRows = document.querySelectorAll('.rates-hidden');
    const hiddenCards = document.querySelectorAll('.hidden-card');
    const fullTable = document.getElementById('rates-full-table');
    
    let isExpanded = btn.classList.contains('expanded');
    
    if (isExpanded) {
      hiddenRows.forEach(el => el.classList.remove('visible'));
      hiddenCards.forEach(el => el.classList.remove('visible'));
      if (fullTable) fullTable.style.display = 'none';
      btn.innerHTML = 'Переглянути всі курси &nbsp; &rarr;';
      btn.classList.remove('expanded');
      
      const crossRatesHeader = document.getElementById('cross-rates-header');
      if (crossRatesHeader) crossRatesHeader.style.display = 'none';
    } else {
      hiddenRows.forEach(el => el.classList.add('visible'));
      hiddenCards.forEach(el => el.classList.add('visible'));
      if (fullTable) fullTable.style.display = 'block';
      btn.innerHTML = 'Сховати &uarr;';
      btn.classList.add('expanded');
      
      const crossRatesHeader = document.getElementById('cross-rates-header');
      if (crossRatesHeader) crossRatesHeader.style.display = 'block';
    }
  }

  function updateTimestamp() {
    const tsStr = KursoData.getRatesUpdatedAt();
    const els = document.querySelectorAll('.rates-updated-time');
    
    if (tsStr && els.length > 0) {
      const d = new Date(tsStr);
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      els.forEach(el => el.textContent = `Оновлено о ${timeStr}`);
    }
  }

  return {
    init,
    toggleShowMore
  };

})();
