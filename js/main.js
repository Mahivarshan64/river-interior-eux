document.addEventListener('DOMContentLoaded', () => {
  // 1. NAV SCROLL BEHAVIOR
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // 3. HEADLINE CLIP-UP REVEAL
  // Split lines and reveal
  const clipUpElements = document.querySelectorAll('.clip-up-text');
  clipUpElements.forEach((el) => {
    // We assume the HTML is already structured with .clip-up > span/div
    // so we just add the active class on load
    setTimeout(() => {
      el.classList.add('clip-up-active');
    }, 100);
  });

  // 4. SCROLL-TRIGGERED REVEALS (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // If it's a stats counter, trigger animation
        if (entry.target.classList.contains('stats-section') && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // 5. WORD-BY-WORD REVEAL
  const wordRevealElements = document.querySelectorAll('.word-reveal');
  wordRevealElements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    const words = text.split(' ');
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      
      const innerSpan = document.createElement('span');
      innerSpan.innerText = word;
      innerSpan.style.display = 'inline-block';
      innerSpan.style.transform = 'translateY(110%)';
      innerSpan.style.transition = `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;
      
      span.appendChild(innerSpan);
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    });

    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const innerSpans = entry.target.querySelectorAll('span > span');
          innerSpans.forEach(inner => {
            inner.style.transform = 'translateY(0)';
          });
          wordObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    wordObserver.observe(el);
  });

  // 6. STATS COUNTER (easeOutExpo)
  function easeOutExpo(t) { 
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); 
  }

  function animateCounters() {
    const counters = document.querySelectorAll('.counter-val');
    const duration = 2500;
    
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const hasPlus = counter.innerText.includes('+');
      const hasDecimal = target % 1 !== 0;
      
      let start = null;
      
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const currentProgress = Math.min(progress / duration, 1);
        const easedProgress = easeOutExpo(currentProgress);
        
        let currentVal = easedProgress * target;
        
        if (hasDecimal) {
          counter.innerText = currentVal.toFixed(1) + (hasPlus ? '+' : '');
        } else {
          counter.innerText = Math.floor(currentVal) + (hasPlus ? '+' : '');
        }
        
        if (progress < duration) {
          window.requestAnimationFrame(step);
        } else {
          counter.innerText = target + (hasPlus ? '+' : '');
        }
      }
      window.requestAnimationFrame(step);
    });
  }

  // 7. PARALLAX
  const parallaxImages = document.querySelectorAll('.parallax-img');
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    parallaxImages.forEach(img => {
      const parent = img.parentElement;
      const rect = parent.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const centerOffset = (rect.top + rect.height / 2) - (windowHeight / 2);
        const speed = 0.15; // 15% speed relative to center
        img.style.transform = `translateY(${centerOffset * speed}px)`;
      }
    });
  });

  // 8. PORTFOLIO FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active', 'text-copper', 'border-b', 'border-copper'));
      btn.classList.add('active', 'text-copper', 'border-b', 'border-copper');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 400); // Wait for transition
        }
      });
    });
  });
});
