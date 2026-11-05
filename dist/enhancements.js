(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const guideData = {
    screen: {
      issue: 'Screen or touch issue', category: '01 / SCREEN & TOUCH', icon: 'phone',
      title: 'A clearer view.\nA better everyday.',
      description: "A cracked display, lines across the screen or touch that won't respond? The right repair starts with your exact phone model and what you can see.",
      symptoms: ['Cracked glass or marks across the display', 'Missing areas, lines or unusual colours', 'Touch that misses taps or responds on its own'],
      questions: ['Which display options fit my exact model?', 'What will the part, fit and touch performance be like?', 'What are the cost, timing and applicable warranty terms?'],
      cta: 'Ask about screen repair', kicker: 'DISPLAY & TOUCH', caption: 'Your window to everything.'
    },
    battery: {
      issue: 'Battery drains quickly', category: '02 / BATTERY & POWER', icon: 'battery',
      title: 'Less low battery.\nMore of your everyday.',
      description: "Watching the percentage fall faster than it used to? Share your model and describe how the phone behaves. A battery concern needs more context than a number on the screen.",
      symptoms: ['Battery running down much sooner than expected', 'Unexpected shutdowns during normal use', 'Battery percentage that seems to jump or drop'],
      questions: ['What needs to be checked before choosing a battery?', 'Which battery options fit my exact phone model?', 'What will the quote include, and what terms apply?'],
      cta: 'Ask about battery concerns', kicker: 'BATTERY & POWER', caption: 'For the day ahead of you.'
    },
    charging: {
      issue: "Won't charge", category: '03 / CHARGING & CONNECTION', icon: 'bolt',
      title: 'A better connection.\nA simpler day.',
      description: "A cable that only works at an angle, a loose connection or no charging response? Tell us what you notice, and bring the cable or adapter you use if you can.",
      symptoms: ['A cable that only connects in one position', 'Charging that starts and stops unexpectedly', 'Little or no response when the charger is connected'],
      questions: ['Could the issue involve the cable, port or another part?', 'What will the inspection and repair quote cover?', 'Which part options are available for this model?'],
      cta: 'Ask about charging concerns', kicker: 'CHARGING & CONNECTION', caption: 'The small connection that matters.'
    },
    sound: {
      issue: 'Sound or microphone issue', category: '04 / SOUND & MICROPHONE', icon: 'sound',
      title: 'Every voice matters.\nEvery call, clearer.',
      description: "Struggling to hear a call, or being told your voice isn't clear? Describe whether the issue happens with calls, speakerphone or recorded audio so the team has a useful starting point.",
      symptoms: ['A quiet, distorted or intermittent earpiece', 'Speaker audio that seems faint or unclear', 'Other people having trouble hearing your voice'],
      questions: ['Which audio path needs to be checked on my phone?', 'What repair or replacement options fit this model?', 'What will the cost, timing and applicable terms be?'],
      cta: 'Ask about sound concerns', kicker: 'SPEAKER & MICROPHONE', caption: 'Bring the conversation back.'
    }
  };
  let selectedGuide = 'screen';
  const guideTabs = $$('[data-guide]');
  const guidePanel = $('#guide-panel');
  function setList(selector, items) {
    const list = $(selector);
    list.replaceChildren(...items.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
  }
  function selectGuide(key, focus = false) {
    const data = guideData[key];
    if (!data) return;
    selectedGuide = key;
    guideTabs.forEach(tab => {
      const selected = tab.dataset.guide === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus({ preventScroll: true });
    });
    guidePanel.setAttribute('aria-labelledby', `guide-tab-${key}`);
    $('#assembly-scene').dataset.part = key;
    $('#guide-category').textContent = data.category;
    $('#guide-detail-title').textContent = data.title;
    $('#guide-description').textContent = data.description;
    $('#guide-symbol use').setAttribute('href', `#${data.icon}`);
    $('#assembly-kicker').textContent = data.kicker;
    $('#assembly-caption').textContent = data.caption;
    $('#guide-enquire').firstChild.textContent = data.cta + ' ';
    setList('#guide-symptoms', data.symptoms);
    setList('#guide-questions', data.questions);
    if (!motion.matches) {
      guidePanel.classList.remove('is-updating');
      void guidePanel.offsetWidth;
      guidePanel.classList.add('is-updating');
    }
  }
  guideTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectGuide(tab.dataset.guide));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % guideTabs.length;
      if (event.key === 'ArrowLeft') next = (index + guideTabs.length - 1) % guideTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = guideTabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectGuide(guideTabs[next].dataset.guide, true);
      }
    });
  });
  $$('[data-explore]').forEach(button => button.addEventListener('click', () => {
    selectGuide(button.dataset.explore, true);
    $('#repair-guide').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
  }));
  $('#guide-enquire').addEventListener('click', event => {
    event.preventDefault();
    const data = guideData[selectedGuide];
    document.dispatchEvent(new CustomEvent('ahmed:enquire', { detail: {
      issue: data.issue,
      note: `I'd like to discuss ${data.category.split(' / ')[1].toLowerCase()} options for my phone.`,
      model: ''
    }}));
  });

  const modelSuggestions = {
    Apple: ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16'],
    Samsung: ['Galaxy A14', 'Galaxy A15', 'Galaxy A34', 'Galaxy A54', 'Galaxy S22', 'Galaxy S23', 'Galaxy S24'],
    'Xiaomi / Redmi': ['Redmi Note 11', 'Redmi Note 12', 'Redmi Note 13', 'Redmi 12', 'Redmi 13'],
    OPPO: ['A17', 'A38', 'A58', 'A78', 'Reno 8', 'Reno 10'],
    vivo: ['Y17s', 'Y21', 'Y27', 'Y36', 'V27', 'V29'],
    Infinix: ['Smart 8', 'Hot 30', 'Hot 40', 'Note 30', 'Note 40'],
    Tecno: ['Spark 10', 'Spark 20', 'Pova 5', 'Camon 20', 'Camon 30'],
    realme: ['C35', 'C53', 'C55', '9', '10', '11'],
    OnePlus: ['8', '9', '10 Pro', '11', 'Nord CE 3']
  };
  $('#device-brand').addEventListener('change', event => {
    const brand = event.target.value;
    $('#model-suggestions').replaceChildren(...(modelSuggestions[brand] || []).map(model => {
      const option = document.createElement('option'); option.value = model; return option;
    }));
    $('#model-help').textContent = brand && brand !== 'Other'
      ? `Type any ${brand} model. Suggestions are examples; repair and parts availability need confirmation.`
      : 'Not sure of your model? Describe the phone in your message.';
  });

  const checklist = $$('.prep-item input');
  function updateChecklist() {
    const count = checklist.filter(input => input.checked).length;
    $('#prep-status').textContent = `${count} of ${checklist.length} steps checked`;
    $('#prep-percent').textContent = `${Math.round(count / checklist.length * 100)}%`;
    $('#prep-progress-fill').style.transform = `scaleX(${count / checklist.length})`;
    $('#prep-helper').textContent = count === checklist.length
      ? "You're a little more prepared. Contact us to plan your visit."
      : 'No need to tick every box to get in touch.';
  }
  checklist.forEach(input => input.addEventListener('change', updateChecklist));
  $('#prep-enquire').addEventListener('click', () => {
    const checked = checklist.filter(input => input.checked).map(input => `• ${input.value}`);
    const note = ['I would like to plan a visit to the shop.', ...(checked.length ? ['', 'My visit notes:', ...checked] : []), '', 'Could you confirm your opening hours?'].join('\n');
    document.dispatchEvent(new CustomEvent('ahmed:enquire', { detail: {issue:'Something else / not sure', note, model:''} }));
  });

  const address = 'Ahmed Parts, Gate No. 12, Shop A-238, Sareena Mobile Market, Karachi, Pakistan. Call: 0311 3433389.';
  let copyTimer;
  $('#copy-address').addEventListener('click', async () => {
    const status = $('#copy-address-status');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard not available');
      await navigator.clipboard.writeText(address);
      status.textContent = 'Address copied';
    } catch {
      const field = document.createElement('textarea');
      field.value = address;
      field.setAttribute('readonly','');
      field.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(field); field.select();
      const copied = document.execCommand('copy'); field.remove();
      status.textContent = copied ? 'Address copied' : 'Please select the address above to copy.';
      $('#copy-address').focus({preventScroll:true});
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { status.textContent = ''; }, 4500);
  });

  // Only confirmed profile URLs from the owner's configuration are rendered.
  const allowedDomains = {
    facebook: ['facebook.com','www.facebook.com','m.facebook.com','fb.com'],
    instagram: ['instagram.com','www.instagram.com'],
    tiktok: ['tiktok.com','www.tiktok.com'],
    youtube: ['youtube.com','www.youtube.com','youtu.be'],
    linkedin: ['linkedin.com','www.linkedin.com']
  };
  const profiles = (window.AhmedPartsConfig?.socialProfiles || []).filter(profile => {
    try { const url = new URL(profile.url); return url.protocol === 'https:' && allowedDomains[profile.platform]?.includes(url.hostname); }
    catch { return false; }
  });
  const socialMarks = {facebook:'f',instagram:'◎',tiktok:'♪',youtube:'▶',linkedin:'in'};
  $$('[data-social-profiles]').forEach(container => {
    profiles.forEach(profile => {
      const link = document.createElement('a');
      link.href = profile.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const label = profile.label || profile.platform;
      link.setAttribute('aria-label', `Ahmed Parts on ${label}`); link.title = label;
      const mark = document.createElement('span'); mark.className='social-lettermark'; mark.textContent=socialMarks[profile.platform]; mark.setAttribute('aria-hidden','true');
      link.append(mark); container.append(link);
    });
    container.hidden = profiles.length === 0;
  });

  const navLinks = $$('.desktop-nav a[href^="#"]');
  const targets = navLinks.map(link => ({link, section:$(link.getAttribute('href'))})).filter(item => item.section);
  let framePending = false;
  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $('#reading-progress-fill').style.transform = `scaleX(${max > 0 ? Math.min(1,Math.max(0,window.scrollY / max)) : 0})`;
    const active = targets.filter(item => item.section.getBoundingClientRect().top <= window.innerHeight * .4).at(-1);
    targets.forEach(item => {
      const current = item === active;
      item.link.classList.toggle('is-current', current);
      if (current) item.link.setAttribute('aria-current','location'); else item.link.removeAttribute('aria-current');
    });
    framePending = false;
  }
  function scheduleScroll() { if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); } }
  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleScroll,{passive:true});
  $$('.repair-grid>.repair-card').forEach((card,index) => card.style.setProperty('--reveal-delay',`${index % 2 * 90}ms`));
  document.documentElement.classList.add('experience-ready');
  selectGuide('screen');
  updateChecklist();
  updateScroll();
})();
