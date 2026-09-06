import React, { useEffect } from "react";
import { Check, Clock, X, Sparkles } from "lucide-react";

export function ReadinessRing({ pct, size = 96, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }} role="img" aria-label={`${pct}% ready`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E6DFD2" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={pct >= 100 ? "#6B8F7B" : "#E8A659"}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset .8s cubic-bezier(.3,.8,.4,1), stroke .3s ease" }}
      />
    </svg>
  );
}

export function StatusBadge({ status }) {
  const map = {
    ready: { bg: "var(--sage-soft)", fg: "#3E5C4C", label: "Ready", icon: <Check size={12} /> },
    almost: { bg: "#FBEBD3", fg: "#8A5B1E", label: "Almost ready", icon: <Clock size={12} /> },
    none: { bg: "#F3E9E4", fg: "#A24B2F", label: "Not prepared", icon: <X size={12} /> },
  };
  const s = map[status];
  return (
    <span className="tc-badge" style={{ background: s.bg, color: s.fg }}>
      {s.icon}
      {s.label}
    </span>
  );
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="tc-toast" role="status">
      <Sparkles size={15} color="#E8A659" /> {message}
    </div>
  );
}
