# Tomorrow's Class

"Know what you're teaching tomorrow. Be ready tonight."

A mobile-first PWA for GES-aligned lesson prep. Add your classes with the exact days each one runs, optionally track a term-by-term Scheme of Work, and prepare each lesson with AI — Strand, Sub-strand, Content Standard, Indicator, and full Starter/Main/Plenary phases, in the format expected of an official GES lesson note.

## How to use it

1. **Add your classes.** Tap the list icon ("My classes") and add each one — pick exactly which days it runs. A computing-only teacher adds one class; a Mon/Wed/Fri part-timer picks just those three days.
2. **Set your term (optional but recommended).** In Settings, choose the current term (1/2/3) and the date it started. This is how the app knows which Scheme of Work week tomorrow falls in.
3. **Add a Scheme of Work (optional).** Edit a class → "Manage Scheme of Work" → add each week's topic (and Strand/Sub-strand/Content Standard/Indicator if you have them) for the term. Tomorrow's lesson picks up the matching week's topic automatically; a "Use this" prompt appears if you update the Scheme of Work after a lesson was already created.
4. **Connect AI once.** The first time you tap "Prepare with AI," you'll be asked for a Groq API key. It's saved in this browser's local storage, per device.
5. **Prepare a lesson.** Open a lesson and tap **Prepare with AI** for a full, detailed, GES-aligned draft, or **10 min** when you're short on time.
6. **Refine anything.** Edit a field directly, or type an instruction into "Ask AI to adjust this" to rewrite just that part — it streams in live.
7. **Back it up.** Everything lives only in this browser. Download a backup from Settings occasionally (Export) and keep the file somewhere safe; Import restores from it on a new device or after clearing browser data.

This guide is also built into the app — tap the **?** icon on the Tomorrow screen.

## Run it locally

Requires Node.js 18+.

```
npm install
npm start
```

Opens at http://localhost:3000. Service workers only activate in production builds — use `npm run build` + a static server to test installability and offline caching.

## AI setup

**In-app (recommended).** Tap the gear icon, paste a Groq key. Stored in `localStorage`, per browser/device — never bundled into the app's code, never sent anywhere except Groq's API.

**Build-time `.env` (local dev convenience only).**
```
cp .env.example .env
# edit .env and set REACT_APP_GROQ_API_KEY=gsk_...
npm start
```
⚠️ Don't rely on this for a public deployment — `REACT_APP_*` variables are baked into the public JS bundle, readable by anyone.

**If AI requests fail:** the app tries a short list of Groq models in order (in case one is renamed or retired) and shows the real error — invalid/expired key, rate limit, or network issue — rather than a generic failure message. For a production deployment serving other people, the more robust long-term fix is a small backend/serverless function holding the key server-side, so it never reaches the browser.

## On data safety — what actually protects your data

Classes, lesson content, and term settings are saved in this browser's `localStorage`, and the app asks the browser to protect that storage from automatic eviction under space pressure (`navigator.storage.persist()`).

Being direct about the limits of that: **no purely client-side storage survives the person manually clearing their browser's site data** — localStorage, IndexedDB, anything — because that's what "clear site data" is specifically designed to wipe. Switching to IndexedDB wouldn't change that; both are cleared together. The one thing that genuinely protects against this is the **Export/Import backup** in Settings — download a JSON backup occasionally and keep it somewhere else (email, Drive). The real long-term fix would be an account + cloud sync, which needs a backend and is a bigger step than this project currently takes.

The Groq API key is deliberately left out of backups — re-enter it per device rather than have it sit in a plaintext file.

## Build & deploy

```
npm run build
```

Outputs a static `build/` folder — host anywhere serving static files over HTTPS (Netlify, Vercel, GitHub Pages, Cloudflare Pages). HTTPS is required for the service worker and "Add to Home Screen."

```
npx serve -s build   # test the production build locally
```

## Installing as an app

- **Android / desktop Chrome:** the app's own "Install" banner, or the browser's install icon in the address bar.
- **iOS Safari:** Share → Add to Home Screen (no `beforeinstallprompt` support on iOS).

## Project structure

```
public/
  index.html, manifest.json, service-worker.js, icons/
src/
  App.jsx                    – root: state, persistence, auto-generates tomorrow's lessons, modals
  components/
    Landing.jsx                 – one-time welcome screen
    Home.jsx                     – tomorrow's lessons (filtered by weekday), empty states
    LessonWorkspace.jsx          – GES detail fields + Starter/Main/Plenary/Homework + AI
    LessonFormModal.jsx          – add/edit a class (subject, class, duration, days taught)
    ManageCoursesModal.jsx       – list/edit all classes
    SchemeOfWorkModal.jsx        – per-term, per-week topic list for a class
    SettingsModal.jsx             – AI key, term settings, backup/restore
    HelpModal.jsx                  – in-app usage guide
    Tools.jsx / Premium.jsx
    AppShell.jsx                    – bottom nav + screen routing
  lib/
    data.js                – GES field schema, courses, Scheme of Work, week-number math
    groq.js                 – Groq client: model fallback, JSON mode, streaming, GES-aligned prompts
    storage.js                – localStorage persistence + backup/restore
  styles.css               – design tokens + component styles
```

## Notes

- A "class" (course) is recurring — subject, class, duration, and the specific weekdays it runs. A "lesson" is one day's actual instance of that class, auto-created for tomorrow when its weekday matches, and holding that day's own content.
- Week numbers are calculated from your term start date; if you haven't set one, new lessons default to Week 1 until you do.
- The Premium screen is informational only — no payment processor is wired up. A real one (e.g. Paystack) needs a backend to verify payments safely.
