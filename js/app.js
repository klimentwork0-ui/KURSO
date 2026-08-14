/* ============================================
   KURSO — App Router & Main Logic
   ============================================ */

const KursoApp = (() => {

  function init() {
    setupNavigation();
    setupMobileMenu();
    
    // Initialize modules
    if (typeof KursoRates !== 'undefined') KursoRates.init();
    if (typeof KursoBooking !== 'undefined') KursoBooking.init();
    if (typeof KursoBranches !== 'undefined') KursoBranches.init();
    if (typeof KursoFAQ !== 'undefined') KursoFAQ.init();
    
    // Initial route check
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    
    // Scroll header listener
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });
  }

  function handleRoute() {
    let hash = window.location.hash.substring(1) || 'home';
    
    // Smooth scroll if hash is just for scrolling within home
    if (['booking', 'rates', 'chart', 'branches', 'about', 'faq', 'contacts'].includes(hash)) {
      navigate('home');
      setTimeout(() => {
        KursoUtils.scrollTo(hash);
      }, 100);
      return;
    }
    
    navigate(hash);
  }

  function navigate(route) {
    // Basic SPA routing (in this implementation, most things are on 'home' page)
    // We keep all sections visible, just update active nav links
    
    document.querySelectorAll('.nav-link').forEach(el => {
      if (el.getAttribute('href') === `#${route}`) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    
    document.querySelectorAll('.mobile-nav-link').forEach(el => {
      if (el.getAttribute('href') === `#${route}`) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    
    document.querySelectorAll('.bottom-nav-item').forEach(el => {
      if (el.getAttribute('href') === `#${route}`) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    
    // Lazy init chart when scrolling near it (simplified here to just init if missing)
    if (typeof KursoChart !== 'undefined') {
      KursoChart.init();
    }
  }

  function setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Let hashchange handle basic routing or scroll logic
        if (href.length > 1) {
          closeMobileMenu();
        }
      });
    });
  }

  function setupMobileMenu() {
    const burger = document.getElementById('burger-btn');
    const menu = document.getElementById('mobile-menu');
    const moreBtn = document.getElementById('bottom-nav-more');
    const moreMenu = document.getElementById('mobile-more-menu');
    
    if (burger && menu) {
      burger.addEventListener('click', () => {
        const isOpen = menu.classList.contains('open');
        if (isOpen) {
          closeMobileMenu();
        } else {
          burger.classList.add('active');
          menu.classList.add('open');
          menu.setAttribute('aria-hidden', 'false');
          burger.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    const closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn && menu) {
      closeBtn.addEventListener('click', closeMobileMenu);
    }
    
    if (moreBtn && moreMenu) {
      moreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = moreMenu.classList.contains('open');
        if (isOpen) {
          moreMenu.classList.remove('open');
        } else {
          moreMenu.classList.add('open');
        }
      });
      
      // Close more menu on click outside
      document.addEventListener('click', (e) => {
        if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
          moreMenu.classList.remove('open');
        }
      });
    }
  }

  function closeMobileMenu() {
    const burger = document.getElementById('burger-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (burger && menu) {
      burger.classList.remove('active');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  return {
    init,
    navigate,
    closeMobileMenu
  };

})();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (typeof KursoApp !== 'undefined') {
    KursoApp.init();
  }
});
