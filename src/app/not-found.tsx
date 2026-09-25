import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/course-navigation";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested course or module could not be found.",
};

export default function NotFound() {
  return (
    <SiteShell>
      <header className="page-intro">
        <h1 className="page-title">This course page isn’t available</h1>
        <p className="page-description">
          The course or module may have moved, or the address may be incorrect.
        </p>
      </header>
      <Link className="back-link" href="/">
        All courses
      </Link>
    </SiteShell>
  );
}
