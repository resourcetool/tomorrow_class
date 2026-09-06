import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function LessonFormModal({ lesson, onSave, onDelete, onClose }) {
  const [subject, setSubject] = useState(lesson?.subject || "");
  const [className, setClassName] = useState(lesson?.className || "");
  const [topic, setTopic] = useState(lesson?.topic || "");
  const [duration, setDuration] = useState(lesson?.duration || "40 min");

  const canSave = subject.trim() && className.trim() && topic.trim();

  function handleSave() {
    if (!canSave) return;
    onSave({ subject: subject.trim(), className: className.trim(), topic: topic.trim(), duration: duration.trim() || "40 min" });
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div className="tc-card" style={{ width: "100%", maxWidth: 480, padding: 22, borderRadius: "16px 16px 0 0", margin: 0 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>{lesson ? "Edit lesson" : "Add lesson"}</div>

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Subject</label>
        <input className="tc-field" style={{ marginTop: 5, marginBottom: 12 }} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Computing" autoFocus />

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Class</label>
        <input className="tc-field" style={{ marginTop: 5, marginBottom: 12 }} value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. JHS 2" />

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Topic</label>
        <input className="tc-field" style={{ marginTop: 5, marginBottom: 12 }} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Intro to Spreadsheets" />

        <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)" }}>Duration</label>
        <input className="tc-field" style={{ marginTop: 5, marginBottom: 18 }} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 40 min" />

        <div style={{ display: "flex", gap: 10 }}>
          {lesson && (
            <button className="tc-btn tc-btn-ghost" style={{ color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => onDelete(lesson.id)} title="Delete lesson">
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
