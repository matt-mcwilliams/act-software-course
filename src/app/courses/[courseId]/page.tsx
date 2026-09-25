import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackNavigation, SiteShell } from "@/components/course-navigation";
import { getCourseById } from "@/data/course-catalog";

type CoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  return {
    title: course?.title ?? "Course not found",
    description: course?.description ?? "The requested course is not available.",
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  const modules = [...course.modules].sort(
    (first, second) => first.order - second.order,
  );

  return (
    <SiteShell>
      <BackNavigation links={[{ label: "All courses", href: "/" }]} />

      <header className="page-intro">
        <h1 className="page-title">{course.title}</h1>
      </header>

      <section aria-labelledby="modules-heading">
        <h2 className="section-title" id="modules-heading">
          Modules
        </h2>

        <ol className="module-list" role="list">
          {modules.map((module) => (
            <li key={module.id}>
              <Link
                className="module-link"
                href={`/courses/${course.id}/modules/${module.id}`}
              >
                <span className="module-number" aria-hidden="true">
                  {String(module.order).padStart(2, "0")}
                </span>
                <span className="module-copy">
                  <span className="module-title">{module.title}</span>
                  <span className="module-description">
                    {module.atoms.length} activities
                  </span>
                </span>
                <span className="module-action">View {module.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
