/* =========================================================
   PORTFOLIO PREMIUM — ABIKOU Jacques Moïse Agossou
   JavaScript pur — toutes les interactions du site
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  });

  /* ---------- 2. CUSTOM CURSOR ---------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorOutline.animate(
        { left: e.clientX + 'px', top: e.clientY + 'px' },
        { duration: 400, fill: 'forwards' }
      );
    });
    document.querySelectorAll('a, button, .service-card, .project-card, .info-card, .faq-question').forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  }

  /* ---------- 3. NAVBAR SCROLL EFFECT ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- 4. MOBILE MENU ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 5. DARK MODE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  const updateThemeIcon = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark
      ? '<svg class="icon" viewBox="0 0 24 24"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-6.66 1.42-1.42M4.92 19.08l1.42-1.42M19.08 19.08l-1.42-1.42M4.92 4.92 6.34 6.34M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      : '<svg class="icon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
  };
  updateThemeIcon();
  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('portfolio-theme', isDark ? 'light' : 'dark');
    updateThemeIcon();
  });

  /* ---------- 6. ROLE ROTATOR (typewriter) ---------- */
  const roles = [
    'Développeur Web',
    'Développeur WordPress',
    'Développeur Front-End',
    'Créateur de Sites Internet',
    'Politologue'
  ];
  const roleEl = document.getElementById('roleRotator');
  let roleIndex = 0, charIndex = 0, deleting = false;
  function typeRole() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeRole, 1400);
        return;
      }
    } else {
      charIndex--;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeRole, deleting ? 40 : 70);
  }
  if (roleEl) typeRole();

  /* ---------- 7. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 8. ANIMATED PROGRESS BARS ---------- */
  const progressBars = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.value || 0;
        entry.target.style.width = target + '%';
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  progressBars.forEach(bar => progressObserver.observe(bar));

  /* ---------- 9. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const numSpan = el.querySelector('.num-value');
        const duration = 1600;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          numSpan.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else numSpan.textContent = target;
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- 10. FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- 11. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 12. PARALLAX HERO SHAPES ---------- */
  const shapes = document.querySelectorAll('.hero-bg-shape');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    shapes.forEach((shape, i) => {
      const factor = i === 0 ? 1 : -1;
      shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  /* ---------- 12b. PROJECT MODAL ---------- */
  const projectData = {
    portfolio: {
      title: 'Portfolio Personnel',
      tag: 'Développement Web',
      thumbClass: 'thumb-e',
      intro: "Ce portfolio est mon site web professionnel. Il présente mon parcours universitaire, mes compétences, mes expériences, mes certifications et mes réalisations. Son objectif est de mettre en valeur mon profil auprès des recruteurs, entreprises et clients.",
      blocks: [
        { title: 'Fonctionnalités', list: ['Présentation personnelle', 'Téléchargement du CV', 'Galerie de projets', 'Compétences', 'Expériences', 'Formulaire de contact', 'Responsive Design'] },
        { title: 'Technologies', tags: ['HTML5', 'CSS3', 'JavaScript'] },
        { title: 'Résultat', text: 'Un portfolio moderne, responsive et optimisé pour présenter efficacement mon profil professionnel.' }
      ]
    },
    aeroscope: {
      title: 'AeroScope Africa',
      tag: 'Développement Web',
      thumbClass: 'thumb-a',
      intro: "Description détaillée à venir prochainement — ce projet sera complété dès que les informations seront disponibles.",
      blocks: []
    },
    soneb: {
      title: 'Allô SONEB',
      tag: 'Application Web',
      thumbClass: 'thumb-b',
      intro: "Allô SONEB est un projet d'application web imaginé pour améliorer la communication entre les citoyens et la Société Nationale des Eaux du Bénin (SONEB). L'objectif est de permettre aux usagers de signaler rapidement les coupures d'eau, les fuites ou d'autres incidents directement depuis leur téléphone.",
      blocks: [
        { title: 'Objectifs', list: ['Déclarer une coupure d\'eau', 'Signaler une fuite', 'Géolocaliser les incidents', 'Suivre l\'état des réclamations', 'Améliorer la communication avec les usagers'] },
        { title: 'Technologies', tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'] },
        { title: 'Résultat attendu', text: 'Une meilleure réactivité dans le traitement des incidents et une communication plus fluide entre la SONEB et les populations.' }
      ]
    },
    pawsy: {
      title: 'PawsyWorld',
      tag: 'E-commerce / Shopify',
      thumbClass: 'thumb-c',
      intro: "PawsyWorld est une boutique en ligne développée avec Shopify et spécialisée dans la vente d'accessoires pour chiens et chats. Ce projet m'a permis d'approfondir mes compétences en e-commerce, marketing digital et gestion de boutique en ligne.",
      blocks: [
        { title: 'Mes réalisations', list: ['Création de la boutique', 'Configuration des produits', 'Personnalisation du thème', 'Optimisation des pages', 'Organisation des collections', 'Mise en place d\'une stratégie marketing'] },
        { title: 'Technologies', tags: ['Shopify', 'HTML', 'CSS', 'Canva', 'Marketing Digital'] },
        { title: 'Résultat', text: 'Une boutique moderne offrant une expérience utilisateur fluide et une présentation attractive des produits.' }
      ]
    },
    wordpress: {
      title: 'Création de sites WordPress',
      tag: 'WordPress',
      thumbClass: 'thumb-d',
      intro: "Je conçois des sites web professionnels avec WordPress, la plateforme de gestion de contenu la plus utilisée au monde. J'accompagne les entreprises, les associations, les entrepreneurs et les particuliers dans la création de sites modernes, rapides, sécurisés et entièrement adaptés à leurs besoins. Chaque projet est développé avec une attention particulière portée au design, à l'expérience utilisateur, à la performance et au référencement naturel (SEO).",
      blocks: [
        { title: 'Mes prestations', list: ['Création de sites vitrines professionnels', 'Développement de sites institutionnels et associatifs', 'Installation et configuration de WordPress', 'Personnalisation de thèmes et de modèles', 'Installation et configuration d\'extensions (plugins)', 'Intégration et mise en forme de contenus', 'Création de formulaires de contact', 'Optimisation des performances et de la sécurité', 'Référencement naturel (SEO)', 'Maintenance, mises à jour et sauvegardes', 'Hébergement et mise en ligne du site'] },
        { title: 'Technologies', tags: ['WordPress', 'HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Elementor', 'WooCommerce', 'Git & GitHub'] },
        { title: 'Résultat', text: 'Des sites web modernes, responsives, sécurisés et faciles à administrer, offrant une expérience utilisateur optimale sur ordinateur, tablette et smartphone.' }
      ]
    }
  };

  const modal = document.getElementById('projectModal');
  const modalThumb = document.getElementById('modalThumb');
  const modalThumbTitle = document.getElementById('modalThumbTitle');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalIntro = document.getElementById('modalIntro');
  const modalSections = document.getElementById('modalSections');

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;
    modalThumb.className = 'project-modal-thumb ' + data.thumbClass;
    modalThumbTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalIntro.textContent = data.intro;
    modalSections.innerHTML = '';
    data.blocks.forEach(block => {
      const div = document.createElement('div');
      div.className = 'modal-block';
      let inner = `<h5>${block.title}</h5>`;
      if (block.list) {
        inner += '<ul>' + block.list.map(item => `<li>${item}</li>`).join('') + '</ul>';
      } else if (block.tags) {
        inner += '<div class="modal-tech-tags">' + block.tags.map(t => `<span>${t}</span>`).join('') + '</div>';
      } else if (block.text) {
        inner += `<p>${block.text}</p>`;
      }
      div.innerHTML = inner;
      modalSections.appendChild(div);
    });
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeProjectModal() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-project]').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.project));
  });
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeProjectModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

  /* ---------- 13. CONTACT FORM (démo statique) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.getElementById('formNote');
      note.textContent = "Merci — ceci est un modèle de démonstration. Connectez le formulaire à un service d'envoi (Formspree, Netlify Forms...) pour recevoir de vrais messages.";
      note.style.color = '#D4A537';
    });
  }

});
