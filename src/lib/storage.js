// localStorage persistence, plus a real backup/restore path.
//
// Honest note on "safer" storage: switching to IndexedDB would NOT make
// data meaningfully harder to lose — browsers wipe IndexedDB and
// localStorage together whenever someone clears a site's data, which is
// the actual failure mode being asked about here. IndexedDB only helps
// with larger data volumes or transactional needs, neither of which
// applies to this app. The one thing that genuinely helps against
// accidental data loss is a portable backup file the person can keep
// somewhere else (email, Drive, etc.) — see exportBackup/parseBackupFile
// below — plus asking the browser not to auto-evict this site's storage
// under space pressure (requestPersistentStorage), which is a different,
// narrower problem than the person manually clearing data.

const COURSES_KEY = "tc_courses_v1";
const INSTANCES_KEY = "tc_instances_v1";
const API_KEY_KEY = "tc_groq_key";
const TERM_START_KEY = "tc_term_start";
const CURRENT_TERM_KEY = "tc_current_term";

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* quota or private mode — app still works */ }
}
function safeRemove(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

export function loadCourses() {
  try {
    const raw = safeGet(COURSES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}
export function saveCourses(courses) { safeSet(COURSES_KEY, JSON.stringify(courses)); }

export function loadInstances() {
  try {
    const raw = safeGet(INSTANCES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}
export function saveInstances(instances) { safeSet(INSTANCES_KEY, JSON.stringify(instances)); }

export function loadApiKey() { return safeGet(API_KEY_KEY) || ""; }
export function saveApiKey(key) { (key ? safeSet(API_KEY_KEY, key) : safeRemove(API_KEY_KEY)); }

export function loadTermStart() { return safeGet(TERM_START_KEY) || ""; }
export function saveTermStart(dateStr) { (dateStr ? safeSet(TERM_START_KEY, dateStr) : safeRemove(TERM_START_KEY)); }

export function loadCurrentTerm() {
  const n = parseInt(safeGet(CURRENT_TERM_KEY), 10);
  return n >= 1 && n <= 3 ? n : 1;
}
export function saveCurrentTerm(term) { safeSet(CURRENT_TERM_KEY, String(term)); }

// Asks the browser to protect this site's storage from automatic eviction
// under storage pressure (e.g. the device running low on space). This does
// NOT protect against the person manually clearing site data — nothing
// client-side can. Best-effort and silently ignored where unsupported.
export function requestPersistentStorage() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  } catch { /* ignore */ }
}

export function exportBackup({ courses, lessonInstances, termStartDate, currentTerm }) {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    courses,
    lessonInstances,
    termStartDate,
    currentTerm,
    // The Groq API key is deliberately excluded — re-enter it per device
    // rather than have it sit in a plaintext file that might get emailed
    // or shared somewhere less safe than this browser's own storage.
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tomorrows-class-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseBackupFile(text) {
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.courses)) throw new Error("This doesn't look like a Tomorrow's Class backup file");
  return data;
}
