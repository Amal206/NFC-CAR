/* ==========================================================================
   دعاء — أذكار وأدعية | i18n.js
   Système de traduction Arabe / Français.
   - Langue stockée dans localStorage ('site_lang'), lue en tête de chaque
     page (voir le petit script inline dans <head>) pour fixer lang/dir
     avant l'affichage et éviter un effet de clignotement RTL/LTR.
   - Ce fichier applique ensuite la traduction complète des textes annotés
     avec data-i18n / data-i18n-html / data-i18n-aria, et gère le bouton
     de changement de langue.
   - Un évènement "sitelangchange" est diffusé à chaque changement, afin
     que script.js puisse rafraîchir les titres des pistes audio (qui
     utilisent leurs propres attributs data-title-ar / data-title-fr).
   ========================================================================== */

(function(){

  /* -------------------- Dictionnaire -------------------- */
  var DICT = {
    // Marque / navigation commune
    'brand.tagline':        { ar:'أذكار وأدعية', fr:'Adhkar & Douas' },
    'nav.home':              { ar:'الرئيسية', fr:'Accueil' },
    'nav.about':             { ar:'من نحن', fr:'À propos' },
    'nav.quran':             { ar:'قرآن كريم', fr:'Coran' },
    'nav.safar':             { ar:'دعاء السفر', fr:'Douâ du voyage' },
    'btn.back_home':         { ar:'العودة للرئيسية', fr:"Retour à l'accueil" },

    // Badges
    'badge.no_app':          { ar:'بدون تطبيق', fr:'Sans application' },
    'badge.nfc':              { ar:'تقنية NFC سهلة', fr:'Technologie NFC simple' },
    'badge.devices':          { ar:'يعمل مع iPhone و Android', fr:'Fonctionne avec iPhone et Android' },
    'badge.everywhere':       { ar:'مناسب لكل مكان', fr:'Adapté à tous les lieux' },

    // Note / footer
    'note.text':              { ar:'ملاحظة: يحتاج اتصال إنترنت خفيف لتشغيل المحتوى الصوتي.', fr:'Remarque : une connexion internet légère est nécessaire pour lire le contenu audio.' },
    'footer.copyright':      { ar:'© دعاء — أذكار وأدعية', fr:'© دعاء — Adhkar & Douas' },

    // Section commande
    'order.title':            { ar:'تحب تطلب بطاقة دعاء NFC؟', fr:'Vous voulez commander une carte دعاء NFC ?' },
    'order.text':              { ar:'بطاقة أنيقة تضعها أينما تشاء، تفتح لك هذا العالم بلمسة واحدة.', fr:'Une carte élégante à placer où vous le souhaitez, qui ouvre cet univers en une seule touche.' },
    'order.btn':                { ar:'اطلب توا', fr:'Commander maintenant' },
    'order.pending_alert':    { ar:'رابط الطلب سيتم إضافته قريباً.', fr:'Le lien de commande sera ajouté prochainement.' },

    // Accessibilité
    'aria.lang_switch':       { ar:'تغيير اللغة', fr:'Changer de langue' },
    'aria.play':               { ar:'تشغيل', fr:'Lecture' },
    'aria.pause':              { ar:'إيقاف', fr:'Pause' },
    'aria.prev':                { ar:'السابق', fr:'Précédent' },
    'aria.next':                { ar:'التالي', fr:'Suivant' },

    // Accueil
    'home.eyebrow':           { ar:'تقنية NFC للجميع', fr:'Technologie NFC pour tous' },
    'home.title':              { ar:'أذكار وأدعية', fr:'Adhkar & Douas' },
    'home.lead':               { ar:'أينما كنت… قرّب هاتفك واستمع لذكر يطمّن قلبك.', fr:'Où que vous soyez… approchez votre téléphone et écoutez une invocation qui apaise le cœur.' },
    'home.card.rokoub.label': { ar:'دعاء الركوب', fr:'Douâ de la monture' },
    'home.card.rokoub.sub':   { ar:'قبل الانطلاق', fr:'Avant de partir' },
    'home.card.sabah.label':  { ar:'أذكار الصباح', fr:'Adhkar du matin' },
    'home.card.sabah.sub':    { ar:'ابدأ يومك بسكينة', fr:'Commencez la journée sereinement' },
    'home.card.doukhoul-khourouj.label': { ar:'دعاء الدخول والخروج', fr:'Douâ d\u2019entrée et de sortie' },
    'home.card.doukhoul-khourouj.sub':   { ar:'حصن نفسك', fr:'Une protection au quotidien' },
    'home.card.taysir.label': { ar:'دعاء التيسير', fr:'Douâ de la facilité' },
    'home.card.tay.sub':      { ar:'لتيسير الأمور', fr:'Pour faciliter vos affaires' },
    'home.card.massa.label':  { ar:'أذكار المساء', fr:'Adhkar du soir' },
    'home.card.massa.sub':    { ar:'اختم نهارك بذكر', fr:'Terminez la journée en beauté' },
    'home.card.safar.label':  { ar:'دعاء السفر', fr:'Douâ du voyage' },
    'home.card.safar.sub':    { ar:'لرحلة مطمئنة', fr:'Pour un trajet serein' },
    'home.card.rezek.label':  { ar:'دعاء الرزق', fr:'Douâ de la subsistance' },
    'home.card.rezek.sub':    { ar:'الدعاء هو مفتاح الرزق', fr:'L\u2019invocation, clé de la subsistance' },
    'home.card.quran.label':  { ar:'قرآن كريم', fr:'Coran' },
    'home.card.quran.sub':    { ar:'تلاوات هادئة لكل وقت', fr:'Récitations apaisantes à tout moment' },

    // À propos
    'about.eyebrow':           { ar:'فكرتنا', fr:'Notre idée' },
    'about.title':             { ar:'من نحن', fr:'À propos' },
    'about.lead':              { ar:'"دعاء" بطاقة NFC صغيرة يمكنك وضعها أينما تشاء، وبلمسة هاتف واحدة تفتح لك عالماً من الأذكار والدعاء والتلاوات الهادئة، دون أي تطبيق يُثقل هاتفك.', fr:'« دعاء » est une petite carte NFC que vous pouvez placer où vous le souhaitez. En une seule touche de votre téléphone, elle ouvre un univers d\u2019invocations, de douas et de récitations apaisantes, sans aucune application à installer.' },
    'about.how_title':        { ar:'كيف تعمل؟', fr:'Comment ça marche ?' },
    'about.how_text':         { ar:'قرّب هاتفك من البطاقة، تُفتح هذه الصفحة تلقائياً، تختار ما يناسب لحظتك، وتضغط زر التشغيل لتستمع.', fr:'Approchez votre téléphone de la carte : cette page s\u2019ouvre automatiquement, choisissez ce qui correspond à votre moment, puis appuyez sur le bouton de lecture pour écouter.' },
    'about.gallery_title':    { ar:'لمحة عن التطبيق', fr:'Aperçu de l\u2019application' },
    'about.gallery_ph':       { ar:'أضف صورة هنا', fr:'Ajoutez une image ici' },

    // دعاء الركوب
    'rokoub.eyebrow':          { ar:'قبل الانطلاق', fr:'Avant de démarrer' },
    'rokoub.title':            { ar:'دعاء الركوب', fr:'Douâ de la monture' },
    'rokoub.lead':             { ar:'سُنّة نبوية جميلة تُقال عند ركوب أي وسيلة نقل، تذكّرك بنعمة التسخير وتطمئن قلبك قبل الانطلاق.', fr:'Une belle sunna prophétique à réciter en montant dans tout moyen de transport : elle rappelle le bienfait d\u2019être porté et apaise le cœur avant de partir.' },
    'rokoub.gloss':            { ar:'معنى الدعاء: تسبيح لله الذي يسّر لنا وسيلة النقل، مع توكّل على الله في مآل رحلتنا.', fr:'Signification : une glorification de Dieu qui a facilité pour nous ce moyen de transport, avec un abandon confiant de notre trajet à Lui.' },

    // أذكار الصباح
    'sabah.eyebrow':           { ar:'بداية اليوم', fr:'Le début de la journée' },
    'sabah.title':             { ar:'أذكار الصباح', fr:'Adhkar du matin' },
    'sabah.lead':              { ar:'ابدأ صباحك بذكر يطمّن قلبك.', fr:'Commencez votre matinée par une invocation qui apaise le cœur.' },

    // أذكار المساء
    'massa.eyebrow':           { ar:'ختام اليوم', fr:'La fin de la journée' },
    'massa.title':             { ar:'أذكار المساء', fr:'Adhkar du soir' },
    'massa.lead':              { ar:'اختم نهارك بذكر وسكينة.', fr:'Terminez votre journée dans le rappel et la sérénité.' },

    // دعاء السفر
    'safar.eyebrow':           { ar:'لرحلة مطمئنة', fr:'Pour un trajet serein' },
    'safar.title':             { ar:'دعاء السفر', fr:'Douâ du voyage' },
    'safar.lead':              { ar:'مهما طال الطريق أو قصُر، اجعل انطلاقتك بذكر يحفظك ويؤنس وحدتك.', fr:'Que la route soit longue ou courte, commencez-la par une invocation qui vous protège et adoucit la solitude du chemin.' },

    // قرآن كريم
    'quran.eyebrow':           { ar:'تلاوات هادئة', fr:'Récitations apaisantes' },
    'quran.title':             { ar:'قرآن كريم', fr:'Coran' },
    'quran.lead':              { ar:'اختر تلاوة تناسب حالك، واتركها ترافقك في كل وقت.', fr:'Choisissez une récitation qui vous correspond, et laissez-la vous accompagner à tout moment.' }
  };

  /* -------------------- Utilitaires -------------------- */
  function getLang(){
    try{
      return localStorage.getItem('site_lang') || 'ar';
    }catch(e){ return 'ar'; }
  }

  function setLang(lang){
    try{ localStorage.setItem('site_lang', lang); }catch(e){}
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'fr') ? 'ltr' : 'rtl';
  }

  function t(key, lang){
    var entry = DICT[key];
    if(!entry) return null;
    return entry[lang] != null ? entry[lang] : entry.ar;
  }

  function applyTranslations(lang){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var val = t(el.getAttribute('data-i18n'), lang);
      if(val != null) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var val = t(el.getAttribute('data-i18n-html'), lang);
      if(val != null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el){
      var val = t(el.getAttribute('data-i18n-aria'), lang);
      if(val != null) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      var val = t(el.getAttribute('data-i18n-placeholder'), lang);
      if(val != null) el.setAttribute('data-placeholder-label', val);
    });
    // Bouton de langue : affiche la langue VERS laquelle on va basculer
    document.querySelectorAll('[data-lang-toggle] [data-lang-label]').forEach(function(el){
      el.textContent = (lang === 'ar') ? 'FR' : 'ع';
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function(btn){
      var ariaVal = t('aria.lang_switch', lang);
      if(ariaVal) btn.setAttribute('aria-label', ariaVal);
    });

    // Prévient le reste du site (lecteurs playlist, etc.)
    document.dispatchEvent(new CustomEvent('sitelangchange', { detail:{ lang: lang } }));
  }

  function initLanguageSwitch(){
    var lang = getLang();
    setLang(lang);
    applyTranslations(lang);

    document.querySelectorAll('[data-lang-toggle]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var current = getLang();
        var next = (current === 'ar') ? 'fr' : 'ar';
        setLang(next);
        applyTranslations(next);
      });
    });
  }

  // API exposée pour script.js (titres de pistes bilingues, etc.)
  window.siteI18n = {
    getLang: getLang,
    t: t
  };

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initLanguageSwitch);
  } else {
    initLanguageSwitch();
  }

})();
