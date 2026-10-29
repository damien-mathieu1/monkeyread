import { A, REPO_URL } from "@/components/layout/doc";

type Node = React.ReactNode;
export type DocSection = { title: string; body: Node };

export const fr = {
  common: {
    ok: "ok",
    save: "enregistrer",
    delete: "supprimer",
    loading: "chargement...",
  },
  nav: {
    read: "lecture",
    library: "bibliothèque",
    leaderboards: "classements",
    about: "à propos",
    settings: "réglages",
    login: "connexion",
    stats: "statistiques",
    publicProfile: "profil public",
    accountSettings: "paramètres du compte",
    logout: "déconnexion",
  },
  reader: {
    sample:
      "Lire vite n'est pas une question de talent, mais d'habitude. Quand les mots arrivent un par un, au même endroit, tes yeux n'ont plus besoin de sauter d'une ligne à l'autre. Ils restent immobiles, et ton cerveau fait le reste. La lettre colorée marque le point où le regard se pose naturellement. Commence doucement, autour de deux cent cinquante mots par minute, puis augmente la vitesse petit à petit. Tu seras surpris de voir à quel point cela devient agréable. Quand tu es prêt, colle ton propre texte et lance la lecture.",
    remaining: (time: Node) => <>encore {time}</>,
    end: "fin.",
    punctuationPause: "pause ponctuation",
    words: "mots",
    text: "texte",
    customSpeed: "vitesse (mots/min)",
    customText: "texte personnalisé",
    pastePlaceholder: "colle ton texte ici...",
    importFile: "importer un fichier",
  },
  keys: {
    restart: "recommencer",
    space: "espace",
    playPause: "lecture / pause",
    prevNext: "mot précédent / suivant",
    skip: (s: number) => `−/+ ${s} s`,
    speed: "vitesse ±25",
    chunk: "mots groupés",
  },
  footer: {
    contact: "contact",
    support: "soutenir",
    terms: "conditions",
    security: "sécurité",
    privacy: "confidentialité",
    contactBody: (security: Node) => (
      <>
        Tout passe par GitHub : une question, une idée ou un bug, ouvre un ticket et je réponds
        là-bas. Pour une faille de sécurité, lis plutôt la page {security}.
      </>
    ),
    question: "question",
    idea: "idée",
    bug: "bug",
    supportTitle: "soutenir monkeyread",
    supportBody:
      "monkeyread est gratuit, sans pub et le restera. Pour aider : mets une étoile au projet, parles-en autour de toi, ou soutiens monkeytype, sans qui ce site n'existerait pas.",
    star: "étoile GitHub",
    share: "partager",
  },
  settings: {
    sections: {
      behavior: "comportement",
      reading: "lecture",
      sound: "son",
      appearance: "apparence",
      theme: "thème",
      hideElements: "masquer des éléments",
      dangerZone: "zone dangereuse",
    },
    previewWord: "lecture",
    language: { title: "langue", description: "Langue de l'interface." },
    quickRestart: {
      title: "recommencer rapidement",
      description: "Recommence la lecture depuis le début avec tab ou échap.",
    },
    punctuationPause: {
      title: "pause ponctuation",
      description:
        "Reste plus longtemps sur les fins de phrase et les virgules pour laisser le temps au sens de se poser.",
    },
    speed: { title: "vitesse", description: "Nombre de mots affichés par minute." },
    chunkSize: { title: "mots groupés", description: "Nombre de mots affichés en même temps." },
    skipSeconds: {
      title: "saut en secondes",
      description: "Durée de lecture sautée en arrière ou en avant avec j et l.",
    },
    highlight: {
      title: "lettre mise en avant",
      description: "Colore la lettre sur laquelle l'œil doit se poser.",
    },
    guides: {
      title: "repères",
      description: "Affiche les lignes et les traits qui marquent le point de fixation.",
    },
    animateNumbers: {
      title: "chiffres animés",
      description: "Fait rouler les chiffres du compteur et du temps restant quand ils changent.",
    },
    progress: {
      title: "progression",
      description: "Comment afficher l'avancement de la lecture.",
      bar: "barre",
      text: "texte",
    },
    volume: { title: "volume", description: "Volume du son joué à chaque mot." },
    sound: {
      title: "son à chaque mot",
      description: "Joue un petit son à chaque mot affiché, comme un métronome.",
    },
    fontSize: { title: "taille du texte", description: "Taille des mots pendant la lecture." },
    font: { title: "police", description: "Police utilisée dans toute l'app." },
    theme: { title: "thème", description: "Couleurs de l'interface." },
    keyTips: {
      title: "raccourcis clavier",
      description: "Affiche les raccourcis en bas de la page de lecture.",
      hide: "masquer",
      show: "afficher",
    },
    reset: {
      title: "réinitialiser les réglages",
      description: "Remet tous les réglages à leur valeur par défaut. Irréversible.",
      button: "réinitialiser",
    },
  },
  library: {
    title: "bibliothèque",
    import: "importer un livre",
    intro:
      "PDF, EPUB ou TXT. Les livres restent dans ton navigateur : rien n'est envoyé sur un serveur, et ta position de lecture est gardée pour reprendre là où tu t'es arrêté.",
    empty: "aucun livre pour l'instant",
    unknownAuthor: "auteur inconnu",
    words: (n: string) => `${n} mots`,
    read: "lire",
    resume: "reprendre",
    importing: (name: string) => `import de ${name}...`,
    added: (name: string) => `${name} ajouté`,
    errors: {
      noText: "aucun texte trouvé (un PDF scanné ne contient que des images)",
      invalidEpub: "epub invalide",
      unreadable: "fichier illisible",
    },
    deleteTitle: "supprimer le livre",
    deleteBody: (title: Node) => (
      <>Retirer {title} de ta bibliothèque ? Ta position de lecture sera perdue.</>
    ),
    freeTitle: "livres gratuits",
    freeIntro:
      "Des sites où trouver des livres du domaine public, légalement et gratuitement. Préfère l'EPUB quand il existe : le texte en sort plus propre qu'un PDF.",
    sources: {
      wikisource: "Des milliers d'œuvres françaises relues, téléchargeables en EPUB.",
      ebooksgratuits: "Classiques français du domaine public, mis en page avec soin.",
      bnr: "Littérature francophone du domaine public, en EPUB et PDF.",
      gutenberg: "Plus de 75 000 livres du domaine public, surtout en anglais.",
      standardEbooks: "Classiques anglais du domaine public, soigneusement corrigés.",
      gallica: "Les collections de la BnF. Beaucoup de PDF sont des scans sans texte.",
    },
  },
  login: {
    register: "inscription",
    username: "pseudo",
    usernameRules: "3 à 20 caractères : lettres, chiffres, _ . -",
    password: "mot de passe",
    confirmPassword: "confirme le mot de passe",
    signUp: "s'inscrire",
    passwordMismatch: "les mots de passe diffèrent",
    nameTaken: "pseudo déjà pris",
    checkEmail: "vérifie tes emails pour confirmer le compte",
    signIn: "connexion",
    or: "ou",
    signInButton: "se connecter",
    forgot: "mot de passe oublié ?",
    emailFirst: "entre ton email d'abord",
    resetSent: "email de réinitialisation envoyé",
    disabled: "Les comptes ne sont pas configurés sur cette instance.",
  },
  account: {
    editProfile: "modifier le profil",
    editIntro:
      "Le pseudo se change dans les paramètres du compte. L'avatar vient de ton compte Google, GitHub ou Discord.",
    showActivity: "Afficher la grille d'activité sur le profil public.",
    invalidLinks: "valeur invalide : vérifie les liens et le site (https://...)",
  },
  accountSettings: {
    tabs: { account: "compte", auth: "authentification", danger: "zone dangereuse" },
    rename: {
      title: "changer de pseudo",
      description:
        "3 à 20 caractères : lettres, chiffres, _ . - L'adresse de ton profil public change aussi.",
      button: "changer",
      invalid: "pseudo indisponible ou invalide",
      done: "pseudo mis à jour",
    },
    password: {
      title: "mot de passe",
      description:
        "Définis ou change le mot de passe de ton compte. Utile aussi pour te connecter par email si tu t'es inscrit avec Google, GitHub ou Discord.",
      placeholder: "nouveau mot de passe",
      done: "mot de passe mis à jour",
    },
    delete: {
      title: "supprimer le compte",
      description:
        "Supprime ton compte, ton profil, tes réglages et tout ton historique de lecture. Irréversible.",
      confirm: (name: Node) => <>Tape {name} pour confirmer. Tout ton historique sera perdu.</>,
      button: "supprimer définitivement",
    },
  },
  profile: {
    notFound: (name: string) => `aucun lecteur ne s'appelle « ${name} »`,
    website: "site",
    joined: (date: string) => `inscrit le ${date}`,
    started: "lectures lancées",
    completed: "lectures finies",
    readingTime: "temps de lecture",
    allTimeRanks: "classements de tous les temps",
    wordsRead: "mots lus",
    longestSession: "plus longue session",
    usualSpeed: "vitesse habituelle",
    wpm: "mots/min",
    currentStreak: "série en cours",
    bestStreak: "meilleure série",
    days: "jours",
    activeDays: "jours actifs",
  },
  activity: {
    summary: (n: string) => `12 derniers mois · ${n} lectures`,
    less: "moins",
    more: "plus",
    none: "aucune lecture",
    utc: "Les jours sont comptés en heure UTC.",
    months: ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"],
  },
  history: {
    filters: "filtres",
    periods: {
      day: "dernier jour",
      week: "dernière semaine",
      month: "dernier mois",
      quarter: "3 derniers mois",
      all: "tout",
    },
    wordsRead: "mots lus",
    minutes: "minutes",
    summary: (words: string, time: string, perHour: string) =>
      `${words} mots en ${time} · ${perHour} mots par heure de lecture`,
    columns: { date: "date", words: "mots", duration: "durée", speed: "vitesse", text: "texte" },
    finished: "fini",
    empty: "aucune lecture sur cette période",
  },
  leaderboards: {
    periods: { all: "tous les temps", week: "7 derniers jours", day: "24 dernières heures" },
    metrics: { words: "mots lus", time: "temps de lecture" },
    title: (what: string) => `classement ${what}`,
    you: "toi",
    words: (n: string) => `${n} mots`,
    unranked: "pas encore classé",
    prevPage: "page précédente",
    nextPage: "page suivante",
    page: (n: number) => `page ${n}`,
    columns: {
      name: "nom",
      words: "mots lus",
      time: "temps",
      sessions: "lectures",
      lastRead: "dernière lecture",
    },
    empty: "personne n'a encore lu sur cette période",
  },
  docs: {
    about: [
      {
        title: "à propos",
        body: (
          <p>
            monkeyread est un lecteur rapide : les mots défilent un par un au même endroit, avec une
            lettre colorée pour poser le regard. Colle ton texte ou importe un livre, choisis ta
            vitesse, et lis.
          </p>
        ),
      },
      {
        title: "merci monkeytype",
        body: (
          <>
            <p>
              Toute l&apos;expérience de monkeyread vient de{" "}
              <A href="https://monkeytype.com">monkeytype</A>, le site de dactylographie minimaliste
              créé par Miodec et sa communauté. La mise en page, la barre de configuration, le mode
              focus, les modales, les animations, la page de réglages et l&apos;idée des thèmes en
              sont directement inspirés.
            </p>
            <p>
              Si tu aimes monkeyread, va taper sur monkeytype, et soutiens le projet sur{" "}
              <A href="https://github.com/monkeytypegame/monkeytype">GitHub</A>.
            </p>
          </>
        ),
      },
      {
        title: "thèmes",
        body: (
          <p>
            Les palettes serika dark, serika, nord et dracula reprennent les couleurs des thèmes du
            même nom dans monkeytype. Nord et dracula sont à l&apos;origine des palettes de leurs
            projets respectifs.
          </p>
        ),
      },
      {
        title: "mentions",
        body: (
          <>
            <p>
              monkeyread est un projet indépendant, sans lien officiel avec monkeytype. Aucun code
              ni fichier audio de monkeytype n&apos;est réutilisé : l&apos;interface est réécrite de
              zéro et les sons sont générés dans le navigateur. Monkeytype est distribué sous
              licence GPL-3.0.
            </p>
            <p>
              Les textes et livres que tu importes restent dans ton navigateur. Seuls partent vers
              un serveur tes statistiques de lecture et tes réglages si tu as un compte, et des
              visites anonymes, sans cookie, via Vercel Analytics.
            </p>
          </>
        ),
      },
    ] as DocSection[],
    terms: [
      {
        title: "conditions d'utilisation",
        body: (
          <p>
            En utilisant monkeyread, tu acceptes ces conditions. Elles sont courtes : le site est
            gratuit, sans pub, et fourni tel quel.
          </p>
        ),
      },
      {
        title: "tes textes et tes livres",
        body: (
          <p>
            Tu peux lire n&apos;importe quel texte que tu as le droit d&apos;utiliser : le tien, un
            livre que tu possèdes pour ton usage personnel, ou une œuvre du domaine public. Les
            fichiers importés restent dans ton navigateur et ne sont jamais envoyés ni partagés par
            monkeyread. Tu restes responsable de ce que tu importes.
          </p>
        ),
      },
      {
        title: "compte",
        body: (
          <p>
            Le compte est facultatif. Ton pseudo et ta bio sont publics : pas d&apos;insulte, pas
            d&apos;usurpation d&apos;identité, pas de contenu illégal. Tu peux supprimer ton compte
            et toutes ses données à tout moment depuis les paramètres du compte.
          </p>
        ),
      },
      {
        title: "classements",
        body: (
          <p>
            Les classements comptent les mots réellement affichés. Gonfler ses statistiques avec un
            script, en laissant tourner la lecture sans lire, ou en envoyant de fausses sessions
            n&apos;est pas autorisé. Les sessions et comptes concernés peuvent être retirés sans
            préavis.
          </p>
        ),
      },
      {
        title: "garantie et licence",
        body: (
          <p>
            monkeyread est fourni sans garantie : le service peut changer, s&apos;interrompre ou
            perdre des données. Le code source est libre, sous licence MIT, sur{" "}
            <A href={REPO_URL}>GitHub</A>. Ces conditions peuvent évoluer ; la version en ligne est
            celle qui s&apos;applique.
          </p>
        ),
      },
    ] as DocSection[],
    security: [
      {
        title: "sécurité",
        body: (
          <p>
            Tu as trouvé une faille ? Merci de la signaler en privé avant d&apos;en parler
            publiquement, pour qu&apos;elle soit corrigée avant d&apos;être exploitée.
          </p>
        ),
      },
      {
        title: "signaler une faille",
        body: (
          <p>
            Ouvre un signalement privé depuis l&apos;onglet sécurité du dépôt :{" "}
            <A href={`${REPO_URL}/security/advisories/new`}>signaler une vulnérabilité</A>. Décris
            le problème, comment le reproduire et son impact. N&apos;ouvre pas de ticket public pour
            une faille.
          </p>
        ),
      },
      {
        title: "règles",
        body: (
          <ul className="grid list-disc gap-2 pl-6">
            <li>Teste uniquement avec ton propre compte, jamais avec les données des autres.</li>
            <li>Pas de déni de service, de spam ni de test automatisé massif.</li>
            <li>Ne garde ni ne partage aucune donnée obtenue pendant tes tests.</li>
          </ul>
        ),
      },
      {
        title: "suite",
        body: (
          <p>
            Tu reçois une réponse dès que possible. monkeyread est un projet bénévole, sans
            programme de récompense, mais chaque signalement corrigé est crédité si tu le souhaites.
          </p>
        ),
      },
    ] as DocSection[],
    privacy: [
      {
        title: "confidentialité",
        body: (
          <p>
            monkeyread collecte le moins possible. Sans compte, rien de personnel ne quitte ton
            navigateur.
          </p>
        ),
      },
      {
        title: "dans ton navigateur",
        body: (
          <p>
            Tes réglages, ta langue et ta dernière lecture sont gardés dans le stockage local du
            navigateur, et tes livres avec ta position de lecture dans sa base IndexedDB. Ils ne
            sont jamais envoyés à un serveur. Vider les données du site les efface.
          </p>
        ),
      },
      {
        title: "si tu crées un compte",
        body: (
          <>
            <p>Le compte est facultatif. S&apos;il existe, sont enregistrés chez Supabase :</p>
            <ul className="grid list-disc gap-2 pl-6">
              <li>
                ton email, et si tu passes par Google, GitHub ou Discord, le nom et l&apos;avatar
                qu&apos;ils fournissent ;
              </li>
              <li>ton pseudo et les infos de profil que tu remplis, visibles publiquement ;</li>
              <li>
                tes sessions de lecture (date, durée, mots lus, vitesse), jamais le texte lu ni le
                titre du livre ;
              </li>
              <li>tes réglages, pour les retrouver sur tous tes appareils.</li>
            </ul>
            <p>
              Ta session de connexion est gardée dans le stockage local du navigateur, sans cookie.
              Tes statistiques publiques (totaux, classements, activité si tu l&apos;affiches) sont
              visibles par tous.
            </p>
          </>
        ),
      },
      {
        title: "mesure d'audience",
        body: (
          <p>
            Les visites sont comptées avec Vercel Analytics : anonyme, sans cookie, sans suivi
            d&apos;un site à l&apos;autre. Aucune pub, aucune donnée vendue.
          </p>
        ),
      },
      {
        title: "tes droits",
        body: (
          <p>
            Tu peux modifier ton profil à tout moment, et supprimer ton compte depuis les paramètres
            du compte : ton profil, tes réglages et tout ton historique sont effacés immédiatement.
            Pour toute autre demande, ouvre un ticket sur <A href={`${REPO_URL}/issues`}>GitHub</A>.
          </p>
        ),
      },
      {
        title: "hébergement",
        body: (
          <p>
            Le site est hébergé par Vercel, les comptes et statistiques par Supabase. Le code est
            public : tu peux vérifier tout ce qui est écrit ici.
          </p>
        ),
      },
    ] as DocSection[],
  },
};

export type Dict = typeof fr;
