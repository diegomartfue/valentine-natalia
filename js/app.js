(function () {
  'use strict';

  var data = window.ANNIVERSARY_DATA;
  if (!data) return;

  var STORAGE_KEY = 'anniversary_discovered';
  var CAMERA_SVG = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>';

  /* ── DOM refs ── */
  var modal = document.getElementById('modal');
  var modalCard = document.getElementById('modalCard');
  var modalBody = document.getElementById('modalBody');
  var modalClose = document.getElementById('modalClose');
  var modalBackdrop = document.getElementById('modalBackdrop');

  /* ── Init ── */
  function init() {
    populateWelcome();
    renderGallery();
    renderReasons();
    setupLetter();
    setupMusic();
    setupNavigation();
    setupScrollReveal();
    createParticles();
    setupModalClose();
  }

  /* ── Welcome ── */
  function populateWelcome() {
    var w = data.welcome;
    setText('welcomeDate', w.dateLabel);
    setText('welcomeTitle', w.title);
    setText('welcomeSubtitle', w.subtitle);
    setText('startBtn', w.buttonText);

    document.getElementById('startBtn').addEventListener('click', function () {
      document.getElementById('recuerdos').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── Particles ── */
  function createParticles() {
    var container = document.getElementById('particles');
    var count = 18;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = 6 + Math.random() * 20;
      var opacity = 0.15 + Math.random() * 0.25;
      var drift = (Math.random() - 0.5) * 60;
      var duration = 14 + Math.random() * 16;
      var delay = Math.random() * duration;
      var hue = 340 + Math.random() * 30;

      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-' + size + 'px';
      p.style.background = 'radial-gradient(circle, hsla(' + hue + ',40%,75%,' + opacity + '), transparent 70%)';
      p.style.setProperty('--p-opacity', String(opacity));
      p.style.setProperty('--p-drift', drift + 'px');
      p.style.animation = 'particleFloat ' + duration + 's linear ' + delay + 's infinite';
      container.appendChild(p);
    }
  }

  /* ── Gallery ── */
  function renderGallery() {
    var gallery = document.getElementById('gallery');
    data.memories.forEach(function (mem) {
      var hasImage = mem.image && mem.image.trim() !== '';
      var el = document.createElement('div');
      el.className = 'polaroid reveal';

      var photoStyle = hasImage ? ' style="background-image:url(\'' + escapeHtml(mem.image) + '\')"' : '';
      var photoInner = hasImage
        ? ''
        : '<div class="polaroid__placeholder">' + CAMERA_SVG + '<span>Foto ' + mem.id + '</span></div>';

      el.innerHTML =
        '<div class="polaroid__tape"></div>' +
        '<div class="polaroid__photo"' + photoStyle + '>' + photoInner + '</div>' +
        '<div class="polaroid__caption">' +
          '<p class="polaroid__date">' + escapeHtml(mem.date) + '</p>' +
          '<p class="polaroid__title">' + escapeHtml(mem.title) + '</p>' +
        '</div>';

      el.addEventListener('click', function () { openMemoryModal(mem); });
      gallery.appendChild(el);
    });
  }

  function openMemoryModal(mem) {
    var hasImage = mem.image && mem.image.trim() !== '';
    var photoStyle = hasImage ? ' style="background-image:url(\'' + escapeHtml(mem.image) + '\')"' : '';
    var photoInner = hasImage
      ? ''
      : '<div class="memory-detail__placeholder">' + CAMERA_SVG + '<span>Foto ' + mem.id + '</span></div>';

    var html =
      '<div class="memory-detail__photo"' + photoStyle + '>' + photoInner + '</div>' +
      '<div class="memory-detail__info">' +
        '<span class="memory-detail__date">' + escapeHtml(mem.date) + '</span>' +
        '<h3 class="memory-detail__title">' + escapeHtml(mem.title) + '</h3>' +
        '<p class="memory-detail__description">' + escapeHtml(mem.description) + '</p>' +
      '</div>';

    modalCard.className = 'modal__card modal__card--flush';
    openModal(html);
  }

  /* ── Reasons ── */
  function renderReasons() {
    var container = document.getElementById('reasonsContainer');
    var discovered = getDiscovered();
    var currentCategory = '';
    var currentGrid = null;

    data.reasons.forEach(function (reason) {
      if (reason.category !== currentCategory) {
        currentCategory = reason.category;

        var group = document.createElement('div');
        group.className = 'reasons-group';

        var title = document.createElement('h3');
        title.className = 'reasons-group__title reveal';
        title.textContent = currentCategory;
        group.appendChild(title);

        currentGrid = document.createElement('div');
        currentGrid.className = 'notes-grid';
        group.appendChild(currentGrid);
        container.appendChild(group);
      }

      var isOpen = discovered.indexOf(reason.id) !== -1;
      var note = document.createElement('div');
      note.className = 'note reveal' + (isOpen ? ' note--opened' : '');
      note.setAttribute('data-reason-id', reason.id);

      note.innerHTML =
        '<span class="note__number">' + reason.id + '</span>' +
        '<span class="note__label">' + (isOpen ? '&#10003; Descubierta' : 'Toca para descubrir') + '</span>';

      note.addEventListener('click', function () { openReason(reason); });
      currentGrid.appendChild(note);
    });

    updateCounter();

    document.getElementById('surpriseBtn').addEventListener('click', surpriseReason);
  }

  function openReason(reason) {
    markDiscovered(reason.id);

    var html =
      '<div class="reason-reveal">' +
        '<span class="reason-reveal__number">' + reason.id + '</span>' +
        '<p class="reason-reveal__text">' + escapeHtml(reason.text) + '</p>' +
        '<span class="reason-reveal__category">' + escapeHtml(reason.category) + '</span>' +
      '</div>';

    modalCard.className = 'modal__card';
    openModal(html);
  }

  function surpriseReason() {
    var discovered = getDiscovered();
    var undiscovered = data.reasons.filter(function (r) {
      return discovered.indexOf(r.id) === -1;
    });

    if (undiscovered.length === 0) {
      modalCard.className = 'modal__card';
      openModal(
        '<div class="reason-reveal">' +
          '<span class="reason-reveal__number">&#10022;</span>' +
          '<p class="reason-reveal__text">Ya descubriste todas las razones. Eres increíble.</p>' +
        '</div>'
      );
      return;
    }

    var random = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    openReason(random);
  }

  function getDiscovered() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (_e) {
      return [];
    }
  }

  function markDiscovered(id) {
    var discovered = getDiscovered();
    if (discovered.indexOf(id) === -1) {
      var updated = discovered.concat([id]);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (_e) { /* noop */ }
    }
    updateNoteVisual(id);
    updateCounter();
  }

  function updateNoteVisual(id) {
    var note = document.querySelector('[data-reason-id="' + id + '"]');
    if (note && !note.classList.contains('note--opened')) {
      note.classList.add('note--opened');
      var label = note.querySelector('.note__label');
      if (label) label.innerHTML = '&#10003; Descubierta';
    }
  }

  function updateCounter() {
    var discovered = getDiscovered();
    var total = data.reasons.length;
    var count = discovered.length;
    var el = document.getElementById('reasonsCounter');
    if (el) el.textContent = count + ' de ' + total + ' descubiertas';
  }

  /* ── Letter ── */
  function setupLetter() {
    var letterData = data.letter;
    setText('letterSectionTitle', letterData.sectionTitle);

    var stage = document.getElementById('letterStage');
    var closingMsg = document.getElementById('closingMsg');
    closingMsg.textContent = letterData.closingMessage;

    var hasImage = letterData.image && letterData.image.trim() !== '';
    var photoHtml = hasImage
      ? '<img class="letter__photo" src="' + escapeHtml(letterData.image) + '" alt="" loading="lazy"/>'
      : '<div class="letter__photo-placeholder">' + CAMERA_SVG + '<span>Foto especial</span></div>';

    stage.innerHTML =
      '<div class="envelope reveal" id="letterEnvelope">' +
        '<div class="envelope__flap"></div>' +
        '<span class="envelope__heart">&#9829;</span>' +
      '</div>' +
      '<p class="envelope__hint reveal" id="envelopeHint">' + escapeHtml(letterData.envelopeText) + '</p>' +
      '<div class="letter-paper" id="letterPaper">' +
        '<p class="letter__greeting">' + escapeHtml(letterData.greeting) + '</p>' +
        '<div class="letter__body">' +
          letterData.body.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join('') +
        '</div>' +
        '<p class="letter__closing">' + escapeHtml(letterData.closing) + '</p>' +
        photoHtml +
      '</div>';

    document.getElementById('letterEnvelope').addEventListener('click', openEnvelope);
  }

  function openEnvelope() {
    var envelope = document.getElementById('letterEnvelope');
    var hint = document.getElementById('envelopeHint');
    var paper = document.getElementById('letterPaper');
    var closingMsg = document.getElementById('closingMsg');

    if (envelope.classList.contains('envelope--open')) return;

    envelope.classList.add('envelope--open');
    envelope.style.cursor = 'default';

    setTimeout(function () {
      envelope.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      envelope.style.opacity = '0';
      envelope.style.transform = 'scale(0.92)';
      hint.style.transition = 'opacity 0.4s ease';
      hint.style.opacity = '0';

      setTimeout(function () {
        envelope.style.display = 'none';
        hint.style.display = 'none';
        paper.classList.add('letter-paper--visible');
        closingMsg.classList.remove('hidden');
      }, 500);
    }, 900);
  }

  /* ── Modal ── */
  function openModal(contentHtml) {
    modalBody.innerHTML = contentHtml;
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setupModalClose() {
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
        closeModal();
      }
    });
  }

  /* ── Music ── */
  function setupMusic() {
    var toggle = document.getElementById('musicToggle');
    var audio = document.getElementById('bgMusic');
    var isPlaying = false;

    if (!data.music || !data.music.enabled) return;

    toggle.classList.remove('music-btn--hidden');
    audio.src = data.music.file;

    toggle.addEventListener('click', function () {
      if (isPlaying) {
        audio.pause();
        toggle.classList.remove('music-btn--playing');
      } else {
        audio.play().catch(function () { /* user interaction required */ });
        toggle.classList.add('music-btn--playing');
      }
      isPlaying = !isPlaying;
    });

    audio.addEventListener('ended', function () {
      isPlaying = false;
      toggle.classList.remove('music-btn--playing');
    });
  }

  /* ── Navigation ── */
  function setupNavigation() {
    var nav = document.getElementById('mainNav');
    var welcome = document.getElementById('bienvenida');
    var links = document.querySelectorAll('.nav__link');
    var sections = ['recuerdos', 'razones', 'carta'];

    var welcomeObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        nav.classList.remove('nav--visible');
      } else {
        nav.classList.add('nav--visible');
      }
    }, { threshold: 0.15 });

    welcomeObs.observe(welcome);

    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          links.forEach(function (link) {
            var isActive = link.getAttribute('data-section') === id;
            link.classList.toggle('nav__link--active', isActive);
          });
        }
      });
    }, { threshold: 0.25, rootMargin: '-20% 0px -50% 0px' });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(link.getAttribute('data-section'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ── Scroll Reveal ── */
  function setupScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ── Helpers ── */
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ── Start ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
