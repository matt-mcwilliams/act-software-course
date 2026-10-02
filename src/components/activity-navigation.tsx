import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ActivityNavigation({ previousHref, nextHref }: { previousHref?: string; nextHref?: string }) {
  if (!previousHref && !nextHref) return null;

  return <nav className="lesson-navigation" aria-label="Activity navigation">
    {previousHref && <Link href={previousHref} className="lesson-navigation-link"><ArrowLeft size={17} aria-hidden="true" />Previous activity</Link>}
    {nextHref && <Link href={nextHref} className="lesson-navigation-link lesson-navigation-link--next">Next activity<ArrowRight size={17} aria-hidden="true" /></Link>}
  </nav>;
}
