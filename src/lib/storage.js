// Simple localStorage persistence. Runs entirely in the person's own
// browser — nothing here is sent anywhere or baked into the app's code.

const LESSONS_KEY = "tc_lessons_v1";
const API_KEY_KEY = "tc_groq_key";

export function loadLessons() {
  try {
    const raw = localStorage.getItem(LESSONS_KEY);
    if (!raw) return null; // null = nothing saved yet (first run)
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveLessons(lessons) {
  try {
    localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  } catch {
    // storage can fail (private browsing, quota) — app still works, just won't persist
  }
}

export function loadApiKey() {
  try {
    return localStorage.getItem(API_KEY_KEY) || "";
  } catch {
    return "";
  }
}

export function saveApiKey(key) {
  try {
    if (key) localStorage.setItem(API_KEY_KEY, key);
    else localStorage.removeItem(API_KEY_KEY);
  } catch {
    // ignore
  }
}
