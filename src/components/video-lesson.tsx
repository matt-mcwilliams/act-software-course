"use client";

import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, ClipboardList, Pencil, Video } from "lucide-react";
import type { AtomSummary, AtomType } from "@/data/course-catalog";
import anatomyTranscript from "@/data/anatomy-of-a-sentence-transcript.json";

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

function isSupported(atom: AtomSummary | undefined): atom is AtomSummary {
  return atom?.availability === "published" && atom.type === "video";
}

export function VideoLesson({ atom, atoms, moduleHref }: {
  atom: AtomSummary;
  atoms: AtomSummary[];
  moduleHref: string;
}) {
  const desktop = useSyncExternalStore(subscribeToViewport, isDesktop, () => false);
  const [sidebarPreference, setSidebarPreference] = useState<boolean | null>(null);
  const [detailsView, setDetailsView] = useState<"description" | "transcript" | null>("description");
  const sidebarOpen = sidebarPreference ?? desktop;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const detailsRef = useRef<HTMLElement>(null);
  const previousDetailsView = useRef(detailsView);
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
  useEffect(() => {
    const reopened = previousDetailsView.current === null && detailsView !== null;
    previousDetailsView.current = detailsView;
    if (!reopened) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      const panel = detailsRef.current;
      if (!panel) return;
      panel.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: panel.getBoundingClientRect().height > window.innerHeight - 32 ? "start" : "nearest",
      });
    }, reducedMotion ? 0 : 250);
    return () => window.clearTimeout(timer);
  }, [detailsView]);
  const index = atoms.findIndex((entry) => entry.id === atom.id);
  const previous = atoms[index - 1];
  const next = atoms[index + 1];
  const atomHref = (entry: AtomSummary) => `${moduleHref}/activities/${entry.id}`;
  const transcript = atom.id === "eng-ss-anatomy-video" ? anatomyTranscript : [];

  return (
    <section className="video-lesson" data-activities-open={sidebarOpen} aria-labelledby="lesson-title">
      <header className="lesson-heading">
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
              const ActivityIcon = activityIcons[entry.type];
              const content = <>
                <span className="sequence-icon" role="img" aria-label={activityLabels[entry.type]} title={activityLabels[entry.type]}><ActivityIcon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                <span className="sequence-title" title={entry.title}>{entry.title}</span>
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
          {(atom.summary || transcript.length > 0) && <section ref={detailsRef} className="lesson-details" data-collapsed={detailsView === null} aria-label="Lesson details">
            <div className="lesson-details-tabs" role="group" aria-label="Lesson details view">
              <button type="button" id="description-tab" aria-pressed={detailsView === "description"} aria-expanded={detailsView === "description"} aria-controls="description-panel" onClick={() => setDetailsView((view) => view === "description" ? null : "description")}>Description</button>
              {transcript.length > 0 && <button type="button" id="transcript-tab" aria-pressed={detailsView === "transcript"} aria-expanded={detailsView === "transcript"} aria-controls="transcript-panel" onClick={() => setDetailsView((view) => view === "transcript" ? null : "transcript")}>Transcript</button>}
            </div>
            <div className="lesson-details-content">
              <div className="lesson-details-content-inner">
                <div id="description-panel" aria-labelledby="description-tab" aria-hidden={detailsView !== "description"} data-active={detailsView === "description"} className="lesson-details-body lesson-description">
                  {atom.summary?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {transcript.length > 0 && <div id="transcript-panel" aria-labelledby="transcript-tab" hidden={detailsView !== "transcript"} className="lesson-details-body lesson-transcript">
                  {transcript.map((cue, index) => <div className="transcript-cue" key={index}><time>{cue.time}</time><p>{cue.text}</p></div>)}
                </div>}
              </div>
            </div>
          </section>}
          {(isSupported(previous) || isSupported(next)) && <nav className="lesson-navigation" aria-label="Lesson navigation">
            {isSupported(previous) && <Link href={atomHref(previous)} className="lesson-navigation-link"><ArrowLeft size={17} aria-hidden="true" />Previous activity</Link>}
            {isSupported(next) && <Link href={atomHref(next)} className="lesson-navigation-link">Next activity<ArrowRight size={17} aria-hidden="true" /></Link>}
          </nav>}
        </div>
      </div>
    </section>
  );
}
