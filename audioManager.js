/* ==========================================================================
   audioManager.js — Lecteur audio global partagé (Octogo / دعاء)
   --------------------------------------------------------------------------
   À inclure UNE SEULE FOIS par page, juste avant </body> :

     <script src="audioManager.js" defer></script>

   Utilisation depuis n'importe quelle page (index.html, أذكار الصباح,
   الأدعية, ...) : il suffit de mettre ces attributs sur un bouton ou un
   lien existant, PAS besoin de créer de nouvel objet Audio() :

     <button type="button"
             data-audio-src="audio/adhkar-sabah/01.mp3"
             data-audio-title="أذكار الصباح — الجزء 1">
       تشغيل
     </button>

   Le clic est intercepté automatiquement (délégation d'événements) et
   envoyé à AudioManager.play(src, title). Si le même audio est déjà en
   cours, le clic bascule juste lecture/pause au lieu de redémarrer.

   État persistant : src, titre, position, lecture/pause sont sauvegardés
   dans localStorage et relus à chaque chargement de page, afin que le
   lecteur reprenne exactement où il en était, même après un changement
   de page complet (rechargement du document).

   API publique : window.AudioManager = { play, toggle, pause, stop,
   isPlaying, getState }
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "octogo_audio_state_v1";
  var SAVE_INTERVAL_MS = 1000;

  /* ---------------- 1. État + persistance ---------------- */
  var state = {
    src: null,
    title: "",
    time: 0,
    playing: false
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          state.src = parsed.src || null;
          state.title = parsed.title || "";
          state.time = typeof parsed.time === "number" ? parsed.time : 0;
          state.playing = !!parsed.playing;
        }
      }
    } catch (e) { /* localStorage indisponible : on continue sans état persistant */ }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* silencieux : mode privé, quota, etc. */ }
  }

  function clearState() {
    state = { src: null, title: "", time: 0, playing: false };
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* ---------------- 2. Élément audio unique ---------------- */
  var audio = new Audio();
  audio.preload = "auto";

  function absoluteUrl(src) {
    try { return new URL(src, window.location.href).href; }
    catch (e) { return src; }
  }

  /* ---------------- 3. Mini-player : construction du DOM ---------------- */
  var ui = {};

  function buildPlayer() {
    if (document.getElementById("gap-mini-player")) {
      ui.root = document.getElementById("gap-mini-player");
      return;
    }
    var root = document.createElement("div");
    root.id = "gap-mini-player";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Lecteur audio");
    root.innerHTML =
      '<button type="button" class="mp-btn mp-play" aria-label="Lecture / Pause">' +
        '<svg class="mp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
        '<svg class="mp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>' +
      '</button>' +
      '<div class="mp-info">' +
        '<div class="mp-title">&nbsp;</div>' +
        '<div class="mp-progress"><div class="mp-progress-fill"></div></div>' +
      '</div>' +
      '<button type="button" class="mp-btn mp-stop" aria-label="Arrêter">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>' +
      '</button>';
    document.body.appendChild(root);

    ui.root = root;
    ui.playBtn = root.querySelector(".mp-play");
    ui.iconPlay = root.querySelector(".mp-icon-play");
    ui.iconPause = root.querySelector(".mp-icon-pause");
    ui.stopBtn = root.querySelector(".mp-stop");
    ui.title = root.querySelector(".mp-title");
    ui.progress = root.querySelector(".mp-progress");
    ui.progressFill = root.querySelector(".mp-progress-fill");

    ui.playBtn.addEventListener("click", function () { AudioManager.toggle(); });
    ui.stopBtn.addEventListener("click", function () { AudioManager.stop(); });
    ui.progress.addEventListener("click", function (e) {
      if (!audio.duration || !isFinite(audio.duration)) return;
      var rect = ui.progress.getBoundingClientRect();
      var ratio = (e.clientX - rect.left) / rect.width;
      // Respecte le RTL : en RTL, la barre visuelle avance de droite à gauche
      if (getComputedStyle(document.documentElement).direction === "rtl") {
        ratio = 1 - ratio;
      }
      ratio = Math.min(1, Math.max(0, ratio));
      audio.currentTime = ratio * audio.duration;
    });
  }

  function updateUI() {
    if (!ui.root) return;
    var hasTrack = !!state.src;
    ui.root.classList.toggle("is-visible", hasTrack);
    if (!hasTrack) return;

    ui.title.textContent = state.title || "";
    ui.iconPlay.style.display = state.playing ? "none" : "";
    ui.iconPause.style.display = state.playing ? "" : "none";

    var pct = 0;
    if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
      pct = (audio.currentTime / audio.duration) * 100;
    }
    ui.progressFill.style.width = pct + "%";
  }

  /* ---------------- 4. Chargement / restauration ---------------- */
  function loadTrack(src, title, resumeAt, autoplay) {
    var isSameSrc = absoluteUrl(src) === absoluteUrl(audio.src || "");
    state.src = src;
    state.title = title || state.title || "";

    if (!isSameSrc) {
      audio.src = src;
    }

    var applyPosition = function () {
      if (resumeAt && resumeAt > 0 && resumeAt < (audio.duration || Infinity)) {
        audio.currentTime = resumeAt;
      }
      if (autoplay) {
        var p = audio.play();
        if (p && typeof p.catch === "function") {
          p.then(function () {
            state.playing = true;
            saveState();
            updateUI();
          }).catch(function () {
            // Lecture auto bloquée par le navigateur (politique autoplay) :
            // on affiche le lecteur en pause, un seul tap sur ▶️ suffit.
            state.playing = false;
            saveState();
            updateUI();
          });
        }
      } else {
        updateUI();
      }
    };

    if (isSameSrc && audio.readyState >= 1) {
      applyPosition();
    } else {
      audio.addEventListener("loadedmetadata", applyPosition, { once: true });
    }

    saveState();
    updateUI();
  }

  /* ---------------- 5. API publique ---------------- */
  var AudioManager = {
    play: function (src, title) {
      if (!src) return;
      var isSameSrc = absoluteUrl(src) === absoluteUrl(audio.src || "");
      if (isSameSrc && state.src) {
        // Même piste déjà chargée : ne redémarre pas, on reprend/poursuit.
        if (!state.playing) AudioManager.resume();
        return;
      }
      loadTrack(src, title, 0, true);
    },

    toggle: function () {
      if (!state.src) return;
      if (state.playing) AudioManager.pause();
      else AudioManager.resume();
    },

    resume: function () {
      if (!state.src) return;
      var p = audio.play();
      if (p && typeof p.catch === "function") {
        p.then(function () { state.playing = true; saveState(); updateUI(); })
         .catch(function () { state.playing = false; saveState(); updateUI(); });
      }
    },

    pause: function () {
      audio.pause();
      state.playing = false;
      saveState();
      updateUI();
    },

    stop: function () {
      audio.pause();
      audio.currentTime = 0;
      clearState();
      updateUI();
    },

    isPlaying: function (src) {
      if (src) return state.playing && absoluteUrl(src) === absoluteUrl(audio.src || "");
      return state.playing;
    },

    getState: function () {
      return { src: state.src, title: state.title, time: audio.currentTime, playing: state.playing };
    }
  };

  window.AudioManager = AudioManager;

  /* ---------------- 6. Délégation des clics sur toute la page ---------------- */
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest("[data-audio-src]");
    if (!trigger) return;
    e.preventDefault();
    var src = trigger.getAttribute("data-audio-src");
    var title = trigger.getAttribute("data-audio-title") || trigger.textContent.trim();
    AudioManager.play(src, title);
  });

  /* ---------------- 7. Sauvegarde continue + événements du lecteur ---------------- */
  var saveTimer = null;
  audio.addEventListener("play", function () {
    state.playing = true;
    saveState();
    updateUI();
    if (saveTimer) clearInterval(saveTimer);
    saveTimer = setInterval(function () {
      state.time = audio.currentTime;
      saveState();
    }, SAVE_INTERVAL_MS);
  });
  audio.addEventListener("pause", function () {
    state.playing = false;
    state.time = audio.currentTime;
    saveState();
    updateUI();
    if (saveTimer) { clearInterval(saveTimer); saveTimer = null; }
  });
  audio.addEventListener("timeupdate", updateUI);
  audio.addEventListener("ended", function () {
    clearState();
    updateUI();
  });

  // Sauvegarde immédiate avant qu'une nouvelle page ne se charge, pour ne
  // perdre ni la position ni l'état lecture/pause pendant la transition.
  window.addEventListener("pagehide", function () {
    if (state.src) {
      state.time = audio.currentTime;
      saveState();
    }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden" && state.src) {
      state.time = audio.currentTime;
      saveState();
    }
  });

  /* ---------------- 8. Initialisation au chargement de CHAQUE page ---------------- */
  function init() {
    buildPlayer();
    loadState();
    if (state.src) {
      // On restaure la piste et la position ; si elle était en lecture,
      // on tente de reprendre automatiquement (peut être bloqué par le
      // navigateur selon sa politique d'autoplay — dans ce cas le
      // mini-player apparaît en pause, prêt à reprendre en un tap).
      loadTrack(state.src, state.title, state.time, state.playing);
    } else {
      updateUI();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
