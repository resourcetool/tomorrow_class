import React from "react";
import { TrendingUp } from "lucide-react";

export default function Premium({ onToast }) {
  return (
    <div className="tc-fade-in" style={{ padding: "20px 18px 90px", maxWidth: 720, margin: "0 auto" }}>
      <h1 className="tc-serif" style={{ fontSize: 23, fontWeight: 600, marginBottom: 4 }}>Premium</h1>
      <p style={{ fontSize: 13.5, color: "var(--slate-soft)", marginBottom: 20 }}>Same app, less friction, more headroom.</p>

      <div className="tc-card" style={{ padding: 22, background: "var(--ink)", color: "#fff", border: "none", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span className="tc-serif" style={{ fontSize: 30, fontWeight: 700 }}>GH₵5</span>
          <span style={{ color: "#C7CCE3", fontSize: 14 }}>/ month</span>
        </div>
        <p style={{ fontSize: 13.5, color: "#C7CCE3", margin: "10px 0 16px" }}>Cancel anytime. No contracts, no surprise charges.</p>
        <button className="tc-btn tc-btn-dawn" style={{ width: "100%" }} onClick={() => onToast("This is a demo — no real payment will be made")}>Upgrade to Premium</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { t: "Unlimited AI preparations", f: "5 / month", p: "Unlimited" },
          { t: "Worksheets & quizzes", f: "Basic templates", p: "Unlimited, advanced" },
          { t: "Reusable lesson templates", f: "—", p: "Included" },
          { t: "Preparation insights", f: "—", p: "Included" },
        ].map((row, i) => (
          <div key={i} className="tc-card" style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 8, alignItems: "center" }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{row.t}</div>
            <div style={{ fontSize: 13, color: "var(--slate-soft)" }}>{row.f}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#3E5C4C", display: "flex", alignItems: "center", gap: 5 }}><TrendingUp size={13} /> {row.p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
