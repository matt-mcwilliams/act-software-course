import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="site-brand" href="/">
          ACT Course
        </Link>
        <span className="site-header-note">Choose a course in any order</span>
      </header>
      <main className="page-main">{children}</main>
    </div>
  );
}

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="breadcrumb-item" key={`${item.label}-${index}`}>
              {index > 0 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span
                  className={isCurrent ? "breadcrumb-current" : undefined}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
