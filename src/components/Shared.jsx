import React, { useEffect } from "react";
import { Check, Clock, Circle } from "lucide-react";

export function ReadinessRing({ pct, size = 40, stroke = 4 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct >= 100 ? "var(--ready)" : pct > 0 ? "var(--attention)" : "var(--border)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }} role="img" aria-label={`${pct}% ready`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset .4s ease" }}
      />
    </svg>
  );
}

export function StatusText({ status }) {
  const map = {
    ready: { color: "var(--ready)", label: "Ready", icon: <Check size={13} /> },
    almost: { color: "var(--attention)", label: "In progress", icon: <Clock size={13} /> },
    none: { color: "var(--text-muted)", label: "Not started", icon: <Circle size={13} /> },
  };
  const s = map[status];
  return <span className="tc-status-text" style={{ color: s.color }}>{s.icon}{s.label}</span>;
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="tc-toast" role="status">{message}</div>;
}
