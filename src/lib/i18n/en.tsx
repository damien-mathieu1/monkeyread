import { A, REPO_URL } from "@/components/layout/doc";
import type { Dict, DocSection } from "@/lib/i18n/fr";

type Node = React.ReactNode;

export const en: Dict = {
  common: {
    ok: "ok",
    save: "save",
    delete: "delete",
    loading: "loading...",
  },
  nav: {
    read: "read",
    library: "library",
    leaderboards: "leaderboards",
    about: "about",
    settings: "settings",
    login: "sign in",
    stats: "stats",
    publicProfile: "public profile",
    accountSettings: "account settings",
    logout: "sign out",
  },
  reader: {
    sample:
      "Reading fast is not a matter of talent, but of habit. When words arrive one at a time, in the same spot, your eyes no longer need to jump from one line to the next. They stay still, and your brain does the rest. The colored letter marks where your gaze naturally lands. Start slowly, around two hundred and fifty words per minute, then raise the speed little by little. You will be surprised how pleasant it becomes. When you are ready, paste your own text and start reading.",
    remaining: (time: Node) => <>{time} left</>,
    end: "the end.",
    punctuationPause: "punctuation pause",
    words: "words",
    text: "text",
    customSpeed: "speed (words/min)",
    customText: "custom text",
    pastePlaceholder: "paste your text here...",
    importFile: "import a file",
  },
  keys: {
    restart: "restart",
    space: "space",
    playPause: "play / pause",
    prevNext: "previous / next word",
    speed: "speed ±25",
    chunk: "words at once",
  },
  footer: {
    contact: "contact",
    support: "support",
    terms: "terms",
    security: "security",
    privacy: "privacy",
    contactBody: (security: Node) => (
      <>
        Everything goes through GitHub: for a question, an idea or a bug, open an issue and I will
        answer there. For a security issue, read the {security} page instead.
      </>
    ),
    question: "question",
    idea: "idea",
    bug: "bug",
    supportTitle: "support monkeyread",
    supportBody:
      "monkeyread is free, ad-free and will stay that way. To help: star the project, tell people about it, or support monkeytype, without which this site would not exist.",
    star: "GitHub star",
    share: "share",
  },
  settings: {
    sections: {
      behavior: "behavior",
      reading: "reading",
      sound: "sound",
      appearance: "appearance",
      theme: "theme",
      hideElements: "hide elements",
      dangerZone: "danger zone",
    },
    previewWord: "reading",
    language: { title: "language", description: "Language of the interface." },
    quickRestart: {
      title: "quick restart",
      description: "Restart reading from the beginning with tab or escape.",
    },
    punctuationPause: {
      title: "punctuation pause",
      description: "Stay longer on sentence ends and commas to give the meaning time to sink in.",
    },
    speed: { title: "speed", description: "Words shown per minute." },
    chunkSize: { title: "words at once", description: "Number of words shown at the same time." },
    highlight: {
      title: "highlighted letter",
      description: "Colors the letter your eye should land on.",
    },
    guides: {
      title: "guides",
      description: "Shows the lines and ticks that mark the fixation point.",
    },
    progress: {
      title: "progress",
      description: "How to show reading progress.",
      bar: "bar",
      text: "text",
    },
    volume: { title: "volume", description: "Volume of the sound played on each word." },
    sound: {
      title: "sound on each word",
      description: "Plays a short sound on each word shown, like a metronome.",
    },
    fontSize: { title: "font size", description: "Size of the words while reading." },
    font: { title: "font", description: "Font used across the app." },
    theme: { title: "theme", description: "Colors of the interface." },
    keyTips: {
      title: "keyboard shortcuts",
      description: "Shows the shortcuts at the bottom of the reading page.",
      hide: "hide",
      show: "show",
    },
    reset: {
      title: "reset settings",
      description: "Puts every setting back to its default value. Cannot be undone.",
      button: "reset",
    },
  },
  library: {
    title: "library",
    import: "import a book",
    intro:
      "PDF, EPUB or TXT. Books stay in your browser: nothing is sent to a server, and your reading position is kept so you can pick up where you left off.",
    empty: "no books yet",
    unknownAuthor: "unknown author",
    words: (n: string) => `${n} words`,
    read: "read",
    resume: "resume",
    importing: (name: string) => `importing ${name}...`,
    added: (name: string) => `${name} added`,
    errors: {
      noText: "no text found (a scanned PDF only contains images)",
      invalidEpub: "invalid epub",
      unreadable: "unreadable file",
    },
    deleteTitle: "delete book",
    deleteBody: (title: Node) => (
      <>Remove {title} from your library? Your reading position will be lost.</>
    ),
    freeTitle: "free books",
    freeIntro:
      "Sites where you can find public domain books, legally and for free. Prefer EPUB when available: the text comes out cleaner than from a PDF.",
    sources: {
      wikisource: "Thousands of proofread French works, downloadable as EPUB.",
      ebooksgratuits: "French public domain classics, carefully typeset.",
      bnr: "French-language public domain literature, as EPUB and PDF.",
      gutenberg: "Over 75,000 public domain books, mostly in English.",
      standardEbooks: "English public domain classics, carefully proofread.",
      gallica: "The French national library's collections. Many PDFs are scans without text.",
    },
  },
  login: {
    register: "register",
    username: "username",
    usernameRules: "3 to 20 characters: letters, digits, _ . -",
    password: "password",
    confirmPassword: "confirm password",
    signUp: "sign up",
    passwordMismatch: "passwords do not match",
    nameTaken: "username already taken",
    checkEmail: "check your email to confirm your account",
    signIn: "sign in",
    or: "or",
    signInButton: "sign in",
    forgot: "forgot password?",
    emailFirst: "enter your email first",
    resetSent: "password reset email sent",
    disabled: "Accounts are not configured on this instance.",
  },
  account: {
    editProfile: "edit profile",
    editIntro:
      "The username is changed in account settings. The avatar comes from your Google, GitHub or Discord account.",
    showActivity: "Show the activity grid on the public profile.",
    invalidLinks: "invalid value: check the links and the website (https://...)",
  },
  accountSettings: {
    tabs: { account: "account", auth: "authentication", danger: "danger zone" },
    rename: {
      title: "change username",
      description:
        "3 to 20 characters: letters, digits, _ . - The address of your public profile changes too.",
      button: "change",
      invalid: "username unavailable or invalid",
      done: "username updated",
    },
    password: {
      title: "password",
      description:
        "Set or change your account password. Also useful to sign in by email if you signed up with Google, GitHub or Discord.",
      placeholder: "new password",
      done: "password updated",
    },
    delete: {
      title: "delete account",
      description:
        "Deletes your account, profile, settings and your whole reading history. Cannot be undone.",
      confirm: (name: Node) => <>Type {name} to confirm. Your whole history will be lost.</>,
      button: "delete permanently",
    },
  },
  profile: {
    notFound: (name: string) => `no reader is called "${name}"`,
    website: "website",
    joined: (date: string) => `joined ${date}`,
    started: "readings started",
    completed: "readings finished",
    readingTime: "reading time",
    allTimeRanks: "all-time leaderboards",
    wordsRead: "words read",
    longestSession: "longest session",
    usualSpeed: "usual speed",
    wpm: "words/min",
    currentStreak: "current streak",
    bestStreak: "best streak",
    days: "days",
    activeDays: "active days",
  },
  activity: {
    summary: (n: string) => `last 12 months · ${n} readings`,
    less: "less",
    more: "more",
    none: "no reading",
    utc: "Days are counted in UTC.",
    months: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
  },
  history: {
    filters: "filters",
    periods: {
      day: "last day",
      week: "last week",
      month: "last month",
      quarter: "last 3 months",
      all: "all",
    },
    wordsRead: "words read",
    minutes: "minutes",
    summary: (words: string, time: string, perHour: string) =>
      `${words} words in ${time} · ${perHour} words per hour of reading`,
    columns: { date: "date", words: "words", duration: "duration", speed: "speed", text: "text" },
    finished: "finished",
    empty: "no reading in this period",
  },
  leaderboards: {
    periods: { all: "all time", week: "last 7 days", day: "last 24 hours" },
    metrics: { words: "words read", time: "reading time" },
    title: (what: string) => `leaderboard ${what}`,
    you: "you",
    words: (n: string) => `${n} words`,
    unranked: "not ranked yet",
    prevPage: "previous page",
    nextPage: "next page",
    page: (n: number) => `page ${n}`,
    columns: {
      name: "name",
      words: "words read",
      time: "time",
      sessions: "readings",
      lastRead: "last read",
    },
    empty: "nobody has read in this period yet",
  },
  docs: {
    about: [
      {
        title: "about",
        body: (
          <p>
            monkeyread is a speed reader: words scroll one at a time in the same spot, with a
            colored letter to rest your eyes on. Paste your text or import a book, pick your speed,
            and read.
          </p>
        ),
      },
      {
        title: "thanks monkeytype",
        body: (
          <>
            <p>
              The whole monkeyread experience comes from{" "}
              <A href="https://monkeytype.com">monkeytype</A>, the minimalist typing site created by
              Miodec and its community. The layout, the config bar, focus mode, the dialogs, the
              animations, the settings page and the idea of themes are all directly inspired by it.
            </p>
            <p>
              If you like monkeyread, go type on monkeytype, and support the project on{" "}
              <A href="https://github.com/monkeytypegame/monkeytype">GitHub</A>.
            </p>
          </>
        ),
      },
      {
        title: "themes",
        body: (
          <p>
            The serika dark, serika, nord and dracula palettes reuse the colors of the themes of the
            same name in monkeytype. Nord and dracula originally come from their own projects.
          </p>
        ),
      },
      {
        title: "notices",
        body: (
          <>
            <p>
              monkeyread is an independent project, not officially affiliated with monkeytype. No
              monkeytype code or audio file is reused: the interface is rewritten from scratch and
              the sounds are generated in the browser. Monkeytype is released under the GPL-3.0
              license.
            </p>
            <p>
              The texts and books you import stay in your browser. The only things sent to a server
              are your reading stats and settings if you have an account, and anonymous, cookie-free
              visits through Vercel Analytics.
            </p>
          </>
        ),
      },
    ] as DocSection[],
    terms: [
      {
        title: "terms of use",
        body: (
          <p>
            By using monkeyread, you accept these terms. They are short: the site is free, ad-free,
            and provided as is.
          </p>
        ),
      },
      {
        title: "your texts and books",
        body: (
          <p>
            You can read any text you have the right to use: your own, a book you own for personal
            use, or a public domain work. Imported files stay in your browser and are never sent or
            shared by monkeyread. You remain responsible for what you import.
          </p>
        ),
      },
      {
        title: "account",
        body: (
          <p>
            Accounts are optional. Your username and bio are public: no insults, no impersonation,
            no illegal content. You can delete your account and all its data at any time from
            account settings.
          </p>
        ),
      },
      {
        title: "leaderboards",
        body: (
          <p>
            Leaderboards count words actually shown. Inflating your stats with a script, by letting
            the reader run without reading, or by sending fake sessions is not allowed. The sessions
            and accounts involved may be removed without notice.
          </p>
        ),
      },
      {
        title: "warranty and license",
        body: (
          <p>
            monkeyread comes with no warranty: the service may change, stop or lose data. The source
            code is free, under the MIT license, on <A href={REPO_URL}>GitHub</A>. These terms may
            change; the online version is the one that applies.
          </p>
        ),
      },
    ] as DocSection[],
    security: [
      {
        title: "security",
        body: (
          <p>
            Found a vulnerability? Please report it privately before talking about it publicly, so
            it gets fixed before it can be exploited.
          </p>
        ),
      },
      {
        title: "report a vulnerability",
        body: (
          <p>
            Open a private report from the repository&apos;s security tab:{" "}
            <A href={`${REPO_URL}/security/advisories/new`}>report a vulnerability</A>. Describe the
            problem, how to reproduce it and its impact. Do not open a public issue for a
            vulnerability.
          </p>
        ),
      },
      {
        title: "rules",
        body: (
          <ul className="grid list-disc gap-2 pl-6">
            <li>Only test with your own account, never with other people&apos;s data.</li>
            <li>No denial of service, spam or large-scale automated testing.</li>
            <li>Do not keep or share any data obtained during your tests.</li>
          </ul>
        ),
      },
      {
        title: "what happens next",
        body: (
          <p>
            You will get an answer as soon as possible. monkeyread is a volunteer project with no
            bounty program, but every fixed report is credited if you wish.
          </p>
        ),
      },
    ] as DocSection[],
    privacy: [
      {
        title: "privacy",
        body: (
          <p>
            monkeyread collects as little as possible. Without an account, nothing personal leaves
            your browser.
          </p>
        ),
      },
      {
        title: "in your browser",
        body: (
          <p>
            Your settings, language and last reading are kept in the browser&apos;s local storage,
            and your books with their reading position in its IndexedDB database. They are never
            sent to a server. Clearing the site&apos;s data erases them.
          </p>
        ),
      },
      {
        title: "if you create an account",
        body: (
          <>
            <p>Accounts are optional. If you have one, Supabase stores:</p>
            <ul className="grid list-disc gap-2 pl-6">
              <li>
                your email, and if you use Google, GitHub or Discord, the name and avatar they
                provide;
              </li>
              <li>your username and the profile details you fill in, shown publicly;</li>
              <li>
                your reading sessions (date, duration, words read, speed), never the text read or
                the book title;
              </li>
              <li>your settings, so you get them back on all your devices.</li>
            </ul>
            <p>
              Your sign-in session is kept in the browser&apos;s local storage, without cookies.
              Your public stats (totals, leaderboards, activity if you show it) are visible to
              everyone.
            </p>
          </>
        ),
      },
      {
        title: "analytics",
        body: (
          <p>
            Visits are counted with Vercel Analytics: anonymous, cookie-free, no cross-site
            tracking. No ads, no data sold.
          </p>
        ),
      },
      {
        title: "your rights",
        body: (
          <p>
            You can edit your profile at any time, and delete your account from account settings:
            your profile, settings and whole history are erased immediately. For any other request,
            open an issue on <A href={`${REPO_URL}/issues`}>GitHub</A>.
          </p>
        ),
      },
      {
        title: "hosting",
        body: (
          <p>
            The site is hosted by Vercel, accounts and stats by Supabase. The code is public: you
            can check everything written here.
          </p>
        ),
      },
    ] as DocSection[],
  },
};
