"use client";

import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ListVideo, Video } from "lucide-react";
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
  const index = atoms.findIndex((entry) => entry.id === atom.id);
  const previous = atoms[index - 1];
  const next = atoms[index + 1];
  const atomHref = (entry: AtomSummary) => `${moduleHref}/activities/${entry.id}`;

  return (
    <section className="video-lesson" aria-labelledby="lesson-title">
      <header className="lesson-heading">
        <p className="lesson-meta">Video lesson · Activity {index + 1} of {atoms.length}</p>
        <h1 id="lesson-title" className="lesson-title">{atom.title}</h1>
      </header>
      <div className="lesson-toolbar">
        <span>{moduleTitle}</span>
        <button className="lesson-toggle" type="button" aria-expanded={sidebarOpen} aria-controls="lesson-activities" onClick={() => setSidebarPreference(!sidebarOpen)}>
          <ListVideo size={19} aria-hidden="true" />
          {sidebarOpen ? "Hide activities" : "Show activities"}
        </button>
      </div>
      <div className={`lesson-layout${sidebarOpen ? " lesson-layout--open" : ""}`}>
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
                {isSupported(entry) ? <Link className="sequence-entry" href={atomHref(entry)} aria-current={current ? "page" : undefined}>{content}</Link> : <div className="sequence-entry sequence-entry--planned">{content}</div>}
              </li>;
            })}
          </ol>
        </aside>
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
