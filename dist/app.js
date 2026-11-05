(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  const bookingDialog = $('#booking-dialog');
  const privacyDialog = $('#privacy-dialog');
  const dialogStart = $('#dialog-start');
  const dialogReview = $('#dialog-review');
  const dialogIssue = $('#dialog-issue');
  const dialogModel = $('#dialog-model');
  const dialogNote = $('#dialog-note');
  const messagePreview = $('#message-preview');
  const messageError = $('#message-error');
  const whatsappSend = $('#whatsapp-send');
  let lastFocusedElement = null;

  function closeMenu() {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = isOpen;
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  });
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); }, { passive: true });
  function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const device = $('#hero-device');
  const stage = $('#phone-stage');
  const caption = $('#phone-caption');
  $$('[data-screen]').forEach(button => {
    button.addEventListener('click', () => {
      const broken = button.dataset.screen === 'before';
      device.classList.toggle('is-broken', broken);
      $$('[data-screen]').forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      caption.replaceChildren();
      caption.append(document.createTextNode(broken ? 'Oops. Life happens.' : 'A fresh start.'));
      caption.append(document.createElement('br'));
      const strong = document.createElement('strong');
      strong.textContent = broken ? 'Let’s talk about the fix.' : 'Same favourite phone.';
      caption.append(strong);
    });
  });
  let moveFrame = null;
  stage.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType !== 'mouse') return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    cancelAnimationFrame(moveFrame);
    moveFrame = requestAnimationFrame(() => {
      device.style.transform = `rotate(${-9 + x * 3}deg) rotateY(${-17 + x * 16}deg) rotateX(${7 - y * 11}deg)`;
    });
  });
  stage.addEventListener('pointerleave', () => {
    cancelAnimationFrame(moveFrame);
    device.style.transform = '';
  });

  function showDialog(dialog) {
    lastFocusedElement = document.activeElement;
    closeMenu();
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  function resetReview() {
    dialogStart.hidden = false;
    dialogReview.hidden = true;
    bookingDialog.setAttribute('aria-labelledby', 'dialog-title');
    messageError.hidden = true;
  }
  function openBooking(issue) {
    resetReview();
    if (issue) dialogIssue.value = issue;
    showDialog(bookingDialog);
  }
  document.addEventListener('ahmed:enquire', event => {
    const details = event.detail || {};
    if (typeof details.model === 'string') dialogModel.value = details.model;
    if (typeof details.note === 'string') dialogNote.value = details.note;
    openBooking(details.issue);
  });
  $$('[data-book]').forEach(button => button.addEventListener('click', () => openBooking()));
  $$('[data-issue]').forEach(button => button.addEventListener('click', () => openBooking(button.dataset.issue)));
  $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  [bookingDialog, privacyDialog].forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus({ preventScroll: true });
    });
  });
  $('#privacy-open').addEventListener('click', () => showDialog(privacyDialog));

  function composeMessage(issue, model, note) {
    const lines = ['Hello Ahmed Parts, I’d like help with my phone.', '', `Issue: ${issue}`];
    if (model.trim()) lines.push(`Phone model: ${model.trim()}`);
    if (note.trim()) lines.push('', `Details: ${note.trim()}`);
    lines.push('', 'Could you let me know the next step and when I can bring it in?');
    return lines.join('\n');
  }
  function syncWhatsApp() {
    const text = messagePreview.value.trim();
    whatsappSend.href = `https://wa.me/923113433389?text=${encodeURIComponent(text)}`;
    if (text) messageError.hidden = true;
  }
  function showReview(issue, model, note) {
    messagePreview.value = composeMessage(issue, model, note);
    syncWhatsApp();
    dialogStart.hidden = true;
    dialogReview.hidden = false;
    bookingDialog.setAttribute('aria-labelledby', 'review-title');
    bookingDialog.scrollTop = 0;
    messagePreview.focus({ preventScroll: true });
  }
  $('#dialog-preview').addEventListener('click', () => showReview(dialogIssue.value, dialogModel.value, dialogNote.value));
  messagePreview.addEventListener('input', syncWhatsApp);
  whatsappSend.addEventListener('click', event => {
    if (!messagePreview.value.trim()) {
      event.preventDefault();
      messageError.hidden = false;
      messagePreview.focus();
    }
  });
  $('#review-back').addEventListener('click', () => {
    resetReview();
    bookingDialog.scrollTop = 0;
    dialogIssue.focus({ preventScroll: true });
  });
  $('#enquiry-form').addEventListener('submit', event => {
    event.preventDefault();
    const issue = $('input[name="issue"]:checked').value;
    dialogIssue.value = issue;
    const brand = $('#device-brand').value;
    const model = $('#device-model').value.trim();
    dialogModel.value = [brand === 'Other' ? '' : brand, model].filter(Boolean).join(' · ');
    dialogNote.value = $('#issue-note').value;
    showDialog(bookingDialog);
    showReview(issue, dialogModel.value, dialogNote.value);
  });

  $('#copyright-year').textContent = new Date().getFullYear();
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.documentElement.classList.add('js-motion');
    $$('.reveal').forEach(element => observer.observe(element));
  }
})();
