import React from "react";
import { ChevronRight, HelpCircle, Settings as SettingsIcon, LayoutList } from "lucide-react";
import { ReadinessRing, StatusText } from "./Shared";
import { computeProgress, statusFromPct } from "../lib/data";

export default function Home({ courses, upcomingDays, onOpenLesson, installBanner, onAddCourse, onManageCourses, onShowHelp, onOpenSettings }) {
  const heroDay = upcomingDays[0];
  const laterDays = upcomingDays.slice(1);
  const tomorrowInstances = heroDay ? heroDay.instances : [];

  const overall = tomorrowInstances.length
    ? Math.round(tomorrowInstances.reduce((a, l) => a + computeProgress(l.sections), 0) / tomorrowInstances.length)
    : 0;
  const notReady = tomorrowInstances.filter((l) => computeProgress(l.sections) < 100).length;
  const hasCourses = courses.length > 0;

  return (
    <div className="tc-fade-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        {installBanner}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 2 }}>Tomorrow</div>
            <h1 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>{heroDay ? heroDay.label : ""}</h1>
            <div style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
              {tomorrowInstances.length === 0
                ? (hasCourses ? "No classes scheduled tomorrow" : "No classes added yet")
                : `${overall}% ready · ${notReady === 0 ? "All set" : notReady === 1 ? "1 lesson left" : `${notReady} lessons left`}`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button className="tc-btn tc-btn-ghost tc-btn-sm" onClick={onShowHelp} title="How to use" style={{ padding: "8px 10px" }}>
              <HelpCircle size={16} />
            </button>
            <button className="tc-btn tc-btn-ghost tc-btn-sm" onClick={onManageCourses} title="My classes" style={{ padding: "8px 10px" }}>
              <LayoutList size={16} />
            </button>
            <button className="tc-btn tc-btn-ghost tc-btn-sm" onClick={onOpenSettings} title="Settings" style={{ padding: "8px 10px" }}>
              <SettingsIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {tomorrowInstances.length === 0 ? (
          <div className="tc-card" style={{ padding: "36px 20px", textAlign: "center" }}>
            {hasCourses ? (
              <>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>No classes tomorrow</div>
                <div style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  None of your classes are scheduled to run tomorrow. Check "My classes" if that doesn't look right,
                  or look below for classes coming up later this week.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Add your first class</div>
                <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 18, lineHeight: 1.5 }}>
                  Add every class you teach and pick exactly which days each one runs — every day, or just Monday, Wednesday and Friday.
                </div>
                <button className="tc-btn tc-btn-primary" onClick={onAddCourse}>Add class</button>
              </>
            )}
          </div>
        ) : (
          <div className="tc-card">
            {tomorrowInstances.map((l) => {
              const pct = computeProgress(l.sections);
              const status = statusFromPct(pct);
              return (
                <button key={l.id} className="tc-list-row" onClick={() => onOpenLesson(l.id)}>
                  <ReadinessRing pct={pct} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{l.subject}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 1 }}>{l.className}{l.topic ? ` · ${l.topic}` : ""}</div>
                    <div style={{ marginTop: 5 }}><StatusText status={status} /></div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {laterDays.length > 0 && (
        <div style={{ padding: "22px 20px 24px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>
            Coming up — prepare ahead any time
          </div>
          {laterDays.map((day) => (
            <div key={day.date} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 6px 2px" }}>{day.shortLabel}</div>
              <div className="tc-card">
                {day.instances.map((l) => {
                  const pct = computeProgress(l.sections);
                  return (
                    <button key={l.id} className="tc-list-row" onClick={() => onOpenLesson(l.id)}>
                      <ReadinessRing pct={pct} size={32} stroke={3} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{l.subject}</div>
                        <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{l.className}{l.topic ? ` · ${l.topic}` : ""}</div>
                      </div>
                      <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
