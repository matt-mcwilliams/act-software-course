import type { AtomSummary } from "@/data/course-catalog";

export function isSupportedActivity(atom: AtomSummary | undefined): atom is AtomSummary {
  return atom?.availability === "published" && (atom.type === "video" || atom.id === "eng-ss-anatomy-practice" || atom.id === "eng-ss-fragments-act-practice" || atom.id === "eng-ss-separator-practice" || atom.id === "eng-ss-run-ons-act-practice");
}
