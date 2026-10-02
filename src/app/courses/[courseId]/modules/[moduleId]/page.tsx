import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ClipboardList, Pencil, Video } from "lucide-react";
import { SiteShell } from "@/components/course-navigation";
import {
  getCourseById,
  getModuleById,
  type AtomSummary,
  type AtomType,
} from "@/data/course-catalog";

const activityTypes: Record<AtomType, { icon: typeof Video; label: string }> = {
  video: { icon: Video, label: "Video" },
  "custom-practice": { icon: Pencil, label: "Custom practice" },
  "act-practice": { icon: ClipboardList, label: "ACT practice" },
  "mastery-check": { icon: BadgeCheck, label: "Mastery check" },
};

type ModulePageProps = {
  params: Promise<{ courseId: string; moduleId: string }>;
};

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { courseId, moduleId } = await params;
  const course = getCourseById(courseId);
  const courseModule = course ? getModuleById(course, moduleId) : undefined;

  return {
    title:
      course && courseModule
        ? `${course.title}: ${courseModule.title}`
        : "Module not found",
    description:
      courseModule?.description ?? "The requested course module is not available.",
  };
}

function AtomEntry({
  atom,
  courseId,
  moduleId,
}: {
  atom: AtomSummary;
  courseId: string;
  moduleId: string;
}) {
  const activityType = activityTypes[atom.type];
  const ActivityIcon = activityType.icon;
  const helper = atom.type === "custom-practice" ? "Practice" : atom.type === "video"
    ? atom.durationSeconds === undefined
      ? "TBD"
      : `${Math.floor(atom.durationSeconds / 60)}:${String(atom.durationSeconds % 60).padStart(2, "0")}`
    : `${atom.masteryPercent ?? 0}%`;
  const entry = (
    <>
      <span className="atom-type" role="img" aria-label={activityType.label} title={activityType.label}>
        <ActivityIcon aria-hidden="true" size={20} strokeWidth={1.75} />
      </span>
      <span className="atom-title">{atom.title}</span>
      <span className="atom-helper">{helper}</span>
    </>
  );
  const rowClassName = `atom-row${atom.type === "mastery-check" ? " atom-row--mastery" : ""}`;

  return (
    <li className={rowClassName}>
      {atom.availability === "published" ? (
        <Link
          className="atom-link atom-row-content"
          href={`/courses/${courseId}/modules/${moduleId}/activities/${atom.id}`}
        >
          {entry}
        </Link>
      ) : (
        <div className="atom-row-content">{entry}</div>
      )}
    </li>
  );
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseId, moduleId } = await params;
  const course = getCourseById(courseId);
  const courseModule = course ? getModuleById(course, moduleId) : undefined;

  if (!course || !courseModule) {
    notFound();
  }

  const atoms = [...courseModule.atoms].sort(
    (first, second) => first.order - second.order,
  );

  return (
    <SiteShell trail={[
      { label: course.title, href: `/courses/${course.id}` },
      { label: courseModule.title, href: `/courses/${course.id}/modules/${courseModule.id}` },
    ]}>

      <header className="page-intro">
        <h1 className="page-title">{courseModule.title}</h1>
        <p className="page-meta">{atoms.length} activities</p>
      </header>

      <ol className="atom-list" role="list" aria-label="Activity sequence">
        {atoms.map((atom) => (
          <AtomEntry
            key={atom.id}
            atom={atom}
            courseId={course.id}
            moduleId={courseModule.id}
          />
        ))}
      </ol>
    </SiteShell>
  );
}
