import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown, Check, Clock, Sparkles, Zap, Settings, AlertCircle } from "lucide-react";
import { ReadinessRing } from "./Shared";
import { SECTION_META, AI_BANK, QUICK_BANK, computeProgress } from "../lib/data";
import { callGroq } from "../lib/groq";

export default function LessonWorkspace({ lesson, onChange, onBack, onToast, apiKey, onOpenSettings }) {
  const [openKey, setOpenKey] = useState("objectives");
  const [generating, setGenerating] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const pct = computeProgress(lesson.sections);

  useEffect(() => {
    if (pct === 100 && !celebrated) {
      setCelebrated(true);
      onToast("You're ready for tomorrow.");
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
      onToast("AI draft ready — review and edit below");
    } catch (err) {
      console.error(err);
      const filled = {};
      SECTION_META.forEach((s) => { filled[s.key] = AI_BANK[s.key](lesson); });
      onChange({ ...lesson, sections: filled });
      onToast("Couldn't reach Groq — used a local draft instead");
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
      onToast("10-minute prep done");
    } catch (err) {
      console.error(err);
      const quickFields = ["teachingPoints", "activity", "homework"];
      const next = { ...lesson.sections };
      quickFields.forEach((k) => { next[k] = QUICK_BANK[k] ? QUICK_BANK[k](lesson) : AI_BANK[k](lesson); });
      if (!next.objectives) next.objectives = AI_BANK.objectives(lesson);
      onChange({ ...lesson, sections: next });
      onToast("Couldn't reach Groq — used a local draft instead");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="tc-fade-in" style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 100px" }}>
      <div style={{ position: "sticky", top: 0, background: "var(--paper)", zIndex: 20, padding: "16px 18px 10px" }}>
        <button className="tc-btn tc-btn-ghost tc-btn-sm" onClick={onBack} style={{ marginBottom: 12 }}>
          <ChevronLeft size={15} /> Tomorrow
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--dawn-deep)" }}>{lesson.subject.toUpperCase()} · {lesson.className}</div>
            <h1 className="tc-serif" style={{ fontSize: 22, fontWeight: 600, margin: "2px 0" }}>{lesson.topic}</h1>
            <div style={{ fontSize: 13, color: "var(--slate-soft)", display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} /> {lesson.duration}</div>
          </div>
          <ReadinessRing pct={pct} size={52} stroke={5} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="tc-btn tc-btn-primary" style={{ flex: 1 }} onClick={runAI} disabled={generating}>
            <Sparkles size={16} /> {generating ? "Preparing…" : "Prepare with AI"}
          </button>
          <button className="tc-btn tc-btn-ghost" onClick={runQuick} disabled={generating}>
            <Zap size={15} /> 10 min
          </button>
          <button className="tc-btn tc-btn-ghost" onClick={onOpenSettings} title="AI settings" style={{ padding: "12px 14px" }}>
            <Settings size={15} />
          </button>
        </div>
        {!apiKey && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12.5, color: "var(--slate-soft)" }}>
            <AlertCircle size={13} /> No AI connected yet — tap Prepare with AI to add a key
          </div>
        )}
      </div>

      <div style={{ padding: "6px 18px" }}>
        {generating && (
          <div className="tc-card" style={{ padding: 18, marginBottom: 14 }}>
            <div className="tc-skel" style={{ height: 14, width: "60%", marginBottom: 10 }} />
            <div className="tc-skel" style={{ height: 14, width: "90%", marginBottom: 10 }} />
            <div className="tc-skel" style={{ height: 14, width: "75%" }} />
          </div>
        )}

        {SECTION_META.map((s) => {
          const val = lesson.sections[s.key];
          const open = openKey === s.key;
          return (
            <div key={s.key} className="tc-card" style={{ marginBottom: 10, overflow: "hidden" }}>
              <button className="tc-accordion-head" onClick={() => setOpenKey(open ? null : s.key)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: val ? "#6B8F7B" : "var(--slate-soft)" }}>{val ? <Check size={16} /> : s.icon}</div>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{s.label}</span>
                </div>
                <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--slate-soft)" }} />
              </button>
              {open && (
                <div style={{ padding: "0 18px 18px" }}>
                  <textarea
                    className="tc-field"
                    rows={s.key === "teachingPoints" ? 4 : 3}
                    placeholder={`Write ${s.label.toLowerCase()}, or use Prepare with AI above…`}
                    value={val}
                    onChange={(e) => updateSection(s.key, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
