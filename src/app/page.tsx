import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "@/data/course-catalog";
import { SiteShell } from "@/components/course-navigation";

export const metadata: Metadata = {
  title: "Courses",
  description: "Choose an ACT course to explore its modules and activities.",
};

export default function CoursesPage() {
  return (
    <SiteShell>
      <header className="page-intro">
        <h1 className="page-title">Courses</h1>
        <p className="page-description">
          Choose any course to begin. Courses can be taken in any order.
        </p>
      </header>

      <section aria-label="Available courses">
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                className="course-link"
                href={`/courses/${course.id}`}
              >
                <span className="course-link-content">
                  <span className="course-title">{course.title}</span>
                  <span className="course-description">
                    {course.description}
                  </span>
                </span>
                <span className="course-action">View modules</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
