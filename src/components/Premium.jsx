import React from "react";
import { Check } from "lucide-react";

export default function Premium({ onToast }) {
  const rows = [
    { t: "AI preparations", f: "5 / month", p: "Unlimited" },
    { t: "Worksheets & quizzes", f: "Basic", p: "Unlimited" },
    { t: "Reusable lesson templates", f: "—", p: "Included" },
    { t: "Preparation insights", f: "—", p: "Included" },
  ];
  return (
    <div className="tc-fade-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ padding: "24px 20px 14px" }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>Premium</h1>
        <div style={{ fontSize: 14, color: "var(--text-muted)" }}>GH₵5 / month · cancel anytime</div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div className="tc-card" style={{ padding: "4px 16px" }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{row.t}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{row.f}</span>
                <span style={{ color: "var(--text-muted)" }}>→</span>
                <span style={{ color: "var(--ready)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Check size={13} /> {row.p}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <button className="tc-btn tc-btn-primary" style={{ width: "100%" }} onClick={() => onToast("This is a demo — no real payment will be made")}>
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}
