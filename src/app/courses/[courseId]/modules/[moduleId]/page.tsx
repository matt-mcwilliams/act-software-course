import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackNavigation, SiteShell } from "@/components/course-navigation";
import {
  getCourseById,
  getModuleById,
  type AtomSummary,
} from "@/data/course-catalog";

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
  const entry = (
    <>
      <span className="atom-position" aria-hidden="true">
        {String(atom.order).padStart(2, "0")}
      </span>
      <span className="atom-title">{atom.title}</span>
    </>
  );
  const rowClassName = `atom-row${atom.type === "mastery-check" ? " atom-row--mastery" : ""}`;

  return (
    <li className={rowClassName} value={atom.order}>
      {atom.availability === "published" ? (
        <Link
          className="atom-link atom-row-content"
          href={`/courses/${courseId}/modules/${moduleId}/atoms/${atom.id}`}
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
    <SiteShell>
      <BackNavigation
        links={[
          { label: `${course.title} modules`, href: `/courses/${course.id}` },
        ]}
      />

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
