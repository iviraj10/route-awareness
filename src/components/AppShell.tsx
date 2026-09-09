import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Map, BarChart3, ShieldCheck, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Accident Map", icon: Map },
  { to: "/analysis", label: "Analysis", icon: BarChart3 },
  { to: "/safety", label: "Safety Information", icon: ShieldCheck },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-border bg-surface shrink-0 border-b md:h-screen md:w-60 md:border-r md:border-b-0">
        <div className="md:sticky md:top-0">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
              <TriangleAlert className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Hotspot Analysis</p>
              <p className="text-muted-foreground text-xs">Road accident data</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col md:gap-0.5">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground font-medium" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-secondary/60" }}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-8">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {children}
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">{children}</div>;
}
