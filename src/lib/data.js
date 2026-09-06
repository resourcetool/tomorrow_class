import React from "react";
import { Sunrise, BookOpen, ShieldCheck, FileText } from "lucide-react";

export const WEEKDAYS = [
  { key: "Sun", label: "Sun" },
  { key: "Mon", label: "Mon" },
  { key: "Tue", label: "Tue" },
  { key: "Wed", label: "Wed" },
  { key: "Thu", label: "Thu" },
  { key: "Fri", label: "Fri" },
  { key: "Sat", label: "Sat" },
];
const WEEKDAY_BY_INDEX = WEEKDAYS.map((d) => d.key); // JS getDay(): 0 = Sun ... 6 = Sat

export function weekdayKeyForDate(date) {
  return WEEKDAY_BY_INDEX[date.getDay()];
}

export function todayIsoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// Fields aligned to the Ghana Education Service Standards-Based Curriculum
// lesson note format.
export const DETAIL_META = [
  { key: "strand", label: "Strand" },
  { key: "subStrand", label: "Sub-strand" },
  { key: "contentStandard", label: "Content standard" },
  { key: "indicator", label: "Indicator (learning outcome)" },
  { key: "coreCompetencies", label: "Core competencies" },
  { key: "keywords", label: "Keywords" },
  { key: "teachingResources", label: "Teaching / learning resources" },
];

export const PHASE_META = [
  { key: "starterActivity", label: "Starter activity", icon: <Sunrise size={16} /> },
  { key: "mainActivity", label: "Main / new learning", icon: <BookOpen size={16} /> },
  { key: "plenary", label: "Plenary, reflection & assessment", icon: <ShieldCheck size={16} /> },
  { key: "homework", label: "Homework", icon: <FileText size={16} /> },
];

export const ALL_FIELDS = [...DETAIL_META, ...PHASE_META];

export function emptySections() {
  const obj = {};
  ALL_FIELDS.forEach((f) => { obj[f.key] = ""; });
  return obj;
}

export function computeProgress(sections) {
  const total = ALL_FIELDS.length;
  const filled = ALL_FIELDS.filter((f) => sections[f.key] && sections[f.key].trim().length > 0).length;
  return Math.round((filled / total) * 100);
}

export function statusFromPct(pct) {
  if (pct >= 100) return "ready";
  if (pct > 0) return "almost";
  return "none";
}

// Offline fallback drafts — used only if a live AI request fails.
export const AI_BANK = {
  strand: (l) => `Strand relevant to "${l.topic}" — check this against your syllabus for the exact strand name.`,
  subStrand: (l) => `Sub-strand covering "${l.topic}".`,
  contentStandard: (l) => `Learners demonstrate understanding of ${l.topic.toLowerCase()} — check the exact content standard code in the syllabus.`,
  indicator: (l) => `By the end of the lesson, the learner will be able to explain and apply ${l.topic.toLowerCase()}.`,
  coreCompetencies: () => `Critical Thinking and Problem Solving; Communication and Collaboration.`,
  keywords: (l) => `${l.topic}`,
  teachingResources: (l) => `Textbook, whiteboard, exercise books${l.subject === "Integrated Science" ? ", diagram handout" : ""}.`,
  starterActivity: (l) => `Briefly review the previous lesson, then introduce "${l.topic}" with a short question or real-life example to spark interest.`,
  mainActivity: (l) => `Explain the key idea behind ${l.topic.toLowerCase()}, work through one example together, then have learners practice in pairs or small groups while you circulate and support.`,
  plenary: (l) => `Ask a few learners to summarise what was learned about ${l.topic.toLowerCase()}. Give a short oral or written question to check understanding and address any misconceptions.`,
  homework: (l) => `1-2 practice questions on ${l.topic.toLowerCase()} to consolidate the lesson.`,
};

export const QUICK_BANK = {
  mainActivity: (l) => `Quick version: state the key idea on ${l.topic.toLowerCase()} in one or two sentences, do one example, then move straight to independent practice.`,
  plenary: () => `One quick question to check understanding before ending the lesson.`,
  homework: (l) => `One question on ${l.topic.toLowerCase()} to reinforce today's lesson.`,
};

export function createCourse({ subject, className, duration, days }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    subject: (subject || "").trim(),
    className: (className || "").trim(),
    duration: (duration || "").trim() || "40 min",
    days: Array.isArray(days) && days.length ? days : ["Mon", "Tue", "Wed", "Thu", "Fri"],
    schemeOfWork: [],
  };
}

export function createSowWeek({ term, week, topic, strand, subStrand, contentStandard, indicator }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    term: term || 1,
    week: week || 1,
    topic: (topic || "").trim(),
    strand: (strand || "").trim(),
    subStrand: (subStrand || "").trim(),
    contentStandard: (contentStandard || "").trim(),
    indicator: (indicator || "").trim(),
  };
}

// Simple day-count week number within whichever term is currently selected.
export function computeWeekNumber(dateStr, termStartDateStr) {
  if (!termStartDateStr) return null;
  const date = new Date(`${dateStr}T00:00:00`);
  const start = new Date(`${termStartDateStr}T00:00:00`);
  const diffDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;
  return Math.floor(diffDays / 7) + 1;
}

export function findSowEntry(course, term, week) {
  if (!course) return null;
  return course.schemeOfWork.find((w) => w.term === term && w.week === week) || null;
}

export function createLessonInstance(course, dateStr, sowEntry) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    courseId: course.id,
    date: dateStr,
    subject: course.subject,
    className: course.className,
    duration: course.duration,
    topic: sowEntry?.topic || "",
    sections: {
      ...emptySections(),
      strand: sowEntry?.strand || "",
      subStrand: sowEntry?.subStrand || "",
      contentStandard: sowEntry?.contentStandard || "",
      indicator: sowEntry?.indicator || "",
    },
  };
}
