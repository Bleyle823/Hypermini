import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  title,
  children,
  right,
}: {
  className?: string;
  title?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
      >
      {((title ?? right) != null) && (
        <header className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">
            {title}
          </h3>
          {right}
        </header>
      )}
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}


