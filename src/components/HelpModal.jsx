import React from "react";
import { X } from "lucide-react";

const STEPS = [
  { t: "Add your classes", d: "Tap \"My classes\" and add each one — choose exactly which days it runs, whether that's every day or just Monday, Wednesday and Friday." },
  { t: "Set your term (optional)", d: "In Settings, pick the current term and the date it started. This lets the app work out which week of your Scheme of Work tomorrow falls in." },
  { t: "Add a Scheme of Work (optional)", d: "Edit a class and tap \"Manage Scheme of Work\" to list each week's topic for the term. Tomorrow's lesson picks up its topic automatically." },
  { t: "Prepare a lesson", d: "Open a lesson and tap \"Prepare with AI\" for a full, GES-aligned draft, or \"10 min\" when you're short on time." },
  { t: "Refine anything", d: "Edit a field directly, or type an instruction into \"Ask AI to adjust this\" to rewrite just that part." },
  { t: "Back it up", d: "Your classes and lessons live only on this device. Download a backup from Settings now and then so you never lose them." },
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
