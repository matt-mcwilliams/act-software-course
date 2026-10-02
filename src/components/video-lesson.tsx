"use client";

import MuxPlayer from "@mux/mux-player-react/lazy";
import { useEffect, useRef, useState } from "react";
import { Video } from "lucide-react";
import type { AtomSummary } from "@/data/course-catalog";
import { isSupportedActivity } from "@/lib/course-activities";
import { ActivityNavigation } from "@/components/activity-navigation";
import anatomyTranscript from "@/data/anatomy-of-a-sentence-transcript.json";

export function VideoLesson({ atom, atoms, moduleHref }: {
  atom: AtomSummary;
  atoms: AtomSummary[];
  moduleHref: string;
}) {
  const [detailsView, setDetailsView] = useState<"description" | "transcript" | null>("description");
  const detailsRef = useRef<HTMLElement>(null);
  const previousDetailsView = useRef(detailsView);
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
    <section className="video-lesson" aria-labelledby="lesson-title">
      <header className="lesson-heading">
        <h1 id="lesson-title" className="lesson-title">{atom.title}</h1>
      </header>
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
          <ActivityNavigation
            previousHref={isSupportedActivity(previous) ? atomHref(previous) : undefined}
            nextHref={isSupportedActivity(next) ? atomHref(next) : undefined}
          />
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
        </div>
      </div>
    </section>
  );
}
