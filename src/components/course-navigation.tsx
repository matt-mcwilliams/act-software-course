import Link from "next/link";
import { House } from "lucide-react";
import type { ReactNode } from "react";

export function SiteShell({ children, variant }: { children: ReactNode; variant?: "lesson" }) {
  return (
    <div className={variant === "lesson" ? "site-shell site-shell--lesson" : "site-shell"}>
      <header className="site-header">
        <Link className="site-home" href="/" aria-label="Home">
          <House aria-hidden="true" size={20} strokeWidth={1.8} />
        </Link>
      </header>
      <main className="page-main">{children}</main>
    </div>
  );
}

type BackLink = {
  label: string;
  href: string;
};

export function BackNavigation({ links }: { links: BackLink[] }) {
  return (
    <nav className="back-navigation" aria-label="Back navigation">
      {links.map((link, index) => (
        <span className="back-navigation-item" key={link.href}>
          {index > 0 && <span aria-hidden="true">/</span>}
          <Link href={link.href}>{link.label}</Link>
        </span>
      ))}
    </nav>
  );
}
