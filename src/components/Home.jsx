import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { ReadinessRing, StatusText } from "./Shared";
import { computeProgress, statusFromPct } from "../lib/data";

export default function Home({ lessons, onOpenLesson, installBanner }) {
  const overall = Math.round(lessons.reduce((a, l) => a + computeProgress(l.sections), 0) / lessons.length);
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
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 2 }}>Tomorrow</div>
        <h1 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>{tomorrow}</h1>
        <div style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
          {overall}% ready · {notReady === 0 ? "All set" : notReady === 1 ? "1 lesson left" : `${notReady} lessons left`}
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div className="tc-card">
          {lessons.map((l) => {
            const pct = computeProgress(l.sections);
            const status = statusFromPct(pct);
            return (
              <button key={l.id} className="tc-list-row" onClick={() => onOpenLesson(l.id)}>
                <ReadinessRing pct={pct} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{l.subject}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 1 }}>{l.className} · {l.topic}</div>
                  <div style={{ marginTop: 5 }}><StatusText status={status} /></div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
