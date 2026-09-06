import React, { useMemo } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { ReadinessRing, StatusBadge } from "./Shared";
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
    <div className="tc-fade-in" style={{ padding: "20px 18px 90px", maxWidth: 720, margin: "0 auto" }}>
      {installBanner}
      <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.2, color: "var(--dawn-deep)", marginBottom: 4 }}>TOMORROW</div>
      <h1 className="tc-serif" style={{ fontSize: 25, fontWeight: 600, margin: "0 0 18px" }}>{tomorrow}</h1>

      <div className="tc-card" style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, background: overall >= 100 ? "linear-gradient(135deg,#F6FBF8,#fff)" : "#fff" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700 }} className="tc-serif">{overall}% ready</div>
          <div style={{ fontSize: 13.5, color: "var(--slate-soft)", marginTop: 3 }}>
            {overall >= 100 ? "You're ready for tomorrow." : notReady === 1 ? "1 lesson still needs prep." : `${notReady} lessons still need prep.`}
          </div>
        </div>
        <ReadinessRing pct={overall} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{lessons.length} classes tomorrow</div>
        {notReady > 0 && (
          <button className="tc-btn tc-btn-dawn tc-btn-sm" onClick={() => onOpenLesson(lessons.find((l) => computeProgress(l.sections) < 100)?.id)}>
            Prepare tomorrow <ArrowRight size={13} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {lessons.map((l) => {
          const pct = computeProgress(l.sections);
          const status = statusFromPct(pct);
          return (
            <button
              key={l.id}
              className="tc-card"
              style={{ padding: 16, cursor: "pointer", textAlign: "left", width: "100%", border: "1px solid var(--line)" }}
              onClick={() => onOpenLesson(l.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15.5 }}>{l.subject}</div>
                  <div style={{ fontSize: 13, color: "var(--slate-soft)", marginTop: 2 }}>{l.className} · {l.topic}</div>
                </div>
                <ReadinessRing pct={pct} size={40} stroke={4} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <StatusBadge status={status} />
                <span style={{ fontSize: 12.5, color: "var(--slate-soft)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {l.duration}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
