

(function () {
  'use strict';

  var INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  var STORAGE_KEY = 'adhkar_popup_next_show';

  var overlayEl = null;
  var scheduleTimer = null;
  var isOpen = false;

  function lang() {
    if (window.siteI18n && typeof window.siteI18n.getLang === 'function') {
      return window.siteI18n.getLang();
    }
    return document.documentElement.lang === 'fr' ? 'fr' : 'ar';
  }

  function pickRandomDhikr() {
    var list = window.ADHKAR_LIST;
    if (!list || !list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  /* -------------------- Construction de la popup (une seule fois) -------------------- */
  function buildOverlay() {
    if (overlayEl) return overlayEl;

    var overlay = document.createElement('div');
    overlay.className = 'adhkar-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'أذكار');

    var card = document.createElement('div');
    card.className = 'adhkar-popup-card';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'adhkar-popup-close';
    closeBtn.setAttribute('aria-label', 'إغلاق');
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    closeBtn.addEventListener('click', closePopup);

    var mark = document.createElement('div');
    mark.className = 'adhkar-popup-mark';
    mark.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/></svg>';

    var title = document.createElement('p');
    title.className = 'adhkar-popup-title';

    var text = document.createElement('p');
    text.className = 'adhkar-popup-text';

    card.appendChild(closeBtn);
    card.appendChild(mark);
    card.appendChild(title);
    card.appendChild(text);
    overlay.appendChild(card);

    // Fermeture au clic sur le fond, ou avec la touche Échap.
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', function (e) {
      if (isOpen && e.key === 'Escape') closePopup();
    });

    document.body.appendChild(overlay);

    overlayEl = { overlay: overlay, title: title, text: text };
    return overlayEl;
  }

  /* -------------------- Affichage / fermeture -------------------- */
  function showPopup() {
    // Ne dérange pas la navigation si l'onglet n'est pas visible :
    // on retente dès que la page redevient visible.
    if (document.hidden) {
      document.addEventListener('visibilitychange', function onVisible() {
        if (!document.hidden) {
          document.removeEventListener('visibilitychange', onVisible);
          showPopup();
        }
      });
      return;
    }

    var dhikr = pickRandomDhikr();
    if (!dhikr) return;

    var refs = buildOverlay();
    var currentLang = lang();
    refs.title.textContent = dhikr.title ? (dhikr.title[currentLang] || dhikr.title.ar) : '';
    refs.text.textContent = dhikr.text ? (dhikr.text[currentLang] || dhikr.text.ar) : '';

    refs.overlay.classList.add('is-visible');
    isOpen = true;
  }

  function closePopup() {
    if (!overlayEl) return;
    overlayEl.overlay.classList.remove('is-visible');
    isOpen = false;
    // Le prochain rappel est reprogrammé au moment de la fermeture,
    // exactement 5 minutes plus tard.
    scheduleNext(INTERVAL_MS);
  }

  /* -------------------- Planification (persistante entre les pages) -------------------- */
  function scheduleNext(delay) {
    if (scheduleTimer) clearTimeout(scheduleTimer);
    var nextTime = Date.now() + delay;
    try { sessionStorage.setItem(STORAGE_KEY, String(nextTime)); } catch (e) {}
    scheduleTimer = setTimeout(showPopup, delay);
  }

  function init() {
    var stored = null;
    try { stored = sessionStorage.getItem(STORAGE_KEY); } catch (e) {}

    var now = Date.now();
    var nextTime = stored ? parseInt(stored, 10) : now + INTERVAL_MS;

    // Si l'échéance stockée est déjà dépassée (onglet resté ouvert
    // longtemps, tests, etc.), on ne rattrape JAMAIS en affichant tout
    // de suite : on repart proprement sur un cycle complet de 5 minutes.
    if (!stored || (nextTime - now) <= 0) {
      nextTime = now + INTERVAL_MS;
    }

    try { sessionStorage.setItem(STORAGE_KEY, String(nextTime)); } catch (e) {}

    var remaining = nextTime - now;
    scheduleTimer = setTimeout(showPopup, remaining);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
