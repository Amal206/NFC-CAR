/* ==========================================================================
   دعاء — أذكار وأدعية | script.js
   Logique du site : révélation au scroll, lecteur audio multi-pistes avec
   transition fluide, écran de chargement, effets d'en-tête et
   micro-interactions des cartes.
   Aucune lecture audio automatique au chargement de la page : la première
   lecture est toujours déclenchée par un clic de l'utilisateur.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initHeaderScroll();
  initScrollReveal();
  initCardGlow();
  initAudioPlayers();      // lecteurs simples (compatibilité)
  initPlaylistPlayers();   // lecteurs multi-pistes
  initOrderButtons();
  initShowcase();
});

/* -------------------- Écran de chargement -------------------- */
function initSplash(){
  const splash = document.getElementById('appSplash');
  if(!splash) return;

  let alreadySeen = false;
  try{ alreadySeen = sessionStorage.getItem('splash_seen') === '1'; }catch(e){}

  const hide = () => {
    splash.classList.add('is-hidden');
    setTimeout(() => { splash.style.display = 'none'; }, 400);
    try{ sessionStorage.setItem('splash_seen', '1'); }catch(e){}
  };

  if(alreadySeen){
    splash.style.display = 'none';
    return;
  }

  // Durée volontairement courte : juste le temps d'un accueil élégant,
  // jamais un obstacle à la rapidité du site.
  window.setTimeout(hide, 550);
}

/* -------------------- En-tête : ombre au scroll -------------------- */
function initHeaderScroll(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

/* -------------------- Révélation des éléments au scroll -------------------- */
function initScrollReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* -------------------- Effet de lueur douce sous le curseur (cartes) -------------------- */
function initCardGlow(){
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
}

/* -------------------- Lecteur audio simple (une seule piste) --------------------
   Conservé pour compatibilité si une page utilise encore la structure
   .audio-player à piste unique plutôt que .playlist-player.
------------------------------------------------------------------------- */
function initAudioPlayers(){
  const players = document.querySelectorAll('[data-audio-player]');
  if(!players.length) return;

  const allAudios = [];

  players.forEach(player => {
    const audio = player.querySelector('audio');
    const playBtn = player.querySelector('.play-btn');
    const bar = player.querySelector('.bar');
    const barFill = player.querySelector('.bar-fill');
    const curEl = player.querySelector('.cur');
    const durEl = player.querySelector('.dur');
    if(!audio || !playBtn) return;

    allAudios.push(audio);

    const iconPlay = playBtn.querySelector('.icon-play');
    const iconPause = playBtn.querySelector('.icon-pause');

    audio.addEventListener('loadedmetadata', () => {
      if(durEl) durEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if(curEl) curEl.textContent = formatTime(audio.currentTime);
      if(barFill && audio.duration){
        barFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      }
    });

    audio.addEventListener('play', () => {
      allAudios.forEach(a => { if(a !== audio) a.pause(); });
      player.classList.add('is-playing');
      if(iconPlay) iconPlay.style.display = 'none';
      if(iconPause) iconPause.style.display = '';
    });

    audio.addEventListener('pause', () => {
      player.classList.remove('is-playing');
      if(iconPlay) iconPlay.style.display = '';
      if(iconPause) iconPause.style.display = 'none';
    });

    audio.addEventListener('ended', () => {
      if(barFill) barFill.style.width = '0%';
    });

    playBtn.addEventListener('click', () => {
      if(audio.paused){
        const p = audio.play();
        if(p && p.catch) p.catch(() => {});
      } else {
        audio.pause();
      }
    });

    if(bar){
      bar.addEventListener('click', (e) => {
        if(!audio.duration) return;
        const rect = bar.getBoundingClientRect();
        const rtl = document.documentElement.dir !== 'ltr';
        const ratio = rtl ? 1 - ((e.clientX - rect.left) / rect.width) : (e.clientX - rect.left) / rect.width;
        audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
      });
    }
  });
}

/* -------------------- Lecteur audio multi-pistes (playlist) --------------------
   Structure HTML attendue : voir DOCUMENTATION.md → "Système audio
   multi-pistes". Gère : lecture/pause, piste précédente/suivante, liste
   cliquable, transition fluide (fondu) entre les pistes, avancement
   automatique en fin de piste, et titres bilingues (data-title-ar / fr).
------------------------------------------------------------------------- */
function initPlaylistPlayers(){
  const players = document.querySelectorAll('[data-playlist]');
  if(!players.length) return;

  const FADE_MS = 260;
  const allAudios = [];

  players.forEach(player => {
    const audio = player.querySelector('audio');
    const playBtn = player.querySelector('[data-action="playpause"]');
    const prevBtn = player.querySelector('[data-action="prev"]');
    const nextBtn = player.querySelector('[data-action="next"]');
    const bar = player.querySelector('.bar');
    const barFill = player.querySelector('.bar-fill');
    const curEl = player.querySelector('.cur');
    const durEl = player.querySelector('.dur');
    const npTitle = player.querySelector('.np-title');
    const npIndex = player.querySelector('.np-index');
    const items = Array.from(player.querySelectorAll('.track-item'));
    if(!audio || !items.length) return;

    allAudios.push(audio);

    const iconPlay = playBtn ? playBtn.querySelector('.icon-play') : null;
    const iconPause = playBtn ? playBtn.querySelector('.icon-pause') : null;

    let currentIndex = 0;
    let isLoaded = false;
    let fadeTimer = null;

    const lang = () => (window.siteI18n ? window.siteI18n.getLang() : 'ar');
    const trackTitle = (item) => item.getAttribute(`data-title-${lang()}`) || item.getAttribute('data-title-ar') || item.querySelector('.t-title').textContent;

    function renderTrackTitles(){
      items.forEach(item => {
        const titleEl = item.querySelector('.t-title');
        if(titleEl) titleEl.textContent = trackTitle(item);
      });
      updateNowPlayingText();
    }

    function updateNowPlayingText(){
      if(npTitle) npTitle.textContent = trackTitle(items[currentIndex]);
      if(npIndex) npIndex.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    function setActiveItem(index){
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
        const miniPlay = item.querySelector('.mini-play');
        const miniEq = item.querySelector('.mini-eq');
        if(miniPlay && miniEq){
          const showEq = i === index && !audio.paused;
          miniPlay.style.display = showEq ? 'none' : '';
          miniEq.style.display = showEq ? 'flex' : 'none';
        }
      });
    }

    function fadeTo(targetVolume, duration, done){
      clearInterval(fadeTimer);
      const steps = 12;
      const stepTime = duration / steps;
      const startVolume = audio.volume;
      const delta = (targetVolume - startVolume) / steps;
      let count = 0;
      fadeTimer = setInterval(() => {
        count++;
        audio.volume = Math.min(1, Math.max(0, startVolume + delta * count));
        if(count >= steps){
          clearInterval(fadeTimer);
          audio.volume = targetVolume;
          if(done) done();
        }
      }, stepTime);
    }

    function loadTrack(index, opts){
      const autoplay = opts && opts.autoplay;
      currentIndex = ((index % items.length) + items.length) % items.length;
      const src = items[currentIndex].getAttribute('data-src');

      const startNew = () => {
        audio.src = src;
        audio.volume = 0;
        isLoaded = true;
        if(npTitle) npTitle.classList.remove('is-switching');
        updateNowPlayingText();
        setActiveItem(currentIndex);
        if(autoplay){
          const p = audio.play();
          if(p && p.then) p.then(() => fadeTo(1, FADE_MS)).catch(() => {});
        }
      };

      if(npTitle) npTitle.classList.add('is-switching');

      if(!audio.paused){
        fadeTo(0, FADE_MS, () => {
          audio.pause();
          window.setTimeout(startNew, 40);
        });
      } else {
        window.setTimeout(startNew, autoplay ? 0 : 90);
      }
    }

    // Initialisation visuelle : la première piste est affichée sans être
    // chargée ni jouée (aucune lecture automatique au chargement).
    updateNowPlayingText();
    setActiveItem(0);

    audio.addEventListener('loadedmetadata', () => {
      if(durEl) durEl.textContent = formatTime(audio.duration);
      const durLabel = items[currentIndex].querySelector('.t-dur');
      if(durLabel) durLabel.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if(curEl) curEl.textContent = formatTime(audio.currentTime);
      if(barFill && audio.duration){
        barFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      }
    });

    audio.addEventListener('play', () => {
      allAudios.forEach(a => { if(a !== audio) a.pause(); });
      if(iconPlay) iconPlay.style.display = 'none';
      if(iconPause) iconPause.style.display = '';
      setActiveItem(currentIndex);
    });

    audio.addEventListener('pause', () => {
      if(iconPlay) iconPlay.style.display = '';
      if(iconPause) iconPause.style.display = 'none';
      setActiveItem(currentIndex);
    });

    audio.addEventListener('ended', () => {
      if(barFill) barFill.style.width = '0%';
      if(currentIndex < items.length - 1){
        loadTrack(currentIndex + 1, { autoplay:true });
      } else {
        audio.volume = 1;
        setActiveItem(currentIndex);
      }
    });

    if(playBtn){
      playBtn.addEventListener('click', () => {
        if(!isLoaded){
          loadTrack(currentIndex, { autoplay:true });
          return;
        }
        if(audio.paused){
          audio.volume = audio.volume || 1;
          const p = audio.play();
          if(p && p.catch) p.catch(() => {});
        } else {
          audio.pause();
        }
      });
    }

    if(prevBtn){
      prevBtn.addEventListener('click', () => {
        const wasPlaying = isLoaded && !audio.paused;
        loadTrack(currentIndex - 1, { autoplay: wasPlaying });
      });
    }
    if(nextBtn){
      nextBtn.addEventListener('click', () => {
        const wasPlaying = isLoaded && !audio.paused;
        loadTrack(currentIndex + 1, { autoplay: wasPlaying });
      });
    }

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        loadTrack(index, { autoplay:true });
      });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          loadTrack(index, { autoplay:true });
        }
      });
    });

    if(bar){
      bar.addEventListener('click', (e) => {
        if(!audio.duration) return;
        const rect = bar.getBoundingClientRect();
        const rtl = document.documentElement.dir !== 'ltr';
        const ratio = rtl ? 1 - ((e.clientX - rect.left) / rect.width) : (e.clientX - rect.left) / rect.width;
        audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
      });
    }

    // Rafraîchit les titres (piste courante + liste) au changement de langue.
    document.addEventListener('sitelangchange', renderTrackTitles);
  });
}

/* -------------------- Formatage du temps -------------------- */
function formatTime(s){
  if(!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

/* -------------------- Boutons "اطلب توا" / "Commander" -------------------- */
function initOrderButtons(){
  const buttons = document.querySelectorAll('[data-order-btn]');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if(!href || href === '#'){
        e.preventDefault();
        const lg = window.siteI18n ? window.siteI18n.getLang() : 'ar';
        const msg = window.siteI18n ? window.siteI18n.t('order.pending_alert', lg) : null;
        window.alert(msg || 'رابط الطلب سيتم إضافته قريباً.');
      }
    });
  });
}

/* -------------------- Vitrine de présentation (carrousel plein format) --------------------
   Fondu enchaîné entre les images, effet Ken Burns léger sur l'image
   active, navigation par points/flèches/swipe/clavier, avec repli
   élégant et animé si une image n'est pas encore fournie.
------------------------------------------------------------------------- */
function initShowcase(){
  const showcases = document.querySelectorAll('[data-showcase]');
  if(!showcases.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY_MS = 5000;

  showcases.forEach(showcase => {
    const slides = Array.from(showcase.querySelectorAll('.showcase-slide'));
    const dotsWrap = showcase.querySelector('.showcase-dots');
    const prevBtn = showcase.querySelector('.showcase-prev');
    const nextBtn = showcase.querySelector('.showcase-next');
    if(!slides.length) return;

    // Détecte les images manquantes et affiche le repli animé.
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if(!img) return;
      img.addEventListener('error', () => slide.classList.add('img-missing'), { once:true });
    });

    // Construit les points de navigation dynamiquement (autant que de diapositives).
    const dots = [];
    if(dotsWrap){
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'showcase-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `${i + 1}`);
        dot.addEventListener('click', () => goTo(i, true));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    let current = 0;
    let timer = null;

    function goTo(index, userTriggered){
      const next = ((index % slides.length) + slides.length) % slides.length;
      if(next === current) return;

      const prevSlide = slides[current];
      prevSlide.classList.remove('is-active', 'kb-zoom');

      current = next;
      const nextSlide = slides[current];
      nextSlide.classList.add('is-active');

      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));

      if(!reduceMotion){
        // Relance l'effet Ken Burns proprement à chaque nouvelle diapositive.
        requestAnimationFrame(() => nextSlide.classList.add('kb-zoom'));
      }

      if(userTriggered) restartAutoplay();
    }

    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }

    if(nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    if(prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

    showcase.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft'){ e.preventDefault(); document.documentElement.dir === 'rtl' ? next() : prev(); restartAutoplay(); }
      if(e.key === 'ArrowRight'){ e.preventDefault(); document.documentElement.dir === 'rtl' ? prev() : next(); restartAutoplay(); }
    });

    // Swipe tactile
    let touchStartX = null;
    const viewport = showcase.querySelector('.showcase-viewport');
    if(viewport){
      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive:true });
      viewport.addEventListener('touchend', (e) => {
        if(touchStartX == null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const rtl = document.documentElement.dir === 'rtl';
        if(Math.abs(deltaX) > 40){
          if((deltaX < 0 && !rtl) || (deltaX > 0 && rtl)) next();
          else prev();
          restartAutoplay();
        }
        touchStartX = null;
      }, { passive:true });
    }

    function startAutoplay(){
      if(reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay(){ clearInterval(timer); }
    function restartAutoplay(){ stopAutoplay(); startAutoplay(); }

    showcase.addEventListener('pointerenter', stopAutoplay);
    showcase.addEventListener('pointerleave', startAutoplay);
    showcase.addEventListener('focusin', stopAutoplay);
    showcase.addEventListener('focusout', startAutoplay);

    // Lance le Ken Burns sur la première diapositive et démarre le défilement automatique.
    if(!reduceMotion) requestAnimationFrame(() => slides[0].classList.add('kb-zoom'));
    startAutoplay();
  });
}