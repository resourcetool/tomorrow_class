import React, { useRef, useState } from "react";
import { KeyRound, CalendarRange, Download, Upload } from "lucide-react";
import { parseBackupFile } from "../lib/storage";

export default function SettingsModal({ apiKey, termStartDate, currentTerm, onSaveApiKey, onSaveTerm, onExport, onImport, onToast, onClose }) {
  const [keyDraft, setKeyDraft] = useState(apiKey || "");
  const [term, setTerm] = useState(currentTerm || 1);
  const [startDate, setStartDate] = useState(termStartDate || "");
  const fileRef = useRef(null);

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = parseBackupFile(String(reader.result));
        onImport(data);
      } catch (err) {
        onToast(err.message || "Couldn't read that backup file");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div className="tc-card" style={{ width: "100%", maxWidth: 480, padding: 22, borderRadius: "16px 16px 0 0", margin: 0, maxHeight: "88vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Settings</div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, marginBottom: 6 }}>
          <KeyRound size={16} /><div style={{ fontWeight: 600, fontSize: 14 }}>Connect AI</div>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10 }}>
          Your Groq API key, saved only in this browser's local storage on this device — never sent anywhere except Groq's API.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input type="password" className="tc-field" placeholder="gsk_..." value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} />
          <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={() => onSaveApiKey(keyDraft.trim())}>Save</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <CalendarRange size={16} /><div style={{ fontWeight: 600, fontSize: 14 }}>Term</div>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10 }}>
          Used to work out which Scheme of Work week tomorrow falls in.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <select value={term} onChange={(e) => setTerm(parseInt(e.target.value, 10))} className="tc-field" style={{ flex: 1 }}>
            <option value={1}>Term 1</option>
            <option value={2}>Term 2</option>
            <option value={3}>Term 3</option>
          </select>
          <input type="date" className="tc-field" style={{ flex: 1 }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={() => onSaveTerm(term, startDate)}>Save</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Download size={16} /><div style={{ fontWeight: 600, fontSize: 14 }}>Backup & restore</div>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10 }}>
          Your classes and lessons live only in this browser. Clearing site data or switching devices loses them —
          download a backup occasionally and keep it somewhere safe. Your API key is not included; re-enter it per device.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button className="tc-btn tc-btn-ghost" style={{ flex: 1 }} onClick={onExport}><Download size={14} /> Export</button>
          <button className="tc-btn tc-btn-ghost" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}><Upload size={14} /> Import</button>
          <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={handleImportFile} />
        </div>

        <button className="tc-btn tc-btn-primary" style={{ width: "100%" }} onClick={onClose}>Done</button>
      </div>
    </div>
  );
}
