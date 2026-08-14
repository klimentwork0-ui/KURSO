/* ============================================
   KURSO — Chart logic
   Requires Chart.js to be loaded
   ============================================ */

const KursoChart = (() => {
  let chartInstance = null;
  let currentPair = 'USD/UAH';
  let currentPeriod = '1M';

  function init() {
    setupSelectors();
    
    // Defer chart creation slightly to ensure DOM and library are ready
    setTimeout(() => {
      if (typeof Chart !== 'undefined') {
        renderChart();
      } else {
        console.warn('Chart.js not loaded');
        const canvas = document.getElementById('kurso-chart');
        if (canvas) {
          canvas.parentElement.innerHTML = '<div class="branches-empty"><p>Не вдалося завантажити графік</p></div>';
        }
      }
    }, 100);
  }

  function setupSelectors() {
    // Populate pair selector
    const selectFrom = document.getElementById('chart-currency-from');
    const selectTo = document.getElementById('chart-currency-to');
    
    if (selectFrom && selectTo) {
      const rates = KursoData.getRates();
      
      selectFrom.innerHTML = '';
      selectTo.innerHTML = '';
      
      rates.forEach(r => {
        selectFrom.innerHTML += `<option value="${r.code}" ${r.code === 'USD' ? 'selected' : ''}>${r.code}</option>`;
        selectTo.innerHTML += `<option value="${r.code}" ${r.code === 'UAH' ? 'selected' : ''}>${r.code}</option>`;
      });
      
      selectFrom.innerHTML += `<option value="UAH">UAH</option>`;
      selectTo.innerHTML += `<option value="UAH" selected>UAH</option>`;
      
      // Events
      selectFrom.addEventListener('change', updatePair);
      selectTo.addEventListener('change', updatePair);
    }
  }

  function updatePair() {
    const from = document.getElementById('chart-currency-from').value;
    const to = document.getElementById('chart-currency-to').value;
    
    if (from === to) {
      // Avoid same currency
      if (from === 'UAH') {
        document.getElementById('chart-currency-to').value = 'USD';
      } else {
        document.getElementById('chart-currency-to').value = 'UAH';
      }
    }
    
    currentPair = `${document.getElementById('chart-currency-from').value}/${document.getElementById('chart-currency-to').value}`;
    renderChart();
  }

  function setPeriod(period, btn) {
    currentPeriod = period;
    
    // Update active button
    document.querySelectorAll('.chart-period-btn').forEach(el => el.classList.remove('active'));
    if (btn) {
      btn.classList.add('active');
    }
    
    renderChart();
  }

  function renderChart() {
    const canvas = document.getElementById('kurso-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    
    const [from, to] = currentPair.split('/');
    const data = KursoData.generateChartData(from, to, currentPeriod);
    
    const labels = data.map(d => {
      const date = new Date(d.date);
      if (currentPeriod === '1D') {
        return `${String(date.getHours()).padStart(2, '0')}:00`;
      }
      return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    
    const buyData = data.map(d => d.buy);
    const sellData = data.map(d => d.sell);
    
    const ctx = canvas.getContext('2d');
    
    // Destroy previous instance
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(201, 168, 76, 0.2)');
    gradient.addColorStop(1, 'rgba(201, 168, 76, 0.0)');
    
    const style = getComputedStyle(document.body);
    const gridColor = style.getPropertyValue('--border').trim() || '#232736';
    const textColor = style.getPropertyValue('--text-muted').trim() || '#7C8191';
    const accentColor = style.getPropertyValue('--accent').trim() || '#C9A84C';
    
    // Calculate min/max for Y axis
    const allValues = [...buyData, ...sellData];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Продаж',
            data: sellData,
            borderColor: '#E8E9ED',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderDash: [5, 5]
          },
          {
            label: 'Купівля',
            data: buyData,
            borderColor: accentColor,
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: accentColor
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(28, 31, 42, 0.95)',
            titleColor: '#E8E9ED',
            bodyColor: '#E8E9ED',
            borderColor: '#333749',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += KursoUtils.formatRate(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              maxTicksLimit: currentPeriod === '1D' ? 6 : 8,
              maxRotation: 0
            }
          },
          y: {
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              callback: function(value) {
                return KursoUtils.formatRate(value);
              }
            },
            min: min - padding,
            max: max + padding
          }
        }
      }
    });
    
    updateTimestamp();
  }

  function updateTimestamp() {
    const tsStr = KursoData.getRatesUpdatedAt();
    const el = document.getElementById('chart-updated-time');
    
    if (tsStr && el) {
      const d = new Date(tsStr);
      const timeStr = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      el.textContent = `Останнє оновлення: ${timeStr}`;
    }
  }

  return {
    init,
    setPeriod,
    renderChart
  };

})();
