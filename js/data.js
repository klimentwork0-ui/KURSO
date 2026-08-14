/* ============================================
   KURSO — Data Layer (Mock API)
   All data here simulates backend API responses.
   Ready to be replaced with real fetch() calls.
   ============================================ */

const KursoData = (() => {

  // ──────────────────────────────────────
  // CURRENCIES & RATES
  // ──────────────────────────────────────
  const defaultRates = [
    { code: 'USD', name: 'Долар США',       flag: '🇺🇸', buy: 41.50, sell: 41.90, order: 1,  active: true },
    { code: 'EUR', name: 'Євро',            flag: '🇪🇺', buy: 45.20, sell: 45.70, order: 2,  active: true },
    { code: 'GBP', name: 'Фунт стерлінгів',flag: '🇬🇧', buy: 52.80, sell: 53.50, order: 3,  active: true },
    { code: 'CHF', name: 'Швейц. франк',   flag: '🇨🇭', buy: 47.10, sell: 47.70, order: 4,  active: true },
    { code: 'PLN', name: 'Польський злотий',flag: '🇵🇱', buy: 10.60, sell: 10.95, order: 5,  active: true },
    { code: 'CAD', name: 'Канад. долар',    flag: '🇨🇦', buy: 30.20, sell: 30.80, order: 6,  active: true },
    { code: 'TRY', name: 'Турецька ліра',   flag: '🇹🇷', buy: 1.12,  sell: 1.22,  order: 7,  active: true },
    { code: 'HUF', name: 'Угорськ. форинт', flag: '🇭🇺', buy: 0.112, sell: 0.118, order: 8,  active: true },
    { code: 'CNY', name: 'Китайськ. юань',  flag: '🇨🇳', buy: 5.70,  sell: 5.95,  order: 9,  active: true },
    { code: 'CZK', name: 'Чеська крона',    flag: '🇨🇿', buy: 1.78,  sell: 1.88,  order: 10, active: true },
    { code: 'AED', name: 'Дирхам ОАЕ',     flag: '🇦🇪', buy: 11.30, sell: 11.60, order: 11, active: true },
    { code: 'ILS', name: 'Ізраїльськ. шекель',flag:'🇮🇱', buy: 11.40, sell: 11.80, order: 12, active: true },
  ];

  const crossRates = [
    { pair: 'EUR/USD', buy: 1.089, sell: 1.092 },
    { pair: 'GBP/USD', buy: 1.272, sell: 1.278 },
    { pair: 'CHF/USD', buy: 1.135, sell: 1.140 },
    { pair: 'PLN/USD', buy: 0.255, sell: 0.262 },
  ];

  // ──────────────────────────────────────
  // 21 ACTIVE BRANCHES
  // ──────────────────────────────────────
  const defaultBranches = [
    { id: 1,  name: 'Каса №1 Берестейська',      address: 'м. Київ, пр-т Берестейський, 47',               lat: 50.4567, lng: 30.4632, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 2,  name: 'Каса №2 Подол',              address: 'м. Київ, вул. Григоровича-Барського, 1',        lat: 50.4651, lng: 30.5105, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 3,  name: 'Каса №3 Берестейська-2',     address: 'м. Київ, пр-т Берестейський, 47-А',             lat: 50.4570, lng: 30.4628, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 4,  name: 'Каса №4 Гонгадзе',           address: 'м. Київ, пр-т Георгія Гонгадзе, 20',           lat: 50.5105, lng: 30.4728, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 5,  name: 'Каса №5 Куренівка',           address: 'м. Київ, вул. Кирилівська, 166',               lat: 50.4878, lng: 30.4863, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 6,  name: 'Каса №6 Здановської',         address: 'м. Київ, вул. Юлії Здановської, 60/5',         lat: 50.4498, lng: 30.3793, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 7,  name: 'Каса №7 Глушкова',             address: 'м. Київ, пр-т Академіка Глушкова, 31-А',       lat: 50.3752, lng: 30.4748, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 8,  name: 'Каса №8 Кольцова',             address: 'м. Київ, б-р Кольцова, буд. 15',              lat: 50.5060, lng: 30.3975, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 9,  name: 'Каса №9 Щербаківського',       address: 'м. Київ, вул. Данила Щербаківського, 56/7',    lat: 50.4621, lng: 30.4344, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 10, name: 'Каса №10 Героїв Дніпра',       address: 'м. Київ, вул. Героїв Дніпра, 41-А',           lat: 50.5232, lng: 30.4658, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 11, name: 'Каса №11 Святошин',             address: 'м. Київ, вул. Святошинська, буд. 1',          lat: 50.4563, lng: 30.3617, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 12, name: 'Каса №12 Курбаса',              address: 'м. Київ, пр-т Леся Курбаса, буд. 6-В',       lat: 50.4455, lng: 30.3555, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 13, name: 'Каса №13 КПІ',                  address: 'м. Київ, пров. Політехнічний, 1/3',           lat: 50.4490, lng: 30.4550, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 14, name: 'Каса №14 Максимовича',           address: 'м. Київ, вул. Михайла Максимовича, 26',       lat: 50.3900, lng: 30.4871, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 15, name: 'Каса №15 Богданівська',          address: 'м. Київ, вул. Богданівська, 7-Г',             lat: 50.4380, lng: 30.4260, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 16, name: 'Каса №16 Гната Юри',             address: 'м. Київ, вул. Гната Юри, 6 літ. «Б»',        lat: 50.3969, lng: 30.4592, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 17, name: 'Каса №17 Вишгородська',          address: 'м. Київ, вул. Вишгородська, буд. 45',         lat: 50.4958, lng: 30.4723, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 18, name: 'Каса №18 Табірна',                address: 'м. Київ, вул. Табірна, 46/48-В',             lat: 50.4110, lng: 30.5280, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 19, name: 'Каса №19 Салютна',                address: 'м. Київ, вул. Салютна, буд. 2, н/п №09-229', lat: 50.4333, lng: 30.3617, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 20, name: 'Каса №20 Тираспольська',          address: 'м. Київ, вул. Тираспольська, буд. 54, прим. №743', lat: 50.4425, lng: 30.3670, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
    { id: 21, name: 'Каса №21 Вишгородська-2',         address: 'м. Київ, вул. Вишгородська, 44',             lat: 50.4960, lng: 30.4730, phone: '+380675042228', hours: 'Пн-Нд 09:00–19:30', status: 'open', booking_enabled: true },
  ];

  // ──────────────────────────────────────
  // FAQ
  // ──────────────────────────────────────
  const faqData = [
    {
      q: 'Чи можна зафіксувати курс?',
      a: 'Так. Після підтвердження бронювання курс фіксується на 60 хвилин.'
    },
    {
      q: 'Чи можна обміняти велику суму?',
      a: 'Для онлайн-бронювання KURSO максимальна сума становить до 400\u00A0000 грн в еквіваленті. Для операцій, що підпадають під вимоги фінансового моніторингу, застосовуються відповідні процедури згідно з чинним законодавством.'
    },
    {
      q: 'Чи можна розрахуватися карткою?',
      a: 'Ні. KURSO пропонує лише обмін готівкою.'
    },
    {
      q: 'Які документи потрібні?',
      a: 'Вимоги до документів визначаються чинним законодавством та залежать від суми та типу операції. Для уточнення зверніться до менеджера.'
    },
    {
      q: 'Скільки часу займає обмін?',
      a: 'Зазвичай обмін займає кілька хвилин, залежно від операції та каси.'
    },
    {
      q: 'Чи можна забронювати певний номінал?',
      a: 'За наявності такої можливості ви можете вказати побажання в бронюванні або зв\'язатися з менеджером.'
    },
    {
      q: 'Чи приймаєте старі/зношені купюри?',
      a: 'Умови приймання визначаються відповідно до актуальних вимог НБУ та внутрішніх процедур KURSO.'
    },
    {
      q: 'Чи безпечно здійснювати обмін?',
      a: 'KURSO — офіційний сервіс обміну валют. Всі операції проводяться відповідно до чинного законодавства.'
    },
  ];

  // ──────────────────────────────────────
  // CONFIG
  // ──────────────────────────────────────
  const config = {
    minAmount: 1000,         // Min amount in foreign currency
    maxAmountUAH: 400000,    // Max amount in UAH equivalent
    bookingDurationMin: 60,  // Booking fix duration in minutes
    minHoursBeforeVisit: 1,  // Min hours before visit
    managerPhone: '+380 67 504 22 28',
    managerTelegram: '@SabinaJI',
    telegramLink: 'https://t.me/SabinaJI',
    city: 'Київ',
    activeBranchesCount: 21,
    workingHoursStart: 9,    // 09:00
    workingHoursEnd: 19.5,   // 19:30
    slotIntervalMin: 30,     // Slot interval in minutes
  };

  // ──────────────────────────────────────
  // STORAGE HELPERS
  // ──────────────────────────────────────
  function getFromStorage(key, defaultValue) {
    try {
      const stored = localStorage.getItem(`kurso_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(`kurso_${key}`, JSON.stringify(value));
    } catch { /* silent */ }
  }

  // ──────────────────────────────────────
  // API SIMULATION
  // ──────────────────────────────────────

  // Initialize data on first load
  function initData() {
    if (!getFromStorage('rates', null)) {
      saveToStorage('rates', defaultRates);
    }
    if (!getFromStorage('branches', null)) {
      saveToStorage('branches', defaultBranches);
    }
    if (!getFromStorage('bookings', null)) {
      saveToStorage('bookings', []);
    }
    if (!getFromStorage('ratesUpdatedAt', null)) {
      saveToStorage('ratesUpdatedAt', new Date().toISOString());
    }
  }

  // GET /api/rates
  function getRates() {
    const rates = getFromStorage('rates', defaultRates);
    return rates.filter(r => r.active).sort((a, b) => a.order - b.order);
  }

  function getAllRates() {
    return getFromStorage('rates', defaultRates).sort((a, b) => a.order - b.order);
  }

  function getCrossRates() {
    return crossRates;
  }

  function getRatesUpdatedAt() {
    return getFromStorage('ratesUpdatedAt', new Date().toISOString());
  }

  // GET /api/branches
  function getBranches() {
    const branches = getFromStorage('branches', defaultBranches);
    return branches.filter(b => b.status !== 'closed');
  }

  function getAllBranches() {
    return getFromStorage('branches', defaultBranches);
  }

  // GET /api/branches/:id
  function getBranch(id) {
    const branches = getFromStorage('branches', defaultBranches);
    return branches.find(b => b.id === id) || null;
  }

  // GET /api/branches/:id/slots
  function getSlots(branchId, dateStr) {
    const branch = getBranch(branchId);
    if (!branch || branch.status !== 'open' || !branch.booking_enabled) return [];

    const now = new Date();
    const date = dateStr ? new Date(dateStr) : now;
    const isToday = date.toDateString() === now.toDateString();

    const slots = [];
    const startHour = config.workingHoursStart;
    const endHour = config.workingHoursEnd;
    const interval = config.slotIntervalMin;

    for (let h = startHour; h < endHour; h += interval / 60) {
      const hours = Math.floor(h);
      const minutes = (h - hours) * 60;
      const slotTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      let available = true;
      if (isToday) {
        const slotDate = new Date(date);
        slotDate.setHours(hours, minutes, 0, 0);
        const diffHours = (slotDate - now) / (1000 * 60 * 60);
        if (diffHours < config.minHoursBeforeVisit) {
          available = false;
        }
      }

      slots.push({ time: slotTime, available });
    }
    return slots;
  }

  // POST /api/bookings
  function createBooking(data) {
    const bookings = getFromStorage('bookings', []);
    const id = bookings.length + 1;
    const bookingNumber = `KURSO-${String(id).padStart(6, '0')}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + config.bookingDurationMin * 60 * 1000);

    const booking = {
      id,
      booking_number: bookingNumber,
      currency_from: data.currency_from,
      currency_to: data.currency_to,
      amount_from: data.amount_from,
      amount_to: data.amount_to,
      rate: data.rate,
      branch_id: data.branch_id,
      branch_name: data.branch_name,
      branch_address: data.branch_address,
      date: data.date,
      time: data.time,
      client_name: data.client_name,
      client_phone: data.client_phone || '',
      client_telegram: data.client_telegram || '',
      status: 'confirmed',
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    };

    bookings.push(booking);
    saveToStorage('bookings', bookings);
    return booking;
  }

  // GET /api/bookings
  function getBookings() {
    return getFromStorage('bookings', []);
  }

  // GET /api/bookings/:id
  function getBooking(id) {
    const bookings = getFromStorage('bookings', []);
    return bookings.find(b => b.id === id) || null;
  }

  // Update booking status
  function updateBookingStatus(id, status) {
    const bookings = getFromStorage('bookings', []);
    const idx = bookings.findIndex(b => b.id === id);
    if (idx > -1) {
      bookings[idx].status = status;
      saveToStorage('bookings', bookings);
      return bookings[idx];
    }
    return null;
  }

  // Admin: update rate
  function updateRate(code, buy, sell) {
    const rates = getFromStorage('rates', defaultRates);
    const idx = rates.findIndex(r => r.code === code);
    if (idx > -1) {
      rates[idx].buy = parseFloat(buy);
      rates[idx].sell = parseFloat(sell);
      saveToStorage('rates', rates);
      saveToStorage('ratesUpdatedAt', new Date().toISOString());
      return rates[idx];
    }
    return null;
  }

  // Admin: toggle rate active
  function toggleRateActive(code) {
    const rates = getFromStorage('rates', defaultRates);
    const idx = rates.findIndex(r => r.code === code);
    if (idx > -1) {
      rates[idx].active = !rates[idx].active;
      saveToStorage('rates', rates);
      return rates[idx];
    }
    return null;
  }

  // Admin: update branch
  function updateBranch(id, data) {
    const branches = getFromStorage('branches', defaultBranches);
    const idx = branches.findIndex(b => b.id === id);
    if (idx > -1) {
      Object.assign(branches[idx], data);
      saveToStorage('branches', branches);
      return branches[idx];
    }
    return null;
  }

  // Admin: update branch status
  function updateBranchStatus(id, status) {
    const branches = getFromStorage('branches', defaultBranches);
    const idx = branches.findIndex(b => b.id === id);
    if (idx > -1) {
      branches[idx].status = status;
      if (status === 'temporarily_closed' || status === 'closed') {
        branches[idx].booking_enabled = false;
      }
      saveToStorage('branches', branches);
      return branches[idx];
    }
    return null;
  }

  // ──────────────────────────────────────
  // CHART DATA GENERATION (mock)
  // ──────────────────────────────────────
  function generateChartData(currencyFrom, currencyTo, period) {
    const rates = getFromStorage('rates', defaultRates);
    let baseRate;

    if (currencyTo === 'UAH') {
      const r = rates.find(r2 => r2.code === currencyFrom);
      baseRate = r ? (r.buy + r.sell) / 2 : 41.7;
    } else if (currencyFrom === 'UAH') {
      const r = rates.find(r2 => r2.code === currencyTo);
      baseRate = r ? 1 / ((r.buy + r.sell) / 2) : 0.024;
    } else {
      baseRate = 1.0;
    }

    const points = [];
    let numPoints;
    const now = new Date();

    switch (period) {
      case '1D': numPoints = 24; break;
      case '1W': numPoints = 7; break;
      case '1M': numPoints = 30; break;
      case '3M': numPoints = 90; break;
      case '1Y': numPoints = 365; break;
      default: numPoints = 30;
    }

    for (let i = numPoints; i >= 0; i--) {
      const d = new Date(now);
      if (period === '1D') {
        d.setHours(d.getHours() - i);
      } else {
        d.setDate(d.getDate() - i);
      }

      // Random walk
      const variation = (Math.random() - 0.5) * baseRate * 0.02;
      baseRate += variation;
      const buyRate = baseRate - baseRate * 0.005;
      const sellRate = baseRate + baseRate * 0.005;

      points.push({
        date: d.toISOString(),
        buy: parseFloat(buyRate.toFixed(4)),
        sell: parseFloat(sellRate.toFixed(4)),
      });
    }

    return points;
  }

  // ──────────────────────────────────────
  // FAQ
  // ──────────────────────────────────────
  function getFAQ() {
    return faqData;
  }

  // ──────────────────────────────────────
  // CONFIG
  // ──────────────────────────────────────
  function getConfig() {
    return { ...config };
  }

  // Init on load
  initData();

  return {
    getRates,
    getAllRates,
    getCrossRates,
    getRatesUpdatedAt,
    getBranches,
    getAllBranches,
    getBranch,
    getSlots,
    createBooking,
    getBookings,
    getBooking,
    updateBookingStatus,
    updateRate,
    toggleRateActive,
    updateBranch,
    updateBranchStatus,
    generateChartData,
    getFAQ,
    getConfig,
    initData,
  };

})();
