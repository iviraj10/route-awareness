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
    <div className="border-border bg-surface shadow-card min-h-30 rounded-lg border border-t-2 border-t-primary/55 p-4.5">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      <p className="mt-2.5 truncate font-mono text-xl font-semibold leading-none sm:text-2xl" title={String(value)}>
        {value}
      </p>
      {detail ? <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{detail}</p> : null}
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
      <div className="border-border flex items-start justify-between gap-4 border-b px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? (
            <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
