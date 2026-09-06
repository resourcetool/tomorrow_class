import React from "react";
import { Sparkles, FileText, HelpCircle, Lightbulb, Library, ChevronRight, Lock } from "lucide-react";

export default function Tools({ onToast }) {
  const tools = [
    { icon: <Sparkles size={18} />, t: "AI Lesson Preparation", d: "Generate a full lesson from subject, class and topic.", free: true },
    { icon: <FileText size={18} />, t: "Worksheet Generator", d: "Create a printable worksheet matched to today's topic.", free: true },
    { icon: <HelpCircle size={18} />, t: "Quick Quiz Generator", d: "A short quiz to check understanding at the end of class.", free: true },
    { icon: <Lightbulb size={18} />, t: "Teaching Activity Ideas", d: "Fresh classroom activity ideas when you're stuck.", free: false },
    { icon: <Library size={18} />, t: "Lesson Resources", d: "Reference material and examples for your topic.", free: false },
  ];
  return (
    <div className="tc-fade-in" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ padding: "24px 20px 14px" }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Tools</h1>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div className="tc-card">
          {tools.map((tool, i) => (
            <button
              key={i}
              className="tc-list-row"
              onClick={() => onToast(tool.free ? `Opening ${tool.t}…` : `${tool.t} is a Premium tool`)}
            >
              <div style={{ color: "var(--text-muted)" }}>{tool.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, display: "flex", alignItems: "center", gap: 6 }}>
                  {tool.t} {!tool.free && <Lock size={12} color="var(--text-muted)" />}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 1 }}>{tool.d}</div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
