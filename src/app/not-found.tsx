import type { Metadata } from "next";
import { SiteShell } from "@/components/course-navigation";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested course or module could not be found.",
};

export default function NotFound() {
  return (
    <SiteShell>
      <header className="page-intro">
        <h1 className="page-title">Page not found</h1>
        <p className="page-description">
          We couldn’t find that course or module.
        </p>
      </header>
    </SiteShell>
  );
}
