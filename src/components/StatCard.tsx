import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
}) {
  return (
    <div className="border-border bg-surface shadow-card rounded-lg border p-5">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      <p className="mt-2 truncate font-mono text-2xl font-semibold" title={String(value)}>
        {value}
      </p>
      {detail ? <p className="text-muted-foreground mt-1 text-xs">{detail}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="border-border bg-surface shadow-card rounded-lg border">
      <div className="border-border flex items-start justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description ? (
            <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
