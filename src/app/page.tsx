import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
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
      </header>

      <section aria-label="Available courses">
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course.id}>
              <Link
                className={
                  course.coverImage
                    ? "course-link course-link--covered"
                    : "course-link"
                }
                href={`/courses/${course.id}`}
              >
                {course.coverImage && (
                  <Image
                    className="course-cover-image"
                    src={course.coverImage}
                    alt="Student filling in an ACT answer sheet."
                    width={612}
                    height={408}
                  />
                )}
                <div
                  className={
                    course.coverImage
                      ? "course-link-content course-link-content--covered"
                      : "course-link-content"
                  }
                >
                  <div>
                    <h2 className="course-title">{course.title}</h2>
                    <p className="course-description">{course.description}</p>
                  </div>
                  <span className="course-action">View course ➜</span>
                </div>
              </Link>
            </li>
          ))}
          <li className="course-placeholder">
            <Clock3
              className="course-placeholder-icon"
              aria-hidden="true"
              size={36}
              strokeWidth={1.5}
            />
            <h2 className="course-title">More coming soon</h2>
          </li>
        </ul>
      </section>
    </SiteShell>
  );
}
