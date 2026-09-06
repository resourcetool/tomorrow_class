import React from "react";
import {
  Target, BookOpen, PenLine, Users, ClipboardList, ShieldCheck, FileText, Library, Lightbulb,
} from "lucide-react";

export const SECTION_META = [
  { key: "objectives", label: "Learning objectives", icon: <Target size={16} /> },
  { key: "intro", label: "Introduction", icon: <BookOpen size={16} /> },
  { key: "teachingPoints", label: "Teaching points", icon: <PenLine size={16} /> },
  { key: "activity", label: "Classroom activity", icon: <Users size={16} /> },
  { key: "practice", label: "Practice", icon: <ClipboardList size={16} /> },
  { key: "assessment", label: "Assessment", icon: <ShieldCheck size={16} /> },
  { key: "homework", label: "Homework", icon: <FileText size={16} /> },
  { key: "materials", label: "Materials", icon: <Library size={16} /> },
  { key: "notes", label: "Teacher notes", icon: <Lightbulb size={16} /> },
];

export const AI_BANK = {
  objectives: (l) => `By the end of the lesson, learners will be able to explain ${l.topic.toLowerCase()} in their own words and apply it to at least two practice problems.`,
  intro: (l) => `Open with a quick real-life example connected to ${l.topic.toLowerCase()}. Ask learners what they already know, and note responses on the board.`,
  teachingPoints: (l) => `1) Define the key idea behind ${l.topic.toLowerCase()}.\n2) Work through one worked example on the board.\n3) Highlight the common mistake learners make with this topic.`,
  activity: (l) => `Pair learners up. Each pair solves one short problem on ${l.topic.toLowerCase()} on a shared sheet, then swaps with another pair to check work.`,
  practice: (l) => `Give 3 individual practice questions of increasing difficulty on ${l.topic.toLowerCase()} for learners to complete in class.`,
  assessment: (l) => `Exit ticket: one question on ${l.topic.toLowerCase()} that learners answer on a slip of paper before leaving.`,
  homework: (l) => `Two practice questions on ${l.topic.toLowerCase()} plus one that asks learners to find a real-world example.`,
  materials: (l) => `Whiteboard, exercise books, ${l.subject === "Integrated Science" ? "diagram handout" : "ruler and pencil"}.`,
  notes: () => `Keep pace flexible — slow down on the worked example if learners look unsure before moving to independent practice.`,
};

export const QUICK_BANK = {
  teachingPoints: (l) => `Quick version: state the key idea on ${l.topic.toLowerCase()} in one sentence, do one example, then send learners straight to practice.`,
  activity: () => `Skip group work today — go straight from example to individual practice to save time.`,
  homework: (l) => `One question on ${l.topic.toLowerCase()} to reinforce today's lesson.`,
};

export function emptySections() {
  return { objectives: "", intro: "", teachingPoints: "", activity: "", practice: "", assessment: "", homework: "", materials: "", notes: "" };
}

export function computeProgress(sections) {
  const total = SECTION_META.length;
  const filled = SECTION_META.filter((s) => sections[s.key] && sections[s.key].trim().length > 0).length;
  return Math.round((filled / total) * 100);
}

export function statusFromPct(pct) {
  if (pct >= 100) return "ready";
  if (pct > 0) return "almost";
  return "none";
}

export function createLesson({ subject, className, topic, duration }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    subject: (subject || "").trim(),
    className: (className || "").trim(),
    topic: (topic || "").trim(),
    duration: (duration || "").trim() || "40 min",
    sections: emptySections(),
  };
}
