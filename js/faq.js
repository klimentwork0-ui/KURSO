/* ============================================
   KURSO — FAQ logic
   ============================================ */

const KursoFAQ = (() => {

  function init() {
    renderFAQ();
  }

  function renderFAQ() {
    const container = document.getElementById('faq-list-container');
    if (!container) return;
    
    const faqs = KursoData.getFAQ();
    
    container.innerHTML = faqs.map((f, i) => `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}" id="faq-q-${i}" onclick="KursoFAQ.toggle(${i})">
          <span>${f.q}</span>
          <span class="faq-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </span>
        </button>
        <div class="faq-answer" id="faq-answer-${i}" aria-labelledby="faq-q-${i}">
          <div class="faq-answer-content">
            ${f.a}
          </div>
        </div>
      </div>
    `).join('');
  }

  function toggle(index) {
    const q = document.getElementById(`faq-q-${index}`);
    const a = document.getElementById(`faq-answer-${index}`);
    
    if (!q || !a) return;
    
    const isExpanded = q.getAttribute('aria-expanded') === 'true';
    
    // Close all others
    document.querySelectorAll('.faq-question').forEach(el => el.setAttribute('aria-expanded', 'false'));
    document.querySelectorAll('.faq-answer').forEach(el => el.classList.remove('open'));
    
    // Toggle current
    if (!isExpanded) {
      q.setAttribute('aria-expanded', 'true');
      a.classList.add('open');
    }
  }

  return {
    init,
    toggle
  };

})();
