/**
 * Azurita Play Landing Page Interactivity Script
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Navbar & Mobile Menu
  // ==========================================
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Simple toggle icon animation
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
  });

  // Close menu on click of nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });


  // ==========================================
  // 2. Interactive Cart Counter
  // ==========================================
  const cartBadge = document.getElementById('cart-count');
  let cartCount = 0;

  function addToCart() {
    cartCount++;
    cartBadge.textContent = cartCount;
    
    // Bounce animation
    cartBadge.style.transform = 'scale(1.4)';
    cartBadge.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    setTimeout(() => {
      cartBadge.style.transform = 'scale(1)';
    }, 150);
  }

  // Click on "Explore by Age" increments cart as a visual demo, or age links
  document.querySelectorAll('.age-link-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click bubble
      addToCart();
    });
  });


  // ==========================================
  // 3. Gamified Milestone Dashboard Data & Logic
  // ==========================================
  const milestoneData = {
    '0-3': {
      intro: 'Hitos clave de neurodesarrollo en la etapa de 0 a 3 meses:',
      strokeOffset: '270', // More offset = less path drawn
      activeNodes: ['node-0-3'],
      items: [
        { text: 'Sigue objetos en movimiento con la mirada y enfoca contrastes en blanco y negro.', checked: true },
        { text: 'Abre y cierra las manos, llevándoselas gradualmente a la boca.', checked: true },
        { text: 'Levanta la cabeza brevemente cuando está boca abajo (tummy time).', checked: false }
      ]
    },
    '3-6': {
      intro: 'Hitos clave de neurodesarrollo en la etapa de 3 a 6 meses:',
      strokeOffset: '140',
      activeNodes: ['node-0-3', 'node-3-6'],
      items: [
        { text: 'Estira los brazos para alcanzar y agarrar juguetes voluntariamente.', checked: true },
        { text: 'Pasa un juguete de una mano a la otra y lo explora con la boca.', checked: true },
        { text: 'Se rueda sobre su propio cuerpo de boca arriba a boca abajo.', checked: false },
        { text: 'Balbucea sonidos y responde vocalmente cuando se le habla.', checked: false }
      ]
    },
    '6-12': {
      intro: 'Hitos clave de neurodesarrollo en la etapa de 6 a 12 meses:',
      strokeOffset: '0', // Fully drawn path
      activeNodes: ['node-0-3', 'node-3-6', 'node-6-12'],
      items: [
        { text: 'Se sienta de manera independiente sin apoyo y empieza a gatear.', checked: true },
        { text: 'Entiende la permanencia de objetos (busca juguetes escondidos).', checked: true },
        { text: 'Usa el agarre de pinza (dedo índice y pulgar) para levantar piezas pequeñas.', checked: false },
        { text: 'Dice palabras sencillas como "mamá" o "papá" e imita gestos simples.', checked: false }
      ]
    }
  };

  const tabs = document.querySelectorAll('.toggle-tab');
  const checklistIntro = document.getElementById('checklist-intro-text');
  const checklistContainer = document.getElementById('checklist-items-container');
  const progressFill = document.getElementById('checklist-progress');
  const progressPercentLabel = document.getElementById('progress-percent-label');
  const svgProgressLine = document.getElementById('milestone-progress-line');
  const nodes = document.querySelectorAll('.milestone-node');

  // Load dashboard stage
  function updateDashboard(ageStage) {
    const data = milestoneData[ageStage];
    if (!data) return;

    // Update active tab buttons
    tabs.forEach(t => {
      const isActive = t.getAttribute('data-target') === ageStage;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update intro
    checklistIntro.textContent = data.intro;

    // Update progress path & node highlights
    if (svgProgressLine) {
      svgProgressLine.style.strokeDashoffset = data.strokeOffset;
    }

    nodes.forEach(node => {
      const isNodeActive = data.activeNodes.includes(node.id);
      node.classList.toggle('active', isNodeActive);
    });

    // Rebuild checklist items
    checklistContainer.innerHTML = '';
    data.items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'checklist-item';
      
      const label = document.createElement('label');
      label.className = 'custom-checkbox';
      
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = item.checked;
      input.addEventListener('change', calculateProgress);
      
      const checkmark = document.createElement('span');
      checkmark.className = 'checkmark';
      
      const textSpan = document.createElement('span');
      textSpan.className = 'item-text';
      textSpan.textContent = item.text;
      
      label.appendChild(input);
      label.appendChild(checkmark);
      label.appendChild(textSpan);
      li.appendChild(label);
      checklistContainer.appendChild(li);
    });

    calculateProgress();
  }

  // Calculate percentage of checked boxes in the preview checklist
  function calculateProgress() {
    const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    
    const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
    
    progressFill.style.width = `${percentage}%`;
    progressPercentLabel.textContent = `${percentage}% Completado`;
  }

  // Attach tab click events
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      updateDashboard(target);
    });
  });

  // Category card click behavior links straight to dashboard
  document.querySelectorAll('.age-card').forEach(card => {
    card.addEventListener('click', () => {
      const age = card.getAttribute('data-age');
      updateDashboard(age);
      
      // Scroll to dashboard section
      const dashboardSec = document.getElementById('dashboard-preview');
      if (dashboardSec) {
        dashboardSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial dashboard load
  updateDashboard('0-3');


  // ==========================================
  // 4. Social Proof Carousel Slider
  // ==========================================
  const slider = document.getElementById('reviews-slider');
  const dots = document.querySelectorAll('.dot');
  
  if (slider && dots.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        
        // Update active dot
        dots.forEach(d => d.classList.toggle('active', d === dot));
        
        // Translate grid container. Desktop width shifts left based on index
        // Each card takes roughly 33.3% of the row width, on tablet 100%
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
          slider.style.transform = `translateX(-${index * 3}%)`; // Small adjustment just for aesthetic nudge
        }
      });
    });
  }


  // ==========================================
  // 5. Waitlist Newsletter Form Validation
  // ==========================================
  const waitlistForm = document.getElementById('waitlist-form');
  const waitlistSuccess = document.getElementById('waitlist-success');
  const feedbackMsg = document.getElementById('form-feedback');
  const emailInput = document.getElementById('waitlist-email');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      feedbackMsg.textContent = '';
      feedbackMsg.className = 'form-feedback-message';

      if (!emailValue) {
        feedbackMsg.textContent = 'Por favor ingresa tu correo electrónico.';
        feedbackMsg.classList.add('error');
        return;
      }

      if (!emailRegex.test(emailValue)) {
        feedbackMsg.textContent = 'Ingresa una dirección de correo válida (ej: nombre@dominio.com).';
        feedbackMsg.classList.add('error');
        return;
      }

      // If valid, trigger success feedback animation
      waitlistForm.classList.add('hidden');
      waitlistSuccess.classList.remove('hidden');
      waitlistSuccess.style.animation = 'fadeIn 0.5s ease-out forwards';
    });
  }
});
