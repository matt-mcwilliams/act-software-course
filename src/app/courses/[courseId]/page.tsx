import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, SiteShell } from "@/components/course-navigation";
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

  const modules = [...course.modules].sort((first, second) => first.order - second.order);

  return (
    <SiteShell>
      <Breadcrumb
        items={[
          { label: "All courses", href: "/" },
          { label: course.title },
        ]}
      />

      <header className="page-intro">
        <h1 className="page-title">{course.title}</h1>
        <p className="page-description">
          Modules are intended to be followed in order.
        </p>
      </header>

      <section aria-labelledby="modules-heading">
        <div className="section-heading">
          <h2 className="section-title" id="modules-heading">
            Modules
          </h2>
          <p className="section-note">
            {modules.length} available {modules.length === 1 ? "module" : "modules"}
          </p>
        </div>

        <ol className="module-list">
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
                    {module.description}
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
