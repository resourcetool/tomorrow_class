import React from "react";
import { ChevronRight, Plus, X } from "lucide-react";

export default function ManageCoursesModal({ courses, onEdit, onAdd, onClose }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div className="tc-card" style={{ width: "100%", maxWidth: 480, padding: 22, borderRadius: "16px 16px 0 0", margin: 0, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>My classes</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {courses.length === 0 ? (
          <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 16 }}>No classes yet.</div>
        ) : (
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            {courses.map((c) => (
              <button key={c.id} className="tc-list-row" onClick={() => onEdit(c)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{c.subject}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 1 }}>{c.className} · {c.days.join(", ")}</div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}

        <button className="tc-btn tc-btn-primary" style={{ width: "100%" }} onClick={onAdd}>
          <Plus size={15} /> Add class
        </button>
      </div>
    </div>
  );
}
