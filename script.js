/* =========================================================
   PORTFOLIO - ABIKOU Jacques Moïse Agossou
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  const throttleRAF = (fn) => {
    let scheduled = false;
    let lastArgs = null;
    return (...args) => {
      lastArgs = args;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        fn(...lastArgs);
      });
    };
  };

  /* ---------- 1. PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
    }, reduceMotion ? 0 : 400);
  });

  /* ---------- 2. CUSTOM CURSOR ---------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (!reduceMotion && canHover && cursorDot && cursorOutline) {
    const moveCursor = throttleRAF((e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorOutline.animate(
        { left: e.clientX + 'px', top: e.clientY + 'px' },
        { duration: 400, fill: 'forwards' }
      );
    });
    window.addEventListener('mousemove', moveCursor);
    document.querySelectorAll('a, button, .service-card, .project-card, .info-card, .faq-question').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  } else {
    document.documentElement.classList.add('no-custom-cursor');
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
  }

  /* ---------- 3. BACK TO TOP + NAVBAR SCROLL ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = throttleRAF(() => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 4. MOBILE MENU ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 5. DARK MODE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const sunSvg = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-6.66 1.42-1.42M4.92 19.08l1.42-1.42M19.08 19.08l-1.42-1.42M4.92 4.92 6.34 6.34M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const moonSvg = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor"/></svg>';
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  const updateThemeIcon = () => {
    if (!themeToggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ? sunSvg : moonSvg;
  };
  updateThemeIcon();
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('portfolio-theme', isDark ? 'light' : 'dark');
      updateThemeIcon();
    });
  }

  /* ---------- 6. ROLE ROTATOR ---------- */
  const roles = [
    'Développeur Web',
    'Développeur WordPress',
    'Développeur Front-End',
    'Créateur de Sites Internet',
    'Politologue'
  ];
  const roleEl = document.getElementById('roleRotator');
  if (roleEl) {
    if (reduceMotion) {
      let roleIndex = 0;
      roleEl.textContent = roles[0];
      setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.textContent = roles[roleIndex];
      }, 3000);
    } else {
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
      typeRole();
    }
  }

  /* ---------- 7. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- 8. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const numSpan = el.querySelector('.num-value');
      if (!numSpan) return;
      if (reduceMotion) {
        numSpan.textContent = target;
        counterObserver.unobserve(el);
        return;
      }
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
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- 9. FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const openAnswer = openItem.querySelector('.faq-answer');
          const openQ = openItem.querySelector('.faq-question');
          if (openAnswer) openAnswer.style.maxHeight = null;
          if (openQ) openQ.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- 10. PARALLAX HERO SHAPES ---------- */
  const shapes = document.querySelectorAll('.hero-bg-shape');
  if (!reduceMotion && shapes.length) {
    const parallax = throttleRAF((e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      shapes.forEach((shape, i) => {
        const factor = i === 0 ? 1 : -1;
        shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
    window.addEventListener('mousemove', parallax);
  }

  /* ---------- 11. PROJECT MODAL ---------- */
  const projectData = {
    portfolio: {
      title: 'Portfolio Personnel',
      tag: 'Développement Web',
      thumbClass: 'thumb-e',
      liveUrl: 'https://portfolio-jack-4640.vercel.app',
      intro: "Ce portfolio est mon site web professionnel. Il présente mon parcours universitaire, mes compétences, mes expériences, mes certifications et mes réalisations. Son objectif est de mettre en valeur mon profil auprès des recruteurs, entreprises et clients.",
      blocks: [
        { title: 'Fonctionnalités', list: ['Présentation personnelle', 'Téléchargement du CV', 'Galerie de projets', 'Compétences', 'Expériences', 'Formulaire de contact', 'Responsive Design'] },
        { title: 'Technologies', tags: ['HTML5', 'CSS3', 'JavaScript'] },
        { title: 'Résultat', text: 'Un portfolio moderne, responsive et optimisé pour présenter efficacement mon profil professionnel.' }
      ]
    },
    juridiques: {
      title: 'SJJBenin — Plateforme Juridique',
      tag: 'Plateforme Full-Stack',
      thumbClass: 'thumb-a',
      liveUrl: 'https://juridiques-project.vercel.app/',
      intro: "SJJBenin est une plateforme digitale de services juridiques conçue pour le Bénin. Elle connecte citoyens et professionnels du droit (avocats, notaires, huissiers, magistrats) autour de la gestion de dossiers, de la prise de rendez-vous et d’outils d’assistance.",
      blocks: [
        { title: 'Fonctionnalités', list: ['Authentification sécurisée (JWT, MFA/TOTP, OAuth)', 'Création et suivi de cas juridiques avec documents', 'Annuaire des professionnels du droit par spécialité', 'Prise de rendez-vous', 'Chatbot d’assistance juridique', 'Suivi GPS des coursiers (Leaflet)', 'Tableaux de bord et notifications'] },
        { title: 'Technologies', tags: ['React', 'TypeScript', 'Vite', 'Express', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Leaflet', 'Vercel'] },
        { title: 'Résultat', text: 'Une application full-stack déployée sur Vercel, avec API serverless et base PostgreSQL, visant à moderniser l’accès aux services juridiques au Bénin.' }
      ]
    },
    soneb: {
      title: 'Allô SONEB',
      tag: 'Application Web',
      thumbClass: 'thumb-b',
      intro: "Allô SONEB est un projet d'application web imaginé pour améliorer la communication entre les citoyens et la Société Nationale des Eaux du Bénin (SONEB). L'objectif est de permettre aux usagers de signaler rapidement les coupures d'eau, les fuites ou d'autres incidents directement depuis leur téléphone.",
      blocks: [
        { title: 'Objectifs', list: ["Déclarer une coupure d'eau", 'Signaler une fuite', 'Géolocaliser les incidents', "Suivre l'état des réclamations", 'Améliorer la communication avec les usagers'] },
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
        { title: 'Mes réalisations', list: ['Création de la boutique', 'Configuration des produits', 'Personnalisation du thème', 'Optimisation des pages', 'Organisation des collections', "Mise en place d'une stratégie marketing"] },
        { title: 'Technologies', tags: ['Shopify', 'HTML', 'CSS', 'Canva', 'Marketing Digital'] },
        { title: 'Résultat', text: 'Une boutique moderne offrant une expérience utilisateur fluide et une présentation attractive des produits.' }
      ]
    },
    wordpress: {
      title: 'Création de sites WordPress',
      tag: 'WordPress',
      thumbClass: 'thumb-d',
      intro: "Je conçois des sites web professionnels avec WordPress, la plateforme de gestion de contenu la plus utilisée au monde. J'accompagne les entreprises, les associations, les entrepreneurs et les particuliers dans la création de sites modernes, rapides, sécurisés et entièrement adaptés à leurs besoins.",
      blocks: [
        { title: 'Mes prestations', list: ['Création de sites vitrines professionnels', 'Développement de sites institutionnels et associatifs', 'Installation et configuration de WordPress', 'Personnalisation de thèmes et de modèles', "Installation et configuration d'extensions (plugins)", 'Intégration et mise en forme de contenus', 'Création de formulaires de contact', 'Optimisation des performances et de la sécurité', 'Référencement naturel (SEO)', 'Maintenance, mises à jour et sauvegardes', 'Hébergement et mise en ligne du site'] },
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
  const modalCloseBtn = modal ? modal.querySelector('.project-modal-close') : null;
  let lastFocus = null;

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  function buildBlock(block) {
    const div = document.createElement('div');
    div.className = 'modal-block';
    const h5 = document.createElement('h5');
    h5.textContent = block.title;
    div.appendChild(h5);
    if (block.list) {
      const ul = document.createElement('ul');
      block.list.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    } else if (block.tags) {
      const wrap = document.createElement('div');
      wrap.className = 'modal-tech-tags';
      block.tags.forEach((t) => {
        const span = document.createElement('span');
        span.textContent = t;
        wrap.appendChild(span);
      });
      div.appendChild(wrap);
    } else if (block.text) {
      const p = document.createElement('p');
      p.textContent = block.text;
      div.appendChild(p);
    }
    return div;
  }

  function openProjectModal(key, trigger) {
    const data = projectData[key];
    if (!data || !modal) return;
    lastFocus = trigger || document.activeElement;
    modalThumb.className = 'project-modal-thumb ' + data.thumbClass;
    modalThumbTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalIntro.textContent = data.intro;
    modalSections.replaceChildren();
    data.blocks.forEach((block) => modalSections.appendChild(buildBlock(block)));
    if (data.liveUrl) {
      const live = document.createElement('p');
      live.className = 'modal-live';
      const a = document.createElement('a');
      a.href = data.liveUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Voir le site en ligne →';
      live.appendChild(a);
      modalSections.appendChild(live);
    }
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.querySelectorAll('[data-project]').forEach((btn) => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.project, btn));
  });
  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeProjectModal);
  });
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeProjectModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = getFocusable(modal);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- 12. CONTACT FORM SUCCESS NOTE ---------- */
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === '1') {
    const note = document.getElementById('formNote');
    if (note) {
      note.textContent = 'Merci ! Votre message a bien été envoyé. Je vous réponds sous 48 h.';
      note.classList.add('form-note-success');
    }
  }
});
