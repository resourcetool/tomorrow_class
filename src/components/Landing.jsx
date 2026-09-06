import React, { useState } from "react";
import { Moon, Sun, ArrowRight, Check, Star, ChevronDown } from "lucide-react";
import { ReadinessRing, StatusBadge } from "./Shared";
import { INITIAL_LESSONS } from "../lib/data";

export default function Landing({ onStart }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="tc-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Moon size={15} color="#E8A659" />
          </div>
          <span className="tc-serif" style={{ fontWeight: 600, fontSize: 17 }}>Tomorrow's Class</span>
        </div>
        <button className="tc-btn tc-btn-ghost tc-btn-sm" onClick={onStart}>Sign in</button>
      </div>

      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, var(--ink) 0%, var(--ink) 55%, #2C3560 100%)", color: "#fff", paddingBottom: 40 }}>
        <div className="tc-glow" style={{ width: 340, height: 340, background: "#E8A659", opacity: 0.25, top: -120, right: -80 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 0", display: "grid", gridTemplateColumns: "1fr", gap: 30 }}>
          <div style={{ maxWidth: 620 }}>
            <div className="tc-badge" style={{ background: "rgba(232,166,89,0.15)", color: "var(--dawn)", marginBottom: 18 }}>
              <Sun size={12} /> Built for one job: tomorrow's lessons
            </div>
            <h1 className="tc-serif" style={{ fontSize: "clamp(32px, 6vw, 52px)", lineHeight: 1.08, fontWeight: 600, margin: 0 }}>
              Tomorrow's class starts tonight.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "#C7CCE3", marginTop: 18, maxWidth: 500 }}>
              Open the app, see exactly what you're teaching tomorrow, and get every lesson ready before you close your laptop — with AI doing the heavy lifting.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              <button className="tc-btn tc-btn-dawn" onClick={onStart}>Get started free <ArrowRight size={16} /></button>
              <button className="tc-btn tc-btn-ghost-dark" onClick={onStart}>See how it works</button>
            </div>
          </div>

          <div className="tc-pop" style={{ background: "#fff", borderRadius: 20, padding: 20, color: "var(--slate)", maxWidth: 420, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--slate-soft)", fontWeight: 600 }}>TOMORROW · Wed, Sep 9</div>
                <div className="tc-serif" style={{ fontSize: 19, fontWeight: 600 }}>3 lessons to prepare</div>
              </div>
              <ReadinessRing pct={72} size={54} stroke={6} />
            </div>
            {INITIAL_LESSONS.map((l, i) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{l.subject}</div>
                  <div style={{ fontSize: 12.5, color: "var(--slate-soft)" }}>{l.className} · {l.topic}</div>
                </div>
                <StatusBadge status={i === 0 ? "almost" : "none"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 20px" }}>
        <h2 className="tc-serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Three steps, most nights under ten minutes</h2>
        <p style={{ color: "var(--slate-soft)", marginBottom: 32, maxWidth: 520 }}>No setup, no gradebook, no admin. Just tomorrow's lessons.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 18 }}>
          {[
            { t: "See tomorrow", d: "Open the app and instantly see every class you teach tomorrow, with a readiness score for each." },
            { t: "Prepare with AI", d: "Generate a full lesson — objectives, activities, practice, homework — in seconds, then edit anything." },
            { t: "Feel ready", d: "Watch your readiness reach 100% and close the laptop knowing tomorrow is handled." },
          ].map((s, i) => (
            <div key={i} className="tc-card" style={{ padding: 22 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{s.t}</div>
              <div style={{ fontSize: 14, color: "var(--slate-soft)", lineHeight: 1.55 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--paper-2)", padding: "60px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 className="tc-serif" style={{ fontSize: 26, fontWeight: 600, marginBottom: 28 }}>Teachers using the free version</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 18 }}>
            {[
              { n: "Adjoa K.", r: "JHS Mathematics", q: "I used to spend Sunday afternoons planning the whole week. Now I do it the night before, in less time." },
              { n: "Kwabena A.", r: "Primary English", q: "The 10-minute mode has saved me more than once when I forgot to prepare the night before." },
              { n: "Efua M.", r: "Integrated Science", q: "I still edit what the AI gives me, but it's a real starting point, not a blank page." },
            ].map((t, i) => (
              <div key={i} className="tc-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#E8A659" color="#E8A659" />)}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--slate)", marginBottom: 14 }}>"{t.q}"</p>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{t.n}</div>
                <div style={{ fontSize: 12.5, color: "var(--slate-soft)" }}>{t.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 20px" }}>
        <h2 className="tc-serif" style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Free is genuinely useful</h2>
        <p style={{ color: "var(--slate-soft)", marginBottom: 32, maxWidth: 520 }}>Premium just gives you more of what already works.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 18 }}>
          <div className="tc-card" style={{ padding: 26 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Free</div>
            <div style={{ color: "var(--slate-soft)", fontSize: 14, marginBottom: 18 }}>Everything you need to prepare tomorrow</div>
            {["Unlimited lesson tracking", "5 AI preparations / month", "10-minute emergency mode", "Basic worksheets & quizzes"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, padding: "7px 0" }}><Check size={15} color="#6B8F7B" /> {f}</div>
            ))}
          </div>
          <div className="tc-card" style={{ padding: 26, background: "var(--ink)", color: "#fff", border: "none", position: "relative" }}>
            <div className="tc-badge" style={{ background: "var(--dawn)", color: "var(--ink)", position: "absolute", top: 22, right: 22 }}>Popular</div>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Premium — GH₵5/month</div>
            <div style={{ color: "#C7CCE3", fontSize: 14, marginBottom: 18 }}>For teachers who prepare every single night</div>
            {["Unlimited AI preparations", "Unlimited worksheets & quizzes", "Saved reusable lesson templates", "Advanced preparation insights"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, padding: "7px 0" }}><Check size={15} color="#E8A659" /> {f}</div>
            ))}
            <button className="tc-btn tc-btn-dawn" style={{ width: "100%", marginTop: 16 }} onClick={onStart}>Start free, upgrade anytime</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 20px 70px" }}>
        <h2 className="tc-serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 18 }}>Before you start</h2>
        {[
          { q: "What does the AI actually do?", a: "It drafts objectives, activities, practice and homework based on your subject, class and topic. You review and edit everything before it's saved — nothing goes to your students unchanged." },
          { q: "What happens to my lesson content?", a: "Your lessons stay in your account and are only used to help prepare your own classes. They're not shared with other teachers or schools." },
          { q: "What does Free actually include?", a: "Unlimited lesson tracking and five AI preparations a month — enough for a full teaching week for most subjects." },
        ].map((f, i) => (
          <div key={i} className="tc-card" style={{ marginBottom: 10 }}>
            <button className="tc-accordion-head" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span style={{ fontWeight: 600, fontSize: 14.5 }}>{f.q}</span>
              <ChevronDown size={16} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
            {openFaq === i && <div style={{ padding: "0 18px 16px", fontSize: 14, color: "var(--slate-soft)", lineHeight: 1.6 }}>{f.a}</div>}
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button className="tc-btn tc-btn-primary" onClick={onStart}>Get started free <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
