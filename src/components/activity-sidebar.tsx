"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, ClipboardList, Pencil, Video } from "lucide-react";
import type { AtomSummary, AtomType } from "@/data/course-catalog";

const activityLabels: Record<AtomType, string> = {
  video: "Video",
  "custom-practice": "Custom practice",
  "act-practice": "ACT practice",
  "mastery-check": "Mastery check",
};
const activityIcons = { video: Video, "custom-practice": Pencil, "act-practice": ClipboardList, "mastery-check": BadgeCheck };

function subscribeToViewport(callback: () => void) {
  const query = window.matchMedia("(min-width: 64rem)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function isDesktop() {
  return window.matchMedia("(min-width: 64rem)").matches;
}

export function isSupportedActivity(atom: AtomSummary | undefined): atom is AtomSummary {
  return atom?.availability === "published" && (atom.type === "video" || atom.id === "eng-ss-anatomy-practice" || atom.id === "eng-ss-fragments-act-practice");
}

export function ActivitySidebar({ atom, atoms, moduleHref }: {
  atom: AtomSummary;
  atoms: AtomSummary[];
  moduleHref: string;
}) {
  const desktop = useSyncExternalStore(subscribeToViewport, isDesktop, () => false);
  const [sidebarPreference, setSidebarPreference] = useState<boolean | null>(null);
  const sidebarOpen = sidebarPreference ?? desktop;
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarPreference(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);
  const atomHref = (entry: AtomSummary) => `${moduleHref}/activities/${entry.id}`;

  return (
    <div className="activity-sidebar" data-activities-open={sidebarOpen}>
      <div className="lesson-pane">
        <button ref={toggleRef} className="lesson-toggle" type="button"
          aria-label={sidebarOpen ? "Hide activities" : "Show activities"}
          aria-expanded={sidebarOpen} aria-controls="lesson-activities"
          onClick={() => setSidebarPreference(!sidebarOpen)}>
          {sidebarOpen ? <ArrowLeft size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
        </button>
        <aside id="lesson-activities" className="lesson-sidebar" hidden={!sidebarOpen} aria-label="Module activities">
          <h2>In this module</h2>
          <ol className="lesson-sequence">
            {atoms.map((entry) => {
              const current = entry.id === atom.id;
              const ActivityIcon = activityIcons[entry.type];
              const content = <>
                <span className="sequence-icon" role="img" aria-label={activityLabels[entry.type]} title={activityLabels[entry.type]}><ActivityIcon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                <span className="sequence-title" title={entry.title}>{entry.title}</span>
              </>;
              return <li key={entry.id}>
                {isSupportedActivity(entry) ? <Link className="sequence-entry" href={atomHref(entry)} onClick={() => { if (!desktop) setSidebarPreference(false); }} aria-current={current ? "page" : undefined}>{content}</Link> : <div className="sequence-entry sequence-entry--planned">{content}</div>}
              </li>;
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
