import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { WEEKDAYS } from "../lib/data";

export default function LessonFormModal({ course, onSave, onDelete, onManageSow, onClose }) {
  const [subject, setSubject] = useState(course?.subject || "");
  const [className, setClassName] = useState(course?.className || "");
  const [duration, setDuration] = useState(course?.duration || "40 min");
  const [days, setDays] = useState(course?.days || ["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const canSave = subject.trim() && className.trim() && days.length > 0;

  function toggleDay(day) {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function handleSave() {
    if (!canSave) return;
    onSave({ subject: subject.trim(), className: className.trim(), duration: duration.trim() || "40 min", days });
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div className="tc-card" style={{ width: "100%", maxWidth: 480, padding: 22, borderRadius: "16px 16px 0 0", margin: 0, maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{course ? "Edit class" : "Add class"}</div>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Subject</label>
        <input className="tc-field" style={{ marginTop: 5, marginBottom: 12 }} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Computing" autoFocus />

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Class</label>
        <input className="tc-field" style={{ marginTop: 5, marginBottom: 12 }} value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. JHS 2" />

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Duration</label>
        <input className="tc-field" style={{ marginTop: 5, marginBottom: 14 }} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 40 min" />

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Days taught</label>
        <div style={{ display: "flex", gap: 6, marginTop: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {WEEKDAYS.map((d) => {
            const active = days.includes(d.key);
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => toggleDay(d.key)}
                style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                  background: active ? "var(--primary)" : "#fff",
                  color: active ? "#fff" : "var(--text)",
                }}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {course && (
          <button className="tc-btn tc-btn-ghost" style={{ width: "100%", marginBottom: 12 }} onClick={() => onManageSow(course)}>
            Manage Scheme of Work
          </button>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {course && (
            <button className="tc-btn tc-btn-ghost" style={{ color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => onDelete(course.id)} title="Delete class">
              <Trash2 size={15} />
            </button>
          )}
          <button className="tc-btn tc-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="tc-btn tc-btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={!canSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
