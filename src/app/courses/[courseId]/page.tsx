import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseHeroCopy } from "@/components/course-hero-copy";
import { SiteShell } from "@/components/course-navigation";
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
    description:
      course?.shortDescription ?? "The requested course is not available.",
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
    <SiteShell trail={[{ label: course.title, href: `/courses/${course.id}` }]}>
      <header
        className={
          course.coverImage
            ? "page-intro course-hero course-hero--covered"
            : "page-intro course-hero"
        }
      >
        <CourseHeroCopy
          hasCover={Boolean(course.coverImage)}
          title={course.title}
          longDescription={course.longDescription}
        />
        {course.coverImage && (
          <Image
            className="course-hero-image"
            src={course.coverImage}
            alt="Student filling in an ACT answer sheet."
            width={612}
            height={408}
            preload
          />
        )}
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
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
