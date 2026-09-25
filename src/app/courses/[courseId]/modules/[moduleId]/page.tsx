import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, SiteShell } from "@/components/course-navigation";
import {
  getCourseById,
  getModuleById,
  type AtomSummary,
  type AtomType,
} from "@/data/course-catalog";

type ModulePageProps = {
  params: Promise<{ courseId: string; moduleId: string }>;
};

const atomTypeLabels: Record<AtomType, string> = {
  video: "Video",
  "custom-practice": "Custom practice",
  "act-practice": "ACT practice problems",
  "mastery-check": "Mastery check",
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
      <span className="atom-kind">{atomTypeLabels[atom.type]}</span>
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
      <Breadcrumb
        items={[
          { label: "All courses", href: "/" },
          { label: `${course.title} modules`, href: `/courses/${course.id}` },
          { label: courseModule.title },
        ]}
      />

      <header className="page-intro">
        <h1 className="page-title">{courseModule.title}</h1>
        <p className="module-summary">{courseModule.description}</p>
      </header>

      <section className="sequence-section" aria-labelledby="sequence-heading">
        <h2 className="sequence-heading" id="sequence-heading">
          Activity sequence
        </h2>
        <p className="sequence-guidance">
          Activities are intended to be taken in order.
        </p>

        <ol className="atom-list">
          {atoms.map((atom) => (
            <AtomEntry
              key={atom.id}
              atom={atom}
              courseId={course.id}
              moduleId={courseModule.id}
            />
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
