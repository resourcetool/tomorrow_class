import React, { useState } from "react";
import { KeyRound } from "lucide-react";

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [draft, setDraft] = useState(apiKey || "");
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div className="tc-card" style={{ width: "100%", maxWidth: 480, padding: 22, borderRadius: "16px 16px 0 0", margin: 0 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <KeyRound size={18} />
          <div style={{ fontWeight: 700, fontSize: 16 }}>Connect AI</div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 14 }}>
          Paste a Groq API key to enable real AI lesson preparation. It's saved only in this browser's local
          storage, on this device — never sent anywhere except Groq's API, and never bundled into the app's code.
        </p>
        <input
          type="password"
          className="tc-field"
          placeholder="gsk_..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="tc-btn tc-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button
            className="tc-btn tc-btn-primary"
            style={{ flex: 1 }}
            onClick={() => { onSave(draft.trim()); onClose(); }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
