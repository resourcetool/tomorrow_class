import React, { useState } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import { createSowWeek } from "../lib/data";

export default function SchemeOfWorkModal({ course, onSave, onClose }) {
  const [term, setTerm] = useState(1);
  const [weeks, setWeeks] = useState(course.schemeOfWork || []);
  const [openId, setOpenId] = useState(null);

  const termWeeks = weeks.filter((w) => w.term === term).sort((a, b) => a.week - b.week);

  function updateWeek(id, field, value) {
    setWeeks((prev) => prev.map((w) => (w.id === id ? { ...w, [field]: value } : w)));
  }

  function addWeek() {
    const maxWeek = termWeeks.reduce((m, w) => Math.max(m, w.week), 0);
    const newWeek = createSowWeek({ term, week: maxWeek + 1 });
    setWeeks((prev) => [...prev, newWeek]);
    setOpenId(newWeek.id);
  }

  function deleteWeek(id) {
    setWeeks((prev) => prev.filter((w) => w.id !== id));
  }

  function handleSave() {
    onSave({ ...course, schemeOfWork: weeks });
    onClose();
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div className="tc-card" style={{ width: "100%", maxWidth: 520, padding: 22, borderRadius: "16px 16px 0 0", margin: 0, maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Scheme of Work — {course.subject} ({course.className})</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14 }}>
          Add each week's topic for the term. Tomorrow's lesson pulls its topic from here automatically once your term start date is set in Settings.
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[1, 2, 3].map((t) => (
            <button
              key={t}
              onClick={() => setTerm(t)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${term === t ? "var(--primary)" : "var(--border)"}`,
                background: term === t ? "var(--primary)" : "#fff",
                color: term === t ? "#fff" : "var(--text)",
              }}
            >
              Term {t}
            </button>
          ))}
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: 10, marginBottom: 14, overflow: "hidden" }}>
          {termWeeks.length === 0 && (
            <div style={{ padding: 16, fontSize: 13.5, color: "var(--text-muted)" }}>No weeks added for Term {term} yet.</div>
          )}
          {termWeeks.map((w, i) => {
            const open = openId === w.id;
            return (
              <div key={w.id} style={{ borderBottom: i < termWeeks.length - 1 ? "1px solid var(--border)" : "none" }}>
                <button className="tc-accordion-head" style={{ padding: "12px 14px" }} onClick={() => setOpenId(open ? null : w.id)}>
                  <div style={{ fontSize: 14, fontWeight: 600, textAlign: "left" }}>
                    Week {w.week}{w.topic ? ` — ${w.topic}` : " — (no topic yet)"}
                  </div>
                  <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s", color: "var(--text-muted)", flexShrink: 0 }} />
                </button>
                {open && (
                  <div style={{ padding: "0 14px 14px" }}>
                    <input className="tc-field" style={{ marginBottom: 8 }} value={w.topic} onChange={(e) => updateWeek(w.id, "topic", e.target.value)} placeholder="Topic" />
                    <input className="tc-field" style={{ marginBottom: 8 }} value={w.strand} onChange={(e) => updateWeek(w.id, "strand", e.target.value)} placeholder="Strand (optional)" />
                    <input className="tc-field" style={{ marginBottom: 8 }} value={w.subStrand} onChange={(e) => updateWeek(w.id, "subStrand", e.target.value)} placeholder="Sub-strand (optional)" />
                    <input className="tc-field" style={{ marginBottom: 8 }} value={w.contentStandard} onChange={(e) => updateWeek(w.id, "contentStandard", e.target.value)} placeholder="Content standard (optional)" />
                    <input className="tc-field" style={{ marginBottom: 10 }} value={w.indicator} onChange={(e) => updateWeek(w.id, "indicator", e.target.value)} placeholder="Indicator (optional)" />
                    <button className="tc-btn tc-btn-ghost tc-btn-sm" style={{ color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => deleteWeek(w.id)}>
                      <Trash2 size={13} /> Remove week
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="tc-btn tc-btn-ghost" style={{ width: "100%", marginBottom: 14 }} onClick={addWeek}>
          <Plus size={15} /> Add week
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="tc-btn tc-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="tc-btn tc-btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
