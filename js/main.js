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
      document.body.classList.toggle('menu-open');
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
    threshold: 0.02
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

  // 9. PORTFOLIO LIGHTBOX MODAL DATA & CONTROLLER
  const projectsData = {
    1: {
      title: "3BHK Full Interior",
      tag: "Full Home",
      location: "Velachery · 2024",
      img: "assets/portfolio/living_velachery.png",
      description: "This Velachery duplex living and dining room uses custom warm grey fluted panels and brass trims to frame the entertainment zone. We utilized hidden compartments to house the client's high-fidelity audio equipment, creating a clean profile. Soft concealed lighting highlights the texture of the wall.",
      specs: [
        { label: "Property Type", val: "3BHK Duplex" },
        { label: "Area Built", val: "1,850 sq. ft." },
        { label: "Key Material", val: "MDF & Brass Inlays" },
        { label: "Timeline", val: "40 Working Days" }
      ]
    },
    2: {
      title: "L-Shape Kitchen",
      tag: "Modular Kitchen",
      location: "Adyar · 2024",
      img: "assets/portfolio/kitchen_adyar.png",
      description: "Designed for a family of four in Adyar, this kitchen blends glossy white acrylic top cabinets with textured oak base cabinets. It features a quartz stone countertop, a high-suction chimney, and built-in appliances to optimize efficiency. Corner spaces are fully utilized with custom-fitted storage carousels.",
      specs: [
        { label: "Kitchen Shape", val: "L-Shape" },
        { label: "Cabinet Finish", val: "Acrylic & Oak Veneer" },
        { label: "Countertop", val: "White Quartz" },
        { label: "Accessories", val: "Soft-close Tandem Boxes" }
      ]
    },
    3: {
      title: "Master Suite",
      tag: "Master Bedroom",
      location: "Anna Nagar · 2024",
      img: "assets/portfolio/bedroom_annanagar.png",
      description: "In this Anna Nagar master bedroom, comfort meets luxury. The main wall is treated with sound-dampening velvet panels bordered by slim brass strips. Suspended bedside glass globe pendants provide soft reading light. A custom oak wood wardrobe runs along the adjacent wall with tinted glass panels.",
      specs: [
        { label: "Room Size", val: "16' x 14'" },
        { label: "Accent Wall", val: "Velvet Panels & Brass" },
        { label: "Wardrobes", val: "Tinted Glass Custom" },
        { label: "Flooring", val: "Light Oak Wood" }
      ]
    },
    4: {
      title: "Cove Ceiling",
      tag: "False Ceiling",
      location: "Anna Nagar · 2023",
      img: "assets/portfolio/ceiling_annanagar.png",
      description: "This false ceiling project in Anna Nagar uses high-quality Saint-Gobain plasterboard. By creating a double recessed tray detail and using high-efficiency LED strip lights, we bounced soft light off the matte white surface, making the low ceiling feel airy and expansive.",
      specs: [
        { label: "Ceiling Type", val: "Double Recessed Tray" },
        { label: "Board Material", val: "Saint-Gobain Plasterboard" },
        { label: "Lighting", val: "Concealed LED Strip COB" },
        { label: "Area", val: "Living & Dining (420 sq. ft.)" }
      ]
    },
    5: {
      title: "Corporate Office",
      tag: "Commercial Space",
      location: "OMR · 2024",
      img: "assets/portfolio/office_omr.png",
      description: "Located in Chennai's OMR IT corridor, this tech office space accommodates a team of 40. We used open workstation designs with light oak wood desks, custom modular cabinets, and sound-absorbing fabric screens. Private cabins feature slim black metal frames with glass panels to maintain natural light flow.",
      specs: [
        { label: "Project Type", val: "IT Office Fit-Out" },
        { label: "Capacity", val: "40 Workstations" },
        { label: "Partitions", val: "Double-Glazed Slim Profile" },
        { label: "Acoustics", val: "Felt Ceiling Panels" }
      ]
    },
    6: {
      title: "Island Kitchen",
      tag: "Modular Kitchen",
      location: "T Nagar · 2024",
      img: "assets/portfolio/kitchen_tnagar.png",
      description: "A premium modular kitchen design in T Nagar. It features dark graphite gray cabinetry in anti-fingerprint matte laminate. The central island is clad in imported Italian marble and serves as a dining and food-prep hub. Handless drawers, automated pull-out spice racks, and a smart oven complete this modern setup.",
      specs: [
        { label: "Kitchen Shape", val: "Island Layout" },
        { label: "Island Cladding", val: "Italian Carrara Marble" },
        { label: "Cabinet Tech", val: "Blum Aventos Lift Ups" },
        { label: "Appliances", val: "Built-in Cooktop & Smart Oven" }
      ]
    },
    7: {
      title: "2BHK Interior",
      tag: "Living Room",
      location: "Tambaram · 2023",
      img: "assets/portfolio/living_tambaram.png",
      description: "This cozy 2BHK apartment in Tambaram showcases space optimization. We designed a light-toned oak TV wall console that floats off the floor to reveal floor space. Texture is introduced through a rattan armchair, soft linen drapes, and abundant indoor foliage to bring nature inside.",
      specs: [
        { label: "Home Type", val: "2BHK Residence" },
        { label: "Concept", val: "Warm Minimalist" },
        { label: "TV Unit", val: "Floating Light Oak Veneer" },
        { label: "Fittings", val: "Modular Soft Close" }
      ]
    },
    8: {
      title: "Cafe Fit-Out",
      tag: "Commercial Cafe",
      location: "T Nagar · 2023",
      img: "assets/portfolio/cafe_tnagar.png",
      description: "A charming boutique cafe in T Nagar. We combined raw concrete floors with warm teak wood panelling. The service counter is crafted from polished Terrazzo stone, and overhead warm pendant lighting creates a relaxed, inviting ambiance. Seating layout was maximized to provide both cozy corners and social high-stools.",
      specs: [
        { label: "Commercial Type", val: "Cafe / Bistro" },
        { label: "Counter Finish", val: "Custom Terrazzo Slab" },
        { label: "Wall Accents", val: "Fluted Teak Wood Panels" },
        { label: "Seating", val: "Industrial Oak & Steel" }
      ]
    },
    9: {
      title: "TV Wall + Ceiling",
      tag: "False Ceiling & TV Wall",
      location: "Porur · 2024",
      img: "assets/portfolio/ceiling_porur.png",
      description: "This integration in Porur features a dark stained oak panelled TV wall that wraps seamlessly onto the ceiling. Hidden LED light channels outline the geometry, providing soft indirect illumination that makes the entertainment room double as a home theater.",
      specs: [
        { label: "Integration", val: "Wrapped TV Panel to Ceiling" },
        { label: "Wood Type", val: "Stained Charcoal Oak" },
        { label: "Lighting System", val: "Integrated Profile Channels" },
        { label: "Automation", val: "Smart Dimmable Drivers" }
      ]
    },
    10: {
      title: "4BHK Villa Lobby",
      tag: "Duplex Villa",
      location: "Perungudi · 2023",
      img: "assets/portfolio/villa_perungudi.png",
      description: "This luxury villa interior project in Perungudi showcases a double-height entry lobby. We used warm vertical wood cladding, custom structural steel supports, and a grand brass chandelier. The layout balances open-plan grandeur with comfortable, private family zones.",
      specs: [
        { label: "Lobby Height", val: "22 Feet (Double Height)" },
        { label: "Main Material", val: "Teak Wood & Structural Steel" },
        { label: "Chandelier", val: "Brass & Smoked Glass" },
        { label: "Door Style", val: "Bespoke Pivot Timber Door" }
      ]
    },
    11: {
      title: "Restaurant Interior",
      tag: "Commercial Restaurant",
      location: "Nungambakkam · 2024",
      img: "assets/portfolio/restaurant_nungambakkam.png",
      description: "Designed for a premium restaurant in Nungambakkam. The layout features plush emerald green velvet booth seating for intimate dining, with warm low-light fixtures. A custom acoustic ceiling panel system absorbs ambient noise, maintaining a sophisticated, quiet atmosphere even during busy hours.",
      specs: [
        { label: "Dining Concept", val: "Premium Bistro Lounge" },
        { label: "Acoustics", val: "Micro-Perforated Gypsum Panels" },
        { label: "Seating Style", val: "Velvet Upholstered Booths" },
        { label: "Hardware", val: "Brushed Brass Finishes" }
      ]
    },
    12: {
      title: "Duplex Living",
      tag: "Villa Interior",
      location: "ECR · 2024",
      img: "assets/portfolio/living_ecr.png",
      description: "A luxurious beachfront villa in ECR Chennai. The double-height living room features a cantilevered teak wood staircase. A massive floor-to-ceiling glass wall looks out to a private tropical garden, flooding the space with light. Premium custom Italian sofas complete this high-end residential design.",
      specs: [
        { label: "Villa Type", val: "ECR Duplex Beach House" },
        { label: "Staircase", val: "Teak Wood with Glass Balustrades" },
        { label: "Glazing", val: "Double-Height Toughened Facade" },
        { label: "Lighting", val: "Modern Cascade Chandelier" }
      ]
    },
    13: {
      title: "Living Room Bookshelf",
      tag: "Living Room Custom Work",
      location: "Kilpauk · 2024",
      img: "assets/portfolio/living_kilpauk.png",
      description: "This custom design in Kilpauk provides an elegant solution for a book-loving client. We built a large modular library unit in light oak wood with asymmetric cubbies. Lower cabinets keep media cords and clutter hidden, while sheers allow soft daylight to highlight the collection.",
      specs: [
        { label: "Unit Style", val: "Modular Floor-to-Ceiling" },
        { label: "Material", val: "Eco-Friendly Engineered Oak Wood" },
        { label: "Layout", val: "Asymmetric Display & Closed Storage" },
        { label: "Overall Length", val: "14 Feet Wide" }
      ]
    },
    14: {
      title: "Parallel Kitchen",
      tag: "Modular Kitchen",
      location: "Velachery · 2024",
      img: "assets/portfolio/kitchen_velachery.png",
      description: "This parallel modular kitchen in Velachery features two long counters to maximize workspace. The forest green cabinetry creates a dramatic contrast with the polished Calacatta marble countertop and matching backsplash. Built-in LED strips under the top cabinets illuminate the prep zone.",
      specs: [
        { label: "Kitchen Shape", val: "Parallel Layout" },
        { label: "Cabinet Finish", val: "Matte Anti-Scratch Forest Green Acrylic" },
        { label: "Counter & Backsplash", val: "Calacatta Quartz Stone" },
        { label: "Hardware", val: "Satin Gold Handles & Pulls" }
      ]
    },
    15: {
      title: "Bedroom + Study",
      tag: "Residential Bedroom",
      location: "Medavakkam · 2023",
      img: "assets/portfolio/bedroom_medavakkam.png",
      description: "Located in Medavakkam, this bedroom features a custom-designed workspace. A floating white oak desk is built directly into the wardrobe unit, utilizing otherwise dead space. Overhead display shelves house books and decor, lit by a warm integrated task LED light.",
      specs: [
        { label: "Bed Style", val: "Queen Hydraulic Storage" },
        { label: "Desk Type", val: "Floating Custom Work Station" },
        { label: "Shelf Detail", val: "Integrated LED Under-Shelf" },
        { label: "Hardware", val: "Soft-Close Telescopic Slides" }
      ]
    },
    16: {
      title: "Guest Bedroom",
      tag: "Guest Bedroom",
      location: "Pallikaranai · 2024",
      img: "assets/portfolio/bedroom_pallikaranai.png",
      description: "A minimalist bedroom design in Pallikaranai. Focus was placed on clean lines and texture rather than expensive wall treatments. A custom fabric headboard is paired with light grey linens, and simple black fixtures add contrast, creating an open and restful room.",
      specs: [
        { label: "Bed Type", val: "Minimalist Platform Bed" },
        { label: "Headboard", val: "Custom Tufted Grey Linen Fabric" },
        { label: "Side Tables", val: "Floating Oak Drawers" },
        { label: "Theme", val: "Scandinavian Comfort" }
      ]
    },
    17: {
      title: "Lighting Detail",
      tag: "False Ceiling Detail",
      location: "Kodambakkam · 2023",
      img: "assets/portfolio/ceiling_kodambakkam.png",
      description: "This detailed false ceiling project in Kodambakkam features recessed black magnetic tracks that hold adjustable spotlights and floodlights flush with the ceiling surface. It is accented by a natural oak veneer border to frame the living room.",
      specs: [
        { label: "Gypsum Brand", val: "Saint-Gobain Gyproc" },
        { label: "Track System", val: "Black Magnetic 48V Recessed" },
        { label: "Fittings", val: "Linear Accent Flood & Spotlight Modules" },
        { label: "Accent Borders", val: "Matte Teak Wood Veneer Inset" }
      ]
    }
  };

  const modal = document.getElementById('portfolio-modal');
  const modalClose = document.getElementById('portfolio-modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTag = document.getElementById('modal-tag');
  const modalLocation = document.getElementById('modal-location');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalSpecsContainer = document.getElementById('modal-specs');

  if (modal && modalClose) {
    // Open Modal Function
    const openModal = (projectId) => {
      const data = projectsData[projectId];
      if (!data) return;

      // Populate elements
      modalImg.src = data.img;
      modalImg.alt = data.title + ", " + data.location;
      modalTag.innerText = data.tag;
      modalLocation.innerText = data.location;
      modalTitle.innerText = data.title;
      modalDesc.innerText = data.description;

      // Populate specs list
      modalSpecsContainer.innerHTML = '';
      data.specs.forEach(spec => {
        const specDiv = document.createElement('div');
        specDiv.className = 'portfolio-modal-spec';
        specDiv.innerHTML = `
          <span class="portfolio-modal-spec-label">${spec.label}</span>
          <span class="portfolio-modal-spec-val">${spec.val}</span>
        `;
        modalSpecsContainer.appendChild(specDiv);
      });

      // Show modal
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    // Close Modal Function
    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Clean src after transition to avoid flicker on next open
      setTimeout(() => {
        modalImg.src = '';
      }, 400);
    };

    // Add click listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = card.getAttribute('data-id');
        if (projectId) {
          openModal(projectId);
        }
      });
    });

    // Close modal on close button click
    modalClose.addEventListener('click', closeModal);

    // Close modal on clicking outside the container (on overlay)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal on Esc key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
});
