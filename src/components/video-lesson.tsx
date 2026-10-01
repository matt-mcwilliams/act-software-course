"use client";

import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Video } from "lucide-react";
import type { AtomSummary, AtomType } from "@/data/course-catalog";

const activityLabels: Record<AtomType, string> = {
  video: "Video",
  "custom-practice": "Custom practice",
  "act-practice": "ACT practice",
  "mastery-check": "Mastery check",
};

function subscribeToViewport(callback: () => void) {
  const query = window.matchMedia("(min-width: 64rem)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function isDesktop() {
  return window.matchMedia("(min-width: 64rem)").matches;
}

function isSupported(atom: AtomSummary | undefined) {
  return atom?.availability === "published" && atom.type === "video";
}

export function VideoLesson({ atom, atoms, moduleTitle, moduleHref }: {
  atom: AtomSummary;
  atoms: AtomSummary[];
  moduleTitle: string;
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
  const index = atoms.findIndex((entry) => entry.id === atom.id);
  const previous = atoms[index - 1];
  const next = atoms[index + 1];
  const atomHref = (entry: AtomSummary) => `${moduleHref}/activities/${entry.id}`;

  return (
    <section className="video-lesson" data-activities-open={sidebarOpen} aria-labelledby="lesson-title">
      <header className="lesson-heading">
        <p className="lesson-module-label"><BookOpen size={16} aria-hidden="true" />{moduleTitle}</p>
        <h1 id="lesson-title" className="lesson-title">{atom.title}</h1>
      </header>
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
              const content = <>
                <span className="sequence-number" aria-hidden="true">{String(entry.order).padStart(2, "0")}</span>
                <span><span className="sequence-title">{entry.title}</span><span className="sequence-meta">{activityLabels[entry.type]}{current ? " · Current lesson" : entry.availability === "planned" ? " · Coming soon" : ""}</span></span>
              </>;
              return <li key={entry.id}>
                {isSupported(entry) ? <Link className="sequence-entry" href={atomHref(entry)} onClick={() => { if (!desktop) setSidebarPreference(false); }} aria-current={current ? "page" : undefined}>{content}</Link> : <div className="sequence-entry sequence-entry--planned">{content}</div>}
              </li>;
            })}
          </ol>
        </aside>
      </div>
      <div className="lesson-layout">
        <div className="lesson-content">
          <div className="lesson-player">
            {atom.muxPlaybackId ? <MuxPlayer
              playbackId={atom.muxPlaybackId}
              streamType="on-demand"
              autoPlay={false}
              preload="metadata"
              metadata={{ video_id: atom.id, video_title: atom.title }}
              accentColor="#ffffff"
              aria-label={atom.title}
            /> : <div className="lesson-empty"><Video size={32} aria-hidden="true" /><p>Video coming soon</p></div>}
          </div>
          {atom.summary && <section className="lesson-summary" aria-labelledby="lesson-summary-title">
            <h2 id="lesson-summary-title">Summary</h2>
            {atom.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>}
          <nav className="lesson-navigation" aria-label="Lesson navigation">
            <Link href={isSupported(previous) ? atomHref(previous) : moduleHref} className="lesson-navigation-link"><ArrowLeft size={17} aria-hidden="true" />{isSupported(previous) ? "Previous activity" : "Back to module"}</Link>
            {isSupported(next) && <Link href={atomHref(next)} className="lesson-navigation-link">Next activity<ArrowRight size={17} aria-hidden="true" /></Link>}
          </nav>
          {isSupported(previous) && <Link className="lesson-module-return" href={moduleHref}>Back to module</Link>}
        </div>
      </div>
    </section>
  );
}
