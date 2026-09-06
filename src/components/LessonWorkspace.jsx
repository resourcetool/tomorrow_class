import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown, Check, Sparkles, Zap, Settings, Wand2 } from "lucide-react";
import { ReadinessRing } from "./Shared";
import { SECTION_META, AI_BANK, QUICK_BANK, computeProgress } from "../lib/data";
import { callGroq, streamGroq, buildRefineMessages, looksLikeInjectionAttempt } from "../lib/groq";

export default function LessonWorkspace({ lesson, onChange, onBack, onToast, apiKey, onOpenSettings }) {
  const [openKey, setOpenKey] = useState("objectives");
  const [generating, setGenerating] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const [refineDrafts, setRefineDrafts] = useState({});
  const [refiningKey, setRefiningKey] = useState(null);
  const pct = computeProgress(lesson.sections);

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

  async function runAI() {
    if (!apiKey) { onOpenSettings(); return; }
    setGenerating(true);
    try {
      const result = await callGroq(apiKey, lesson, "full");
      const filled = { ...lesson.sections };
      SECTION_META.forEach((s) => { if (result[s.key]) filled[s.key] = result[s.key]; });
      onChange({ ...lesson, sections: filled });
      onToast("Draft ready — review below");
    } catch (err) {
      console.error(err);
      const filled = {};
      SECTION_META.forEach((s) => { filled[s.key] = AI_BANK[s.key](lesson); });
      onChange({ ...lesson, sections: filled });
      onToast("Couldn't reach AI — used a local draft");
    } finally {
      setGenerating(false);
    }
  }

  async function runQuick() {
    if (!apiKey) { onOpenSettings(); return; }
    setGenerating(true);
    try {
      const result = await callGroq(apiKey, lesson, "quick");
      onChange({ ...lesson, sections: { ...lesson.sections, ...result } });
      onToast("Quick prep done");
    } catch (err) {
      console.error(err);
      const quickFields = ["teachingPoints", "activity", "homework"];
      const next = { ...lesson.sections };
      quickFields.forEach((k) => { next[k] = QUICK_BANK[k] ? QUICK_BANK[k](lesson) : AI_BANK[k](lesson); });
      if (!next.objectives) next.objectives = AI_BANK.objectives(lesson);
      onChange({ ...lesson, sections: next });
      onToast("Couldn't reach AI — used a local draft");
    } finally {
      setGenerating(false);
    }
  }

  // Streams the model's rewrite of a single section straight into that
  // section's textarea as tokens arrive — real streaming, not a fake
  // typewriter over an already-finished response.
  async function runRefine(sectionKey, label) {
    const instruction = (refineDrafts[sectionKey] || "").trim();
    if (!instruction) return;
    if (!apiKey) { onOpenSettings(); return; }
    if (looksLikeInjectionAttempt(instruction)) {
      onToast("I can only help refine this lesson section");
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
      onToast("Couldn't reach AI to refine this section");
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
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>{lesson.subject} · {lesson.className}</div>
            <h1 style={{ fontSize: 19, fontWeight: 700, margin: "2px 0 2px" }}>{lesson.topic}</h1>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{lesson.duration}</div>
          </div>
          <ReadinessRing pct={pct} size={44} stroke={4} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="tc-btn tc-btn-primary" style={{ flex: 1 }} onClick={runAI} disabled={generating}>
            <Sparkles size={15} /> {generating ? "Preparing…" : "Prepare with AI"}
          </button>
          <button className="tc-btn tc-btn-ghost" onClick={runQuick} disabled={generating}>
            <Zap size={14} /> 10 min
          </button>
          <button className="tc-btn tc-btn-ghost" onClick={onOpenSettings} title="AI settings" style={{ padding: "11px 13px" }}>
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

        <div className="tc-card">
          {SECTION_META.map((s, i) => {
            const val = lesson.sections[s.key];
            const open = openKey === s.key;
            const isRefining = refiningKey === s.key;
            return (
              <div key={s.key} style={{ borderBottom: i < SECTION_META.length - 1 ? "1px solid var(--border)" : "none" }}>
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
                      rows={s.key === "teachingPoints" ? 4 : 3}
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
