import Link from "next/link";
import { House, Menu } from "lucide-react";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <Link className="site-home" href="/" aria-label="Home">
          <House aria-hidden="true" size={20} strokeWidth={1.8} />
        </Link>
        <span className="site-menu-placeholder" role="img" aria-label="Menu">
          <Menu aria-hidden="true" size={20} strokeWidth={1.8} />
        </span>
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
