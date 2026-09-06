import React from "react";
import { X } from "lucide-react";

const STEPS = [
  { t: "Add your classes", d: "Tap + on the Tomorrow screen and add each class you teach — one subject, two, or a full timetable. There's no fixed number." },
  { t: "Prepare a lesson", d: 'Open a lesson and tap "Prepare with AI" for a full draft, or "10 min" when you\'re short on time.' },
  { t: "Refine anything", d: 'Edit a section directly, or type an instruction into "Ask AI to adjust this" to rewrite just that part.' },
  { t: "Connect AI once", d: "The first time you use AI prep, you'll be asked for a Groq API key. It's saved only in this browser, on this device." },
  { t: "Track readiness", d: "The ring on each lesson fills in as sections are completed — 100% means that lesson is ready for tomorrow." },
];

export default function HelpModal({ onClose }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div className="tc-card" style={{ width: "100%", maxWidth: 480, padding: 22, borderRadius: "16px 16px 0 0", margin: 0, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>How to use Tomorrow's Class</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.t}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          </div>
        ))}
        <button className="tc-btn tc-btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
