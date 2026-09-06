import React, { useState } from "react";
import { Home as HomeIcon, Wrench, Star } from "lucide-react";
import Home from "./Home";
import LessonWorkspace from "./LessonWorkspace";
import Tools from "./Tools";
import Premium from "./Premium";

export default function AppShell({
  courses, upcomingDays, setLessonInstances, onToast, apiKey, onOpenSettings, installBanner,
  onAddCourse, onManageCourses, onShowHelp,
}) {
  const [tab, setTab] = useState("home");
  const [openInstanceId, setOpenInstanceId] = useState(null);
  const allInstances = upcomingDays.flatMap((d) => d.instances);
  const openInstance = allInstances.find((l) => l.id === openInstanceId);
  const openCourse = openInstance ? courses.find((c) => c.id === openInstance.courseId) : null;

  function updateInstance(next) {
    setLessonInstances((prev) => prev.map((l) => (l.id === next.id ? next : l)));
  }

  let content;
  if (openInstance) {
    content = (
      <LessonWorkspace
        lesson={openInstance}
        course={openCourse}
        onChange={updateInstance}
        onBack={() => setOpenInstanceId(null)}
        onToast={onToast}
        apiKey={apiKey}
        onOpenSettings={onOpenSettings}
      />
    );
  } else if (tab === "home") {
    content = (
      <Home
        courses={courses}
        upcomingDays={upcomingDays}
        onOpenLesson={setOpenInstanceId}
        installBanner={installBanner}
        onAddCourse={onAddCourse}
        onManageCourses={onManageCourses}
        onShowHelp={onShowHelp}
        onOpenSettings={onOpenSettings}
      />
    );
  } else if (tab === "tools") {
    content = <Tools onToast={onToast} onGoHome={() => setTab("home")} />;
  } else {
    content = <Premium onToast={onToast} />;
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 70, background: "var(--bg-muted)" }}>
      {content}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid var(--border)", display: "flex", padding: "8px 10px calc(8px + env(safe-area-inset-bottom))", zIndex: 30 }}>
        <button className={`tc-nav-item ${tab === "home" && !openInstance ? "active" : ""}`} onClick={() => { setTab("home"); setOpenInstanceId(null); }}>
          <HomeIcon size={20} /> Tomorrow
        </button>
        <button className={`tc-nav-item ${tab === "tools" && !openInstance ? "active" : ""}`} onClick={() => { setTab("tools"); setOpenInstanceId(null); }}>
          <Wrench size={20} /> Tools
        </button>
        <button className={`tc-nav-item ${tab === "premium" && !openInstance ? "active" : ""}`} onClick={() => { setTab("premium"); setOpenInstanceId(null); }}>
          <Star size={20} /> Premium
        </button>
      </nav>
    </div>
  );
}
