import React, { useMemo } from "react";
import { ChevronRight, Plus, HelpCircle, Pencil } from "lucide-react";
import { ReadinessRing, StatusText } from "./Shared";
import { computeProgress, statusFromPct } from "../lib/data";

export default function Home({ lessons, onOpenLesson, installBanner, onAddLesson, onEditLesson, onShowHelp }) {
  const overall = lessons.length
    ? Math.round(lessons.reduce((a, l) => a + computeProgress(l.sections), 0) / lessons.length)
    : 0;
  const notReady = lessons.filter((l) => computeProgress(l.sections) < 100).length;
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  }, []);

  return (
    <div className="tc-fade-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        {installBanner}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 2 }}>Tomorrow</div>
            <h1 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>{tomorrow}</h1>
            <div style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
              {lessons.length === 0
                ? "No lessons added yet"
                : `${overall}% ready · ${notReady === 0 ? "All set" : notReady === 1 ? "1 lesson left" : `${notReady} lessons left`}`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button className="tc-btn tc-btn-ghost tc-btn-sm" onClick={onShowHelp} title="How to use" style={{ padding: "8px 10px" }}>
              <HelpCircle size={16} />
            </button>
            <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={onAddLesson}>
              <Plus size={15} /> Add
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {lessons.length === 0 ? (
          <div className="tc-card" style={{ padding: "36px 20px", textAlign: "center" }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Add your first lesson</div>
            <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 18, lineHeight: 1.5 }}>
              Add every class you teach tomorrow — whether that's one subject or six.
            </div>
            <button className="tc-btn tc-btn-primary" onClick={onAddLesson}>
              <Plus size={15} /> Add lesson
            </button>
          </div>
        ) : (
          <div className="tc-card">
            {lessons.map((l) => {
              const pct = computeProgress(l.sections);
              const status = statusFromPct(pct);
              return (
                <div key={l.id} className="tc-list-row" style={{ cursor: "default" }}>
                  <button
                    onClick={() => onOpenLesson(l.id)}
                    style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                  >
                    <ReadinessRing pct={pct} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{l.subject}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 1 }}>{l.className} · {l.topic}</div>
                      <div style={{ marginTop: 5 }}><StatusText status={status} /></div>
                    </div>
                  </button>
                  <button onClick={() => onEditLesson(l)} title="Edit lesson" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "var(--text-muted)" }}>
                    <Pencil size={16} />
                  </button>
                  <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0, cursor: "pointer" }} onClick={() => onOpenLesson(l.id)} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
