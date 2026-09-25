import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <Link className="site-brand" href="/">
          ACT Prep
        </Link>
      </header>
      <main className="page-main">{children}</main>
    </>
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
