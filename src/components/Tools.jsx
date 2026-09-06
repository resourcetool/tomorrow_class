import React from "react";
import { Sparkles, FileText, HelpCircle, Lightbulb, Library, Crown, ChevronRight } from "lucide-react";

export default function Tools({ onToast }) {
  const tools = [
    { icon: <Sparkles size={18} />, t: "AI Lesson Preparation", d: "Generate a full lesson from subject, class and topic.", free: true },
    { icon: <FileText size={18} />, t: "Worksheet Generator", d: "Create a printable worksheet matched to today's topic.", free: true },
    { icon: <HelpCircle size={18} />, t: "Quick Quiz Generator", d: "A short quiz to check understanding at the end of class.", free: true },
    { icon: <Lightbulb size={18} />, t: "Teaching Activity Ideas", d: "Fresh classroom activity ideas when you're stuck.", free: false },
    { icon: <Library size={18} />, t: "Lesson Resources", d: "Reference material and examples for your topic.", free: false },
  ];
  return (
    <div className="tc-fade-in" style={{ padding: "20px 18px 90px", maxWidth: 720, margin: "0 auto" }}>
      <h1 className="tc-serif" style={{ fontSize: 23, fontWeight: 600, marginBottom: 4 }}>Tools</h1>
      <p style={{ fontSize: 13.5, color: "var(--slate-soft)", marginBottom: 20 }}>Everything here exists to help you prepare — nothing else.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tools.map((tool, i) => (
          <button
            key={i}
            className="tc-card"
            style={{ padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", width: "100%" }}
            onClick={() => onToast(tool.free ? `Opening ${tool.t}…` : `${tool.t} is a Premium tool`)}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{tool.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, display: "flex", alignItems: "center", gap: 8 }}>
                {tool.t} {!tool.free && <span className="tc-badge" style={{ background: "var(--dawn-soft)", color: "#8A5B1E", padding: "2px 8px" }}><Crown size={10} /> Premium</span>}
              </div>
              <div style={{ fontSize: 13, color: "var(--slate-soft)", marginTop: 2 }}>{tool.d}</div>
            </div>
            <ChevronRight size={16} color="var(--slate-soft)" />
          </button>
        ))}
      </div>
    </div>
  );
}
