/* =========================================================
   Jacques. — Portfolio interactions & motion
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

  /* ---------- Preloader + hero entrance ---------- */
  const preloader = document.getElementById('preloader');
  const hero = document.querySelector('.hero');
  const unlock = () => {
    if (preloader) preloader.classList.add('hidden');
    if (hero) {
      requestAnimationFrame(() => hero.classList.add('is-ready'));
    }
  };
  window.addEventListener('load', () => {
    setTimeout(unlock, reduceMotion ? 0 : 650);
  });
  setTimeout(unlock, 3200);

  /* ---------- Navbar + back to top ---------- */
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

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Theme (text label, no icons) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  const syncThemeLabel = () => {
    if (!themeToggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? 'Clair' : 'Sombre';
  };
  syncThemeLabel();
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      syncThemeLabel();
    });
  }

  /* ---------- Scroll reveal (stagger) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const numSpan = el.querySelector('.num-value');
      if (!numSpan) return;
      if (reduceMotion) {
        numSpan.textContent = String(target);
        counterObserver.unobserve(el);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        numSpan.textContent = String(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(step);
        else numSpan.textContent = String(target);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.45 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove('open');
        const openAnswer = openItem.querySelector('.faq-answer');
        const openQ = openItem.querySelector('.faq-question');
        if (openAnswer) openAnswer.style.maxHeight = null;
        if (openQ) openQ.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Soft parallax on hero image ---------- */
  const parallaxEl = document.querySelector('[data-parallax] .hero-img');
  if (!reduceMotion && parallaxEl) {
    const onMove = throttleRAF((e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      parallaxEl.style.transform = `scale(1.04) translate(${x}px, ${y}px)`;
    });
    window.addEventListener('mousemove', onMove);
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && canHover) {
    document.querySelectorAll('.mag-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Project modal ---------- */
  const projectData = {
    juridiques: {
      title: 'SJJBenin — Plateforme juridique',
      tag: 'Plateforme full-stack',
      thumbClass: 'thumb-a',
      liveUrl: 'https://juridiques-project.vercel.app/',
      intro: 'SJJBenin connecte citoyens et professionnels du droit au Bénin : dossiers, annuaire, rendez-vous, chatbot et suivi. Projet déployé et accessible en ligne.',
      blocks: [
        { title: 'Fonctionnalités', list: ['Authentification sécurisée', 'Suivi de dossiers et documents', 'Annuaire des professionnels', 'Prise de rendez-vous', 'Chatbot d’assistance', 'Tableaux de bord'] },
        { title: 'Technologies', tags: ['React', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Vercel'] },
        { title: 'Statut', text: 'En ligne — https://juridiques-project.vercel.app/' }
      ]
    },
    portfolio: {
      title: 'Ce portfolio',
      tag: 'Site personnel',
      thumbClass: 'thumb-e',
      liveUrl: 'https://portfolio-jack-4640.vercel.app/',
      intro: 'Ma vitrine personnelle : parcours réel à Abomey-Calavi, compétences web, design et sciences politiques — sans discours de template.',
      blocks: [
        { title: 'Contenu', list: ['Présentation', 'Parcours', 'Projets', 'CV', 'Contact'] },
        { title: 'Technologies', tags: ['HTML5', 'CSS3', 'JavaScript'] }
      ]
    },
    soneb: {
      title: 'Allô SONEB',
      tag: 'Concept / démo',
      thumbClass: 'thumb-b',
      intro: 'Concept d’application pour signaler coupures d’eau et fuites auprès de la SONEB, et suivre une réclamation.',
      blocks: [
        { title: 'Objectifs', list: ['Signaler un incident', 'Géolocaliser', 'Suivre une réclamation'] },
        { title: 'Technologies envisagées', tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'] }
      ]
    },
    pawsy: {
      title: 'PawsyWorld',
      tag: 'Concept / démo e-commerce',
      thumbClass: 'thumb-c',
      intro: 'Boutique Shopify d’accessoires pour animaux — exercice de mise en place e-commerce et marketing digital.',
      blocks: [
        { title: 'Travail réalisé', list: ['Configuration boutique', 'Produits & collections', 'Personnalisation thème', 'Pistes marketing'] },
        { title: 'Outils', tags: ['Shopify', 'Canva', 'Marketing digital'] }
      ]
    },
    wordpress: {
      title: 'Sites WordPress',
      tag: 'Prestations',
      thumbClass: 'thumb-d',
      intro: 'Création de sites WordPress pour entreprises, associations et particuliers : installation, contenu, SEO de base et mise en ligne.',
      blocks: [
        { title: 'Prestations', list: ['Sites vitrines', 'Personnalisation de thèmes', 'Formulaires', 'Maintenance'] },
        { title: 'Technologies', tags: ['WordPress', 'HTML', 'CSS', 'PHP', 'MySQL'] }
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
    ).filter((el) => el.offsetParent !== null);
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
      a.textContent = 'Ouvrir le site en ligne';
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

  /* ---------- Contact success note ---------- */
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === '1') {
    const note = document.getElementById('formNote');
    if (note) {
      note.textContent = 'Merci ! Votre message est bien parti. Je vous réponds sous 48 h.';
      note.classList.add('form-note-success');
    }
  }
});
