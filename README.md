# Tomorrow's Class

"Know what you're teaching tomorrow. Be ready tonight."

A mobile-first PWA for lesson prep: add the classes you teach, prepare each one with AI, and watch your readiness reach 100%. Installable to a phone home screen or desktop, with basic offline support.

## How to use it

1. **Add your classes.** Tap **+** on the Tomorrow screen and add each class you teach tomorrow — one subject, two, or a full timetable. There's no fixed number; a computing-only teacher just adds one lesson, a teacher with six subjects adds six.
2. **Connect AI once.** The first time you tap "Prepare with AI," you'll be asked for a Groq API key ([console.groq.com](https://console.groq.com) → API Keys). It's saved in this browser's local storage, on this device only.
3. **Prepare a lesson.** Open a lesson and tap **Prepare with AI** for a full draft, or **10 min** when you're short on time.
4. **Refine anything.** Edit a section directly, or type an instruction into "Ask AI to adjust this" (e.g. "make it shorter," "add a real-world example") to rewrite just that part — the rewrite streams in live.
5. **Track readiness.** The ring on each lesson fills in as sections are completed. Edit or delete a lesson any time via the pencil icon on its row.

This guide is also built into the app — tap the **?** icon next to Add on the Tomorrow screen.

## Run it locally

Requires Node.js 18+.

```
npm install
npm start
```

Opens at http://localhost:3000. Service workers only activate in production builds, so installability and offline caching won't show up in `npm start` — use `npm run build` + a static server to test those (see below).

## AI setup

**In-app (recommended, and how most people should do this).** Tap the gear icon inside a lesson, paste a Groq key. It's stored in `localStorage` — per browser, per device, never bundled into the app's code, never sent anywhere except Groq's API.

**Build-time `.env` (local dev convenience only).**
```
cp .env.example .env
# edit .env and set REACT_APP_GROQ_API_KEY=gsk_...
npm start
```
⚠️ Don't rely on this for anything you deploy publicly — Create React App bakes `REACT_APP_*` variables into the public JS bundle, readable by anyone who opens dev tools on your live site.

**If AI requests fail:** the app tries a short list of Groq models in order (in case one gets renamed or retired) and surfaces the actual error as a toast — an invalid/expired key, a rate limit, or a network issue will each say so specifically rather than a generic failure. For a real production deployment serving other people's traffic, the more robust long-term fix is a small backend/serverless function that holds the key server-side and proxies the Groq request, so the key never reaches the browser at all.

## Build & deploy

```
npm run build
```

Outputs a static `build/` folder you can host anywhere serving static files over HTTPS (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.) — HTTPS is required for the service worker and for "Add to Home Screen."

To test the production build locally:
```
npx serve -s build
```

## Installing as an app

Once deployed over HTTPS:
- **Android / desktop Chrome:** the app shows its own "Install" banner, or use the browser's install icon in the address bar.
- **iOS Safari:** Share → Add to Home Screen (iOS doesn't support the `beforeinstallprompt` banner, so this is the only path there).

## Project structure

```
public/
  index.html          – shell HTML + PWA meta tags
  manifest.json        – app name, icons, theme colors
  service-worker.js    – offline caching (network-first w/ cache fallback)
  icons/                – app icons
src/
  App.jsx               – root: screen state, persistence, install prompt, modals
  components/
    Landing.jsx           – one-time welcome screen (skipped after first visit)
    Home.jsx               – lesson list, add/edit, empty state
    LessonWorkspace.jsx    – per-lesson prep + AI generation/refine
    LessonFormModal.jsx    – add/edit/delete a lesson
    Tools.jsx / Premium.jsx
    SettingsModal.jsx      – Groq key entry
    HelpModal.jsx           – in-app usage guide
    AppShell.jsx            – bottom nav + screen routing
  lib/
    data.js              – section schema, mock draft fallbacks, progress helpers
    groq.js               – Groq API client (model fallback, JSON mode, streaming)
    storage.js             – localStorage persistence for lessons + API key
  styles.css             – design tokens + component styles
```

## Notes

- Lessons and the API key persist in this browser's `localStorage`. Clearing browser data, or switching devices/browsers, starts fresh — there's no account or backend yet, so nothing syncs across devices.
- The service worker caches whatever the app has already loaded, so a page needs to be opened once online before it's available offline.
- The Premium screen is informational only — no payment processor is wired up yet. Hooking up a real one (e.g. Paystack, common in Ghana) would need a small backend to verify payments and isn't something that can live safely in client-only code.
