import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { AccidentRecord } from "@/data/accidents";
import { severityColor } from "@/lib/accident-analytics";

const AccidentMap = lazy(() => import("@/components/AccidentMap"));

interface Props {
  records: AccidentRecord[];
  height?: string;
  interactive?: boolean;
  zoom?: number;
}

function Placeholder({ height }: { height: string }) {
  return (
    <div
      style={{ height }}
      className="bg-muted text-muted-foreground flex items-center justify-center text-sm"
    >
      Loading map…
    </div>
  );
}

export function MapPanel({ records, height = "520px", interactive = true, zoom = 11 }: Props) {
  return (
    <div className="border-border bg-surface shadow-card overflow-hidden rounded-lg border">
      <ClientOnly fallback={<Placeholder height={height} />}>
        <Suspense fallback={<Placeholder height={height} />}>
          <AccidentMap
            records={records}
            height={height}
            interactive={interactive}
            zoom={zoom}
          />
        </Suspense>
      </ClientOnly>
      <div className="border-border text-muted-foreground flex flex-wrap items-center gap-4 border-t px-4 py-3 text-xs">
        {(["Fatal", "Serious", "Minor"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: severityColor[s] }}
            />
            {s}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-fatal/25" />
          Shaded area = accident concentration
        </span>
        <span className="ml-auto font-mono">{records.length} accidents shown</span>
      </div>
    </div>
  );
}
