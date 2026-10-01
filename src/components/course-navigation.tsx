import Link from "next/link";
import { House } from "lucide-react";
import type { ReactNode } from "react";

type TrailItem = { label: string; href: string };

export function SiteShell({ children, variant, trail = [] }: { children: ReactNode; variant?: "lesson"; trail?: TrailItem[] }) {
  return (
    <div className={variant === "lesson" ? "site-shell site-shell--lesson" : "site-shell"}>
      <header className="site-header">
        <Link className="site-home" href="/" aria-label="Home">
          <House aria-hidden="true" size={20} strokeWidth={1.8} />
        </Link>
        {trail.length > 0 && (
          <nav className="site-trail" aria-label="Current location">
            {trail.map((item, index) => (
              <span className="site-trail-item" key={item.href}>
                <span className="site-trail-separator" aria-hidden="true">/</span>
                <Link href={item.href} aria-current={index === trail.length - 1 ? "page" : undefined}>
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
      </header>
      <main className="page-main">{children}</main>
    </div>
  );
}
