# Tomorrow's Class

"Know what you're teaching tomorrow. Be ready tonight."

A mobile-first PWA for lesson prep: see tomorrow's classes, prepare each one (with optional AI help via Groq), and watch your readiness reach 100%. Installable to a phone home screen or desktop, with basic offline support.

## Run it locally

Requires Node.js 18+.

```
npm install
npm start
```

Opens at http://localhost:3000. Service workers only activate in production builds, so installability and offline caching won't show up in `npm start` — use `npm run build` + a static server to test those (see below).

## AI setup — two options

**Option A — enter your key in the app (recommended).**
Open the app, go to a lesson, tap the gear icon next to "Prepare with AI," and paste a Groq key. It's kept in memory for that session only — never written to disk or browser storage, never bundled into the app.

**Option B — set it at build time via `.env` (local dev only).**
```
cp .env.example .env
# edit .env and set REACT_APP_GROQ_API_KEY=gsk_...
npm start
```
⚠️ Do not use this for anything you deploy publicly. Create React App bakes `REACT_APP_*` variables into the public JS bundle — anyone visiting the live site can read the key from dev tools or view-source. Option A avoids this because the key never leaves the visitor's own browser session.

**For a real production app**, neither option is truly secure for a key you're paying for — the right fix is a small backend or serverless function that holds the key server-side and proxies requests to Groq, so the key never reaches the browser.

## Build & deploy

```
npm run build
```

This outputs a static `build/` folder you can host anywhere that serves static files over HTTPS (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.) — HTTPS is required for the service worker and for "Add to Home Screen" to work.

To test the production build locally:
```
npx serve -s build
```

## Installing as an app

Once deployed over HTTPS:
- **Android / desktop Chrome:** the app shows its own "Install" banner (or use the browser's install icon in the address bar).
- **iOS Safari:** Share → Add to Home Screen (iOS doesn't support the `beforeinstallprompt` banner, so this is the only path there).

## Project structure

```
public/
  index.html          – shell HTML + PWA meta tags
  manifest.json        – app name, icons, theme colors
  service-worker.js    – offline caching (network-first w/ cache fallback)
  icons/                – app icons (192, 512, maskable)
src/
  App.jsx               – root: screen state, install prompt, settings modal
  components/           – Landing, Home, LessonWorkspace, Tools, Premium, AppShell
  lib/
    data.js              – mock lesson data, section schema, progress helpers
    groq.js              – Groq API client
  styles.css             – design tokens + component styles
```

## Notes

- Lesson data lives only in memory (React state) — refreshing the page resets it. There's no backend yet; that's the natural next step (e.g. persisting lessons to a database per teacher account).
- The service worker caches whatever the app has already loaded, so a page needs to be opened once online before it's available offline.
