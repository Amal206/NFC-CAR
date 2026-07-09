/* ==========================================================================
   دعاء — أذكار وأدعية | adhkar-data.js
   Fichier de données du système de rappels (popup d'adhkar).

   -> Pour AJOUTER un nouveau dhikr, il suffit de copier un objet ci-dessous
      et de le compléter. Rien d'autre à toucher : adhkar-popup.js lira
      automatiquement cette liste et en tirera un au hasard.

   Format de chaque entrée :
   {
     title: { ar: '...', fr: '...' },  // courte introduction / accroche
     text:  { ar: '...', fr: '...' }   // le dhikr / douâ lui-même
   }

   Ces adhkar sont volontairement généraux : ils conviennent à toute
   situation et à tout lieu (maison, bureau, déplacement, etc.), sans
   mention d'un contexte particulier.
   ========================================================================== */

window.ADHKAR_LIST = [
  {
    title: { ar: 'عطّر فمك بذكر الله', fr: 'Parfumez votre bouche par le rappel d\u2019Allah' },
    text: {
      ar: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.',
      fr: 'Il n\u2019y a de divinité qu\u2019Allah, Seul, sans associé. À Lui la royauté, à Lui la louange, et Il est capable de toute chose.'
    }
  },
  {
    title: { ar: 'سبحان الله وبحمده', fr: 'Gloire et louange à Allah' },
    text: {
      ar: 'سبحان الله وبحمده، سبحان الله العظيم.',
      fr: 'Gloire à Allah et à Lui la louange, gloire à Allah l\u2019Immense.'
    }
  },
  {
    title: { ar: 'الاستغفار', fr: 'La demande de pardon' },
    text: {
      ar: 'أستغفر الله العظيم الذي لا إله إلا هو، الحي القيوم، وأتوب إليه.',
      fr: 'Je demande pardon à Allah l\u2019Immense, il n\u2019y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même, et je me repens à Lui.'
    }
  },
  {
    title: { ar: 'الحمد لله', fr: 'La louange à Allah' },
    text: {
      ar: 'الحمد لله الذي بنعمته تتم الصالحات.',
      fr: 'Louange à Allah, par Sa grâce s\u2019accomplissent les bonnes œuvres.'
    }
  },
  {
    title: { ar: 'حسبنا الله ونعم الوكيل', fr: 'Allah nous suffit' },
    text: {
      ar: 'حسبنا الله ونعم الوكيل.',
      fr: 'Allah nous suffit, et quel excellent garant Il est.'
    }
  },
  {
    title: { ar: 'لا حول ولا قوة إلا بالله', fr: 'Nulle puissance ni force' },
    text: {
      ar: 'لا حول ولا قوة إلا بالله العلي العظيم.',
      fr: 'Il n\u2019y a de force ni de puissance qu\u2019en Allah, le Très-Haut, l\u2019Immense.'
    }
  },
  {
    title: { ar: 'التوكل على الله', fr: 'La confiance en Allah' },
    text: {
      ar: 'حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم.',
      fr: 'Allah me suffit, il n\u2019y a de divinité que Lui. En Lui je place ma confiance, et Il est le Seigneur du Trône immense.'
    }
  },
  {
    title: { ar: 'الباقيات الصالحات', fr: 'Les paroles qui demeurent' },
    text: {
      ar: 'سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر.',
      fr: 'Gloire à Allah, louange à Allah, il n\u2019y a de divinité qu\u2019Allah, Allah est le plus Grand.'
    }
  },
  {
    title: { ar: 'الصلاة على النبي ﷺ', fr: 'La prière sur le Prophète ﷺ' },
    text: {
      ar: 'اللهم صلِّ وسلم على نبينا محمد وعلى آله وصحبه أجمعين.',
      fr: 'Ô Allah, prie et accorde le salut sur notre Prophète Muhammad, sur sa famille et l\u2019ensemble de ses compagnons.'
    }
  },
  {
    title: { ar: 'طمأنينة القلب', fr: 'La sérénité du cœur' },
    text: {
      ar: 'اللهم إني أسألك طمأنينة القلب والرضا بالقضاء.',
      fr: 'Ô Allah, je Te demande la sérénité du cœur et l\u2019acceptation de ce que Tu as décrété.'
    }
  },
  {
    title: { ar: 'سيد الاستغفار', fr: 'Le maître de la demande de pardon' },
    text: {
      ar: 'اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.',
      fr: 'Ô Allah, Tu es mon Seigneur, il n\u2019y a de divinité que Toi. Tu m\u2019as créé et je suis Ton serviteur. Je m\u2019en tiens à mon engagement envers Toi autant que je le peux. Je me réfugie en Toi contre le mal de ce que j\u2019ai fait. Je reconnais Ton bienfait envers moi et je reconnais mon péché : pardonne-moi, car nul ne pardonne les péchés hormis Toi.'
    }
  },
  {
    title: { ar: 'الرزق الطيب', fr: 'La subsistance bonne' },
    text: {
      ar: 'اللهم اكفني بحلالك عن حرامك، وأغنني بفضلك عمن سواك.',
      fr: 'Ô Allah, suffis-moi par ce qui est licite en écartant l\u2019illicite, et rends-moi riche par Ta faveur en me passant de tout autre que Toi.'
    }
  },
  {
    title: { ar: 'حسن الخاتمة', fr: 'La bonne fin' },
    text: {
      ar: 'اللهم إني أسألك حسن الخاتمة.',
      fr: 'Ô Allah, je Te demande une belle fin.'
    }
  },
  {
    title: { ar: 'العافية', fr: 'Le bien-être et la protection' },
    text: {
      ar: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة.',
      fr: 'Ô Allah, je Te demande le pardon et la préservation ici-bas et dans l\u2019au-delà.'
    }
  },
  {
    title: { ar: 'شكر النعمة', fr: 'La gratitude pour le bienfait' },
    text: {
      ar: 'اللهم أعنّي على ذكرك وشكرك وحسن عبادتك.',
      fr: 'Ô Allah, aide-moi à T\u2019évoquer, à Te remercier et à T\u2019adorer avec excellence.'
    }
  },
  {
    title: { ar: 'تفريج الهمّ', fr: 'La dissipation du chagrin' },
    text: {
      ar: 'لا إله إلا أنت سبحانك إني كنت من الظالمين.',
      fr: 'Il n\u2019y a de divinité que Toi, gloire à Toi, j\u2019ai été du nombre des injustes envers moi-même.'
    }
  },
  {
    title: { ar: 'اليقين بالله', fr: 'La certitude en Allah' },
    text: {
      ar: 'يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.',
      fr: 'Ô Vivant, Ô Celui qui subsiste par Lui-même, c\u2019est par Ta miséricorde que j\u2019implore le secours. Rétablis toute mon affaire et ne me confie pas à moi-même, ne serait-ce qu\u2019un clin d\u2019œil.'
    }
  },
  {
    title: { ar: 'دوام الذكر', fr: 'La constance du rappel' },
    text: {
      ar: 'من قال: سبحان الله وبحمده، في يوم مائة مرة، حُطّت خطاياه ولو كانت مثل زبد البحر.',
      fr: 'Celui qui dit « Gloire à Allah et à Lui la louange » cent fois par jour, ses péchés lui sont effacés, fussent-ils comme l\u2019écume de la mer.'
    }
  }
];
