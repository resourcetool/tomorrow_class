import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function Landing({ onStart }) {
  return (
    <div className="tc-fade-in" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "24px", background: "#fff" }}>
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle2 size={28} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Tomorrow's Class</h1>
        <p style={{ fontSize: 14.5, color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 32px" }}>
          See what you're teaching tomorrow and get every lesson ready tonight.
        </p>
        <button className="tc-btn tc-btn-primary" style={{ width: "100%" }} onClick={onStart}>
          Get started
        </button>
      </div>
    </div>
  );
}
