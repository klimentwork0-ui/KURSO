/* ============================================
   KURSO — Booking Flow
   ============================================ */

const KursoBooking = (() => {
  let currentStep = 1;
  let bookingData = {
    currencyFrom: 'USD',
    currencyTo: 'UAH',
    amountFrom: 10000,
    amountTo: 0,
    rate: 0,
    direction: 'sell', // user sells foreign currency
    branchId: null,
    branchName: '',
    branchAddress: '',
    date: '',
    time: '',
    clientName: '',
    clientContact: '',
  };
  let initialRate = null;

  function init() {
    setupStep1();
  }

  // ── STEP 1: Calculator ──
  function setupStep1() {
    const rates = KursoData.getRates();
    const config = KursoData.getConfig();

    // Populate currency selectors
    const fromSelect = document.getElementById('calc-from-currency');
    const toSelect = document.getElementById('calc-to-currency');
    if (!fromSelect || !toSelect) return;

    // "From" currencies: all active + UAH
    fromSelect.innerHTML = '';
    rates.forEach(r => {
      fromSelect.innerHTML += `<option value="${r.code}" ${r.code === bookingData.currencyFrom ? 'selected' : ''}>${r.flag} ${r.code}</option>`;
    });
    fromSelect.innerHTML += `<option value="UAH" ${bookingData.currencyFrom === 'UAH' ? 'selected' : ''}>🇺🇦 UAH</option>`;

    // "To" currencies: UAH + all active
    toSelect.innerHTML = `<option value="UAH" ${bookingData.currencyTo === 'UAH' ? 'selected' : ''}>🇺🇦 UAH</option>`;
    rates.forEach(r => {
      toSelect.innerHTML += `<option value="${r.code}" ${r.code === bookingData.currencyTo ? 'selected' : ''}>${r.flag} ${r.code}</option>`;
    });

    // Populate branch select if present in step 1
    const branchSelect = document.getElementById('calc-branch-select');
    if (branchSelect) {
      const branches = KursoData.getBranches();
      branchSelect.innerHTML = branches.map(b => {
        const shortName = b.name.replace(/^Каса №\d+\s+/, '');
        return `<option value="${b.id}" ${bookingData.branchId === b.id ? 'selected' : ''}>${shortName}</option>`;
      }).join('');

      if (!bookingData.branchId && branches.length > 0) {
        // default to branch #16 (Гната Юри, 20) or first
        const defaultBranch = branches.find(b => b.name.includes('Гната Юри')) || branches[0];
        bookingData.branchId = defaultBranch.id;
        bookingData.branchName = defaultBranch.name;
        bookingData.branchAddress = defaultBranch.address;
        branchSelect.value = String(defaultBranch.id);
      }

      branchSelect.addEventListener('change', (e) => {
        const id = parseInt(e.target.value);
        const b = KursoData.getBranch(id);
        if (b) {
          bookingData.branchId = b.id;
          bookingData.branchName = b.name;
          bookingData.branchAddress = b.address;
        }
      });
    }

    // Populate time select if present in step 1
    const timeSelect = document.getElementById('calc-time-select');
    if (timeSelect) {
      timeSelect.innerHTML = `
        <option value="Сьогодні, 18:00">Сьогодні, 18:00</option>
        <option value="Сьогодні, 18:30">Сьогодні, 18:30</option>
        <option value="Сьогодні, 19:00">Сьогодні, 19:00</option>
        <option value="Завтра, 10:00">Завтра, 10:00</option>
        <option value="Завтра, 12:00">Завтра, 12:00</option>
        <option value="Завтра, 14:00">Завтра, 14:00</option>
        <option value="Завтра, 16:00">Завтра, 16:00</option>
      `;
      bookingData.date = KursoUtils.toDateInputValue(new Date());
      bookingData.time = '18:00';

      timeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val.includes('Сьогодні')) {
          bookingData.date = KursoUtils.toDateInputValue(new Date());
          bookingData.time = val.replace('Сьогодні, ', '').trim();
        } else {
          bookingData.date = KursoUtils.toDateInputValue(KursoUtils.getTomorrowDate());
          bookingData.time = val.replace('Завтра, ', '').trim();
        }
      });
    }

    // Set initial amount
    const amountInput = document.getElementById('calc-from-amount');
    if (amountInput) amountInput.value = KursoUtils.formatNumber(bookingData.amountFrom, 0);

    // Calculate
    calculateRate();

    // Event listeners
    amountInput?.addEventListener('input', onAmountInput);
    fromSelect?.addEventListener('change', onCurrencyChange);
    toSelect?.addEventListener('change', onCurrencyChange);

    // Swap button
    document.getElementById('calc-swap')?.addEventListener('click', swapCurrencies);

    // Continue button
    document.getElementById('booking-continue')?.addEventListener('click', goToStep2);

    // Show limit info
    const limitEl = document.getElementById('calc-limit-info');
    if (limitEl) {
      limitEl.textContent = `Мін: ${KursoUtils.formatNumber(config.minAmount, 0)} у валюті · Макс: до ${KursoUtils.formatNumber(config.maxAmountUAH, 0)} грн в еквіваленті`;
    }
  }

  function onAmountInput(e) {
    const raw = e.target.value.replace(/\s/g, '').replace(/,/g, '.');
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 0) {
      bookingData.amountFrom = num;
      calculateRate();
    }
  }

  function onCurrencyChange() {
    bookingData.currencyFrom = document.getElementById('calc-from-currency').value;
    bookingData.currencyTo = document.getElementById('calc-to-currency').value;

    // Prevent same currency
    if (bookingData.currencyFrom === bookingData.currencyTo) {
      if (bookingData.currencyFrom === 'UAH') {
        bookingData.currencyTo = 'USD';
        document.getElementById('calc-to-currency').value = 'USD';
      } else {
        bookingData.currencyTo = 'UAH';
        document.getElementById('calc-to-currency').value = 'UAH';
      }
    }

    calculateRate();
  }

  function swapCurrencies() {
    const temp = bookingData.currencyFrom;
    bookingData.currencyFrom = bookingData.currencyTo;
    bookingData.currencyTo = temp;

    document.getElementById('calc-from-currency').value = bookingData.currencyFrom;
    document.getElementById('calc-to-currency').value = bookingData.currencyTo;

    // Also swap amounts
    const tempAmt = bookingData.amountFrom;
    bookingData.amountFrom = bookingData.amountTo;
    bookingData.amountTo = tempAmt;

    const amountInput = document.getElementById('calc-from-amount');
    if (amountInput) amountInput.value = KursoUtils.formatNumber(bookingData.amountFrom, 0);

    calculateRate();
  }

  function calculateRate() {
    const rates = KursoData.getRates();
    let rate = 0;
    let toAmount = 0;

    if (bookingData.currencyFrom === 'UAH') {
      // User gives UAH, gets foreign
      const r = rates.find(r2 => r2.code === bookingData.currencyTo);
      if (r) {
        rate = r.sell; // buying foreign costs more
        toAmount = bookingData.amountFrom / rate;
      }
    } else if (bookingData.currencyTo === 'UAH') {
      // User gives foreign, gets UAH
      const r = rates.find(r2 => r2.code === bookingData.currencyFrom);
      if (r) {
        rate = r.buy; // exchange buys at lower rate
        toAmount = bookingData.amountFrom * rate;
      }
    } else {
      // Cross: foreign to foreign via UAH
      const rFrom = rates.find(r2 => r2.code === bookingData.currencyFrom);
      const rTo = rates.find(r2 => r2.code === bookingData.currencyTo);
      if (rFrom && rTo) {
        const uahAmount = bookingData.amountFrom * rFrom.buy;
        toAmount = uahAmount / rTo.sell;
        rate = toAmount / bookingData.amountFrom;
      }
    }

    bookingData.amountTo = toAmount;
    bookingData.rate = rate;

    if (!initialRate) initialRate = rate;

    // Update UI
    const toAmountEl = document.getElementById('calc-to-amount');
    if (toAmountEl) toAmountEl.value = KursoUtils.formatNumber(toAmount, toAmount > 100 ? 0 : 2);

    const rateDisplay = document.getElementById('calc-rate-display');
    if (rateDisplay) {
      if (bookingData.currencyFrom === 'UAH') {
        rateDisplay.innerHTML = `1 ${bookingData.currencyTo} = <strong>${KursoUtils.formatRate(rate)}</strong> UAH`;
      } else if (bookingData.currencyTo === 'UAH') {
        rateDisplay.innerHTML = `1 ${bookingData.currencyFrom} = <strong>${KursoUtils.formatRate(rate)}</strong> UAH`;
      } else {
        rateDisplay.innerHTML = `1 ${bookingData.currencyFrom} = <strong>${KursoUtils.formatRate(rate)}</strong> ${bookingData.currencyTo}`;
      }
    }

    validateStep1();
  }

  function validateStep1() {
    const config = KursoData.getConfig();
    const continueBtn = document.getElementById('booking-continue');
    const errorEl = document.getElementById('calc-error');
    let error = '';

    // Determine UAH equivalent
    let uahEquivalent;
    if (bookingData.currencyTo === 'UAH') {
      uahEquivalent = bookingData.amountTo;
    } else if (bookingData.currencyFrom === 'UAH') {
      uahEquivalent = bookingData.amountFrom;
    } else {
      const rates = KursoData.getRates();
      const r = rates.find(r2 => r2.code === bookingData.currencyFrom);
      uahEquivalent = r ? bookingData.amountFrom * r.buy : 0;
    }

    if (bookingData.amountFrom <= 0) {
      error = 'Введіть коректну суму';
    } else if (bookingData.currencyFrom !== 'UAH' && bookingData.amountFrom < config.minAmount) {
      error = `Мінімальна сума: ${KursoUtils.formatNumber(config.minAmount, 0)} ${bookingData.currencyFrom}`;
    } else if (uahEquivalent > config.maxAmountUAH) {
      error = `Максимальна сума: до ${KursoUtils.formatNumber(config.maxAmountUAH, 0)} грн в еквіваленті`;
    }

    if (errorEl) {
      errorEl.textContent = error;
      errorEl.classList.toggle('visible', !!error);
    }

    if (continueBtn) {
      continueBtn.disabled = !!error;
    }

    return !error;
  }

  // ── STEP 2: Branch + Date/Time ──
  function goToStep2() {
    if (!validateStep1()) return;
    setStep(2);
    renderBranches();
  }

  function renderBranches() {
    const branches = KursoData.getBranches();
    const list = document.getElementById('booking-branch-list');
    if (!list) return;

    list.innerHTML = branches.map(b => `
      <div class="branch-item" data-branch-id="${b.id}" onclick="KursoBooking.selectBranch(${b.id})">
        <div class="branch-item-info">
          <div class="branch-item-name">${b.name}</div>
          <div class="branch-item-address">${b.address}</div>
          <div class="branch-item-hours">🕐 ${b.hours}</div>
        </div>
        <div class="branch-item-status">
          <span class="badge ${b.status === 'open' ? 'badge-open' : 'badge-closed'}">
            ${b.status === 'open' ? 'Відчинено' : 'Зачинено'}
          </span>
        </div>
      </div>
    `).join('');
  }

  function selectBranch(branchId) {
    const branch = KursoData.getBranch(branchId);
    if (!branch) return;

    bookingData.branchId = branch.id;
    bookingData.branchName = branch.name;
    bookingData.branchAddress = branch.address;

    // Highlight selected
    document.querySelectorAll('.branch-item').forEach(el => {
      el.classList.toggle('selected', parseInt(el.dataset.branchId) === branchId);
    });

    // Show datetime section
    renderDateTime();
  }

  function renderDateTime() {
    const section = document.getElementById('booking-datetime');
    if (section) section.style.display = 'block';

    const today = new Date();
    const tomorrow = KursoUtils.getTomorrowDate();

    // Set today as default
    bookingData.date = KursoUtils.toDateInputValue(today);

    // Date options
    const dateContainer = document.getElementById('booking-dates');
    if (dateContainer) {
      dateContainer.innerHTML = `
        <button type="button" class="date-option selected" data-date="${KursoUtils.toDateInputValue(today)}" onclick="KursoBooking.selectDate(this)">
          Сьогодні
        </button>
        <button type="button" class="date-option" data-date="${KursoUtils.toDateInputValue(tomorrow)}" onclick="KursoBooking.selectDate(this)">
          ${KursoUtils.formatDate(tomorrow.toISOString())}
        </button>
        <input type="date" class="form-input date-option" id="booking-date-custom"
          min="${KursoUtils.toDateInputValue(today)}"
          onchange="KursoBooking.selectCustomDate(this)"
          style="max-width:160px; padding:10px 12px; font-size:0.875rem;">
      `;
    }

    renderTimeSlots();
  }

  function selectDate(btn) {
    bookingData.date = btn.dataset.date;
    bookingData.time = '';
    document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
    btn.classList.add('selected');
    renderTimeSlots();
  }

  function selectCustomDate(input) {
    bookingData.date = input.value;
    bookingData.time = '';
    document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
    input.classList.add('selected');
    renderTimeSlots();
  }

  function renderTimeSlots() {
    const slots = KursoData.getSlots(bookingData.branchId, bookingData.date);
    const container = document.getElementById('booking-time-slots');
    if (!container) return;

    container.innerHTML = slots.map(s => `
      <button type="button" class="time-slot ${!s.available ? 'disabled' : ''} ${bookingData.time === s.time ? 'selected' : ''}"
        ${!s.available ? 'disabled' : ''}
        onclick="KursoBooking.selectTime('${s.time}', this)">
        ${s.time}
      </button>
    `).join('');

    // Step 2 continue button
    const nextBtn = document.getElementById('booking-step2-next');
    if (nextBtn) nextBtn.style.display = 'block';
  }

  function selectTime(time, btn) {
    bookingData.time = time;
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    btn.classList.add('selected');
  }

  function goToStep3() {
    if (!bookingData.branchId) {
      showFieldError('booking-branch-error', 'Оберіть касу');
      return;
    }
    if (!bookingData.time) {
      showFieldError('booking-time-error', 'Оберіть доступний час');
      return;
    }
    setStep(3);
  }

  // ── STEP 3: Contact ──
  function goToStep4() {
    const nameInput = document.getElementById('booking-name');
    const contactInput = document.getElementById('booking-contact');
    let valid = true;

    bookingData.clientName = nameInput?.value?.trim() || '';
    bookingData.clientContact = contactInput?.value?.trim() || '';

    // Validate name
    if (!bookingData.clientName) {
      showFieldError('booking-name-error', 'Введіть ваше ім\'я');
      nameInput?.classList.add('error');
      valid = false;
    } else {
      hideFieldError('booking-name-error');
      nameInput?.classList.remove('error');
    }

    // Validate contact (phone or telegram)
    if (!bookingData.clientContact) {
      showFieldError('booking-contact-error', 'Введіть телефон або Telegram');
      contactInput?.classList.add('error');
      valid = false;
    } else {
      const isPhone = KursoUtils.isValidPhone(bookingData.clientContact);
      const isTelegram = KursoUtils.isValidTelegram(bookingData.clientContact);
      if (!isPhone && !isTelegram) {
        showFieldError('booking-contact-error', 'Введіть коректний номер телефону або Telegram username');
        contactInput?.classList.add('error');
        valid = false;
      } else {
        hideFieldError('booking-contact-error');
        contactInput?.classList.remove('error');
      }
    }

    if (!valid) return;

    // Check if rate changed
    checkRateChanged();

    setStep(4);
    renderSummary();
  }

  function checkRateChanged() {
    if (!initialRate) return;
    const currentRate = bookingData.rate;
    const diff = Math.abs(currentRate - initialRate) / initialRate;
    if (diff > 0.001) {
      const warning = document.getElementById('rate-warning');
      if (warning) warning.classList.add('visible');
    }
  }

  function refreshRate() {
    calculateRate();
    initialRate = bookingData.rate;
    const warning = document.getElementById('rate-warning');
    if (warning) warning.classList.remove('visible');
    renderSummary();
  }

  // ── STEP 4: Summary & Confirm ──
  function renderSummary() {
    const branch = KursoData.getBranch(bookingData.branchId);

    document.getElementById('summary-amount').textContent =
      `${KursoUtils.formatNumber(bookingData.amountFrom, 0)} ${bookingData.currencyFrom} → ${KursoUtils.formatNumber(bookingData.amountTo, bookingData.amountTo > 100 ? 0 : 2)} ${bookingData.currencyTo}`;
    document.getElementById('summary-rate').textContent = KursoUtils.formatRate(bookingData.rate);
    document.getElementById('summary-branch').textContent = bookingData.branchName;
    document.getElementById('summary-address').textContent = bookingData.branchAddress;
    document.getElementById('summary-date').textContent = KursoUtils.formatDate(bookingData.date + 'T00:00:00');
    document.getElementById('summary-time').textContent = bookingData.time;
    document.getElementById('summary-contact').textContent = bookingData.clientContact;
  }

  function submitBooking() {
    const consent = document.getElementById('booking-consent');
    if (consent && !consent.checked) {
      showFieldError('booking-consent-error', 'Необхідна згода з політикою обробки даних');
      return;
    }

    // Determine phone/telegram
    const isPhone = KursoUtils.isValidPhone(bookingData.clientContact);

    const booking = KursoData.createBooking({
      currency_from: bookingData.currencyFrom,
      currency_to: bookingData.currencyTo,
      amount_from: bookingData.amountFrom,
      amount_to: bookingData.amountTo,
      rate: bookingData.rate,
      branch_id: bookingData.branchId,
      branch_name: bookingData.branchName,
      branch_address: bookingData.branchAddress,
      date: bookingData.date,
      time: bookingData.time,
      client_name: bookingData.clientName,
      client_phone: isPhone ? bookingData.clientContact : '',
      client_telegram: !isPhone ? bookingData.clientContact : '',
    });

    renderSuccess(booking);
  }

  function renderSuccess(booking) {
    const successEl = document.getElementById('booking-success');
    const stepsEl = document.getElementById('booking-steps');
    const progressEl = document.querySelector('.booking-progress');

    if (stepsEl) stepsEl.style.display = 'none';
    if (progressEl) progressEl.style.display = 'none';
    if (successEl) {
      successEl.style.display = 'block';
      successEl.innerHTML = `
        <div class="booking-success">
          <div class="success-icon">✓</div>
          <h3>Курс заброньовано</h3>
          <div class="booking-id">№ бронювання: <strong>${booking.booking_number}</strong></div>
          <div class="success-details">
            <div class="summary-amount" style="margin-bottom:16px;">
              ${KursoUtils.formatNumber(booking.amount_from, 0)} ${booking.currency_from} → ${KursoUtils.formatNumber(booking.amount_to, booking.amount_to > 100 ? 0 : 2)} ${booking.currency_to}
            </div>
            <div class="booking-summary">
              <div class="summary-row">
                <span class="summary-label">Курс</span>
                <span class="summary-value">${KursoUtils.formatRate(booking.rate)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Каса</span>
                <span class="summary-value">${booking.branch_name}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Адреса</span>
                <span class="summary-value">${booking.branch_address}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Дата</span>
                <span class="summary-value">${KursoUtils.formatDate(booking.date + 'T00:00:00')}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Час</span>
                <span class="summary-value">${booking.time}</span>
              </div>
            </div>
          </div>
          <div class="success-message">
            ⏱ Курс зафіксовано на 60 хвилин
          </div>
          <div class="success-actions">
            <a href="${KursoData.getConfig().telegramLink}" target="_blank" class="btn btn-primary">
              Написати в Telegram
            </a>
            <button class="btn btn-secondary" onclick="KursoBooking.resetBooking()">
              На головну
            </button>
          </div>
        </div>
      `;
    }
  }

  function resetBooking() {
    currentStep = 1;
    bookingData = {
      currencyFrom: 'USD',
      currencyTo: 'UAH',
      amountFrom: 10000,
      amountTo: 0,
      rate: 0,
      direction: 'sell',
      branchId: null,
      branchName: '',
      branchAddress: '',
      date: '',
      time: '',
      clientName: '',
      clientContact: '',
    };
    initialRate = null;

    const successEl = document.getElementById('booking-success');
    const stepsEl = document.getElementById('booking-steps');
    const progressEl = document.querySelector('.booking-progress');

    if (successEl) successEl.style.display = 'none';
    if (stepsEl) stepsEl.style.display = 'block';
    if (progressEl) progressEl.style.display = 'flex';

    setStep(1);
    setupStep1();

    // Navigate to home
    if (typeof KursoApp !== 'undefined') KursoApp.navigate('home');
  }

  // ── Navigation ──
  function setStep(step) {
    currentStep = step;
    document.querySelectorAll('.booking-step').forEach((el, i) => {
      el.classList.toggle('active', i + 1 === step);
    });

    // Update progress dots
    document.querySelectorAll('.booking-step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === step);
      dot.classList.toggle('completed', i + 1 < step);
    });
    document.querySelectorAll('.booking-step-line').forEach((line, i) => {
      line.classList.toggle('completed', i + 1 < step);
    });
  }

  function goBack() {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  }

  // ── Pre-fill from rates table ──
  function startWithCurrency(code, direction) {
    if (direction === 'buy') {
      bookingData.currencyFrom = 'UAH';
      bookingData.currencyTo = code;
    } else {
      bookingData.currencyFrom = code;
      bookingData.currencyTo = 'UAH';
    }
    bookingData.amountFrom = 10000;
    initialRate = null;

    // Navigate to booking
    if (typeof KursoApp !== 'undefined') KursoApp.navigate('home');
    setTimeout(() => {
      KursoUtils.scrollTo('booking');
      setupStep1();
    }, 100);
  }

  // ── Helpers ──
  function showFieldError(id, message) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = message;
      el.classList.add('visible');
    }
  }

  function hideFieldError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('visible');
  }

  return {
    init,
    selectBranch,
    selectDate,
    selectCustomDate,
    selectTime,
    goToStep2,
    goToStep3,
    goToStep4,
    goBack,
    submitBooking,
    refreshRate,
    resetBooking,
    startWithCurrency,
    calculateRate,
    setupStep1,
  };

})();
