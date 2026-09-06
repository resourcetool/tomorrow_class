import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown, Check, Sparkles, Zap, Settings, Wand2 } from "lucide-react";
import { ReadinessRing } from "./Shared";
import { DETAIL_META, PHASE_META, ALL_FIELDS, AI_BANK, QUICK_BANK, computeProgress, findSowEntry } from "../lib/data";
import { callGroq, streamGroq, buildRefineMessages, looksLikeInjectionAttempt } from "../lib/groq";

export default function LessonWorkspace({ lesson, course, onChange, onBack, onToast, apiKey, onOpenSettings }) {
  const [openKey, setOpenKey] = useState("starterActivity");
  const [generating, setGenerating] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const [refineDrafts, setRefineDrafts] = useState({});
  const [refiningKey, setRefiningKey] = useState(null);
  const pct = computeProgress(lesson.sections);

  const term = lesson.term || 1;
  const week = lesson.week || 1;
  const sowEntry = findSowEntry(course, term, week);
  const sowDiffers = sowEntry && (sowEntry.topic !== lesson.topic || sowEntry.strand !== lesson.sections.strand);

  useEffect(() => {
    if (pct === 100 && !celebrated) {
      setCelebrated(true);
      onToast("Ready for tomorrow");
    }
    if (pct < 100 && celebrated) setCelebrated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  function updateSection(key, value) {
    onChange({ ...lesson, sections: { ...lesson.sections, [key]: value } });
  }

  function updateWeekInfo(field, value) {
    onChange({ ...lesson, [field]: value });
  }

  function applySow() {
    if (!sowEntry) return;
    onChange({
      ...lesson,
      topic: sowEntry.topic || lesson.topic,
      sections: {
        ...lesson.sections,
        strand: sowEntry.strand || lesson.sections.strand,
        subStrand: sowEntry.subStrand || lesson.sections.subStrand,
        contentStandard: sowEntry.contentStandard || lesson.sections.contentStandard,
        indicator: sowEntry.indicator || lesson.sections.indicator,
      },
    });
    onToast("Applied from Scheme of Work");
  }

  async function runAI() {
    if (!lesson.topic.trim()) { onToast("Add a topic first"); return; }
    if (!apiKey) { onOpenSettings(); return; }
    setGenerating(true);
    try {
      const result = await callGroq(apiKey, lesson, "full");
      const filled = { ...lesson.sections };
      ALL_FIELDS.forEach((f) => { if (result[f.key]) filled[f.key] = result[f.key]; });
      onChange({ ...lesson, sections: filled });
      onToast("Draft ready — review below");
    } catch (err) {
      console.error(err);
      const filled = {};
      ALL_FIELDS.forEach((f) => { filled[f.key] = AI_BANK[f.key] ? AI_BANK[f.key](lesson) : ""; });
      onChange({ ...lesson, sections: filled });
      onToast(err?.message ? `${err.message.slice(0, 80)} — used a local draft instead` : "Couldn't reach AI — used a local draft instead");
    } finally {
      setGenerating(false);
    }
  }

  async function runQuick() {
    if (!lesson.topic.trim()) { onToast("Add a topic first"); return; }
    if (!apiKey) { onOpenSettings(); return; }
    setGenerating(true);
    try {
      const result = await callGroq(apiKey, lesson, "quick");
      onChange({ ...lesson, sections: { ...lesson.sections, ...result } });
      onToast("Quick prep done");
    } catch (err) {
      console.error(err);
      const next = { ...lesson.sections };
      ["mainActivity", "plenary", "homework"].forEach((k) => { next[k] = QUICK_BANK[k] ? QUICK_BANK[k](lesson) : AI_BANK[k](lesson); });
      if (!next.indicator) next.indicator = AI_BANK.indicator(lesson);
      onChange({ ...lesson, sections: next });
      onToast(err?.message ? `${err.message.slice(0, 80)} — used a local draft instead` : "Couldn't reach AI — used a local draft instead");
    } finally {
      setGenerating(false);
    }
  }

  async function runRefine(sectionKey, label) {
    const instruction = (refineDrafts[sectionKey] || "").trim();
    if (!instruction) return;
    if (!apiKey) { onOpenSettings(); return; }
    if (looksLikeInjectionAttempt(instruction)) {
      onToast("I can only help refine this lesson field");
      return;
    }
    setRefiningKey(sectionKey);
    try {
      const messages = buildRefineMessages(lesson, label, lesson.sections[sectionKey], instruction);
      await streamGroq(apiKey, messages, (_delta, full) => {
        updateSection(sectionKey, full);
      });
      setRefineDrafts((d) => ({ ...d, [sectionKey]: "" }));
    } catch (err) {
      console.error(err);
      onToast(err?.message ? err.message.slice(0, 100) : "Couldn't reach AI to refine this field");
    } finally {
      setRefiningKey(null);
    }
  }

  return (
    <div className="tc-fade-in" style={{ maxWidth: 640, margin: "0 auto", paddingBottom: 40 }}>
      <div style={{ position: "sticky", top: 0, background: "var(--bg-muted)", zIndex: 20, padding: "18px 20px 14px" }}>
        <button className="tc-btn-text" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
          <ChevronLeft size={16} /> Tomorrow
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>{lesson.subject} · {lesson.className}</div>
            <input
              className="tc-field"
              style={{ fontSize: 17, fontWeight: 700, padding: "6px 0", border: "none", marginTop: 2 }}
              value={lesson.topic}
              onChange={(e) => onChange({ ...lesson, topic: e.target.value })}
              placeholder="Add a topic"
            />
          </div>
          <ReadinessRing pct={pct} size={44} stroke={4} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{lesson.duration}</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>·</span>
          <select
            value={term}
            onChange={(e) => updateWeekInfo("term", parseInt(e.target.value, 10))}
            style={{ fontSize: 13, color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 4px", background: "#fff" }}
          >
            <option value={1}>Term 1</option>
            <option value={2}>Term 2</option>
            <option value={3}>Term 3</option>
          </select>
          <input
            type="number"
            min={1}
            value={week}
            onChange={(e) => updateWeekInfo("week", Math.max(1, parseInt(e.target.value, 10) || 1))}
            style={{ width: 52, fontSize: 13, color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 6px" }}
          />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Week</span>
        </div>

        {sowEntry && sowDiffers && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ fontSize: 12.5, color: "var(--text)" }}>
              Scheme of Work — Week {week}: <strong>{sowEntry.topic || "(no topic set)"}</strong>
            </div>
            <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={applySow}>Use this</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button className="tc-btn tc-btn-primary" style={{ flex: 1 }} onClick={runAI} disabled={generating}>
            <Sparkles size={15} /> {generating ? "Preparing…" : "Prepare with AI"}
          </button>
          <button className="tc-btn tc-btn-ghost" onClick={runQuick} disabled={generating}>
            <Zap size={14} /> 10 min
          </button>
          <button className="tc-btn tc-btn-ghost" onClick={onOpenSettings} title="Settings" style={{ padding: "11px 13px" }}>
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div style={{ padding: "4px 20px" }}>
        {generating && (
          <div className="tc-card" style={{ padding: 16, marginBottom: 12 }}>
            <div className="tc-skel" style={{ height: 13, width: "60%", marginBottom: 9 }} />
            <div className="tc-skel" style={{ height: 13, width: "90%", marginBottom: 9 }} />
            <div className="tc-skel" style={{ height: 13, width: "75%" }} />
          </div>
        )}

        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)", margin: "14px 4px 6px", textTransform: "uppercase", letterSpacing: 0.3 }}>Lesson details</div>
        <div className="tc-card" style={{ padding: "6px 16px", marginBottom: 18 }}>
          {DETAIL_META.map((f, i) => (
            <div key={f.key} style={{ padding: "10px 0", borderBottom: i < DETAIL_META.length - 1 ? "1px solid var(--border)" : "none" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>{f.label}</label>
              <input
                className="tc-field"
                style={{ border: "none", padding: "4px 0", fontSize: 14 }}
                value={lesson.sections[f.key]}
                onChange={(e) => updateSection(f.key, e.target.value)}
                placeholder={`Add ${f.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)", margin: "0 4px 6px", textTransform: "uppercase", letterSpacing: 0.3 }}>Lesson phases</div>
        <div className="tc-card">
          {PHASE_META.map((s, i) => {
            const val = lesson.sections[s.key];
            const open = openKey === s.key;
            const isRefining = refiningKey === s.key;
            return (
              <div key={s.key} style={{ borderBottom: i < PHASE_META.length - 1 ? "1px solid var(--border)" : "none" }}>
                <button className="tc-accordion-head" style={{ padding: "14px 16px" }} onClick={() => setOpenKey(open ? null : s.key)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {val ? <Check size={15} color="var(--ready)" /> : <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1.5px solid var(--border)" }} />}
                    <span style={{ fontWeight: 500, fontSize: 14.5 }}>{s.label}</span>
                  </div>
                  <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s", color: "var(--text-muted)" }} />
                </button>
                {open && (
                  <div style={{ padding: "0 16px 16px" }}>
                    <textarea
                      className="tc-field"
                      rows={4}
                      placeholder={`Write ${s.label.toLowerCase()}, or use Prepare with AI above…`}
                      value={val}
                      onChange={(e) => updateSection(s.key, e.target.value)}
                      disabled={isRefining}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <input
                        className="tc-field"
                        style={{ flex: 1, padding: "9px 12px", fontSize: 13.5 }}
                        placeholder='Ask AI to adjust this — e.g. "make it shorter"'
                        value={refineDrafts[s.key] || ""}
                        onChange={(e) => setRefineDrafts((d) => ({ ...d, [s.key]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && runRefine(s.key, s.label)}
                        disabled={isRefining}
                      />
                      <button
                        className="tc-btn tc-btn-ghost tc-btn-sm"
                        onClick={() => runRefine(s.key, s.label)}
                        disabled={isRefining || !(refineDrafts[s.key] || "").trim()}
                      >
                        <Wand2 size={13} /> {isRefining ? "Writing…" : "Ask AI"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
