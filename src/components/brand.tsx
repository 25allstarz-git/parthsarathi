import { Scale, Sparkles, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, URGENCY_LABEL, type CaseStatus, type CaseUrgency } from "@/lib/nyaysetu";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-sm bg-primary text-gold">
        <Scale className="size-5" strokeWidth={1.5} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[1.35rem] font-semibold tracking-tight text-primary">
            ParthSarathi
          </span>
          <span className="mt-1 block text-[11px] leading-none text-muted-foreground">पार्थसारथी</span>
        </span>
      )}
    </span>
  );
}


const urgencyStyles: Record<CaseUrgency, string> = {
  critical: "border-critical/40 bg-critical/10 text-critical",
  high: "border-high/40 bg-high/10 text-high",
  medium: "border-medium/50 bg-medium/15 text-medium-foreground",
  low: "border-low/40 bg-low/10 text-low",
};

export function UrgencyBadge({ urgency, className }: { urgency: CaseUrgency; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase",
        urgencyStyles[urgency],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {URGENCY_LABEL[urgency]}
    </span>
  );
}

const statusStyles: Record<CaseStatus, string> = {
  pending: "border-border bg-secondary text-secondary-foreground",
  assigned: "border-gold/40 bg-gold/10 text-gold",
  active: "border-success/40 bg-success/10 text-success",
  closed: "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase",
        statusStyles[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function AiNotice({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold" strokeWidth={1.8} />
      <span>
        {children ??
          "AI-assisted analysis. This is not legal advice or a judicial finding — please verify with a qualified advocate."}
      </span>
    </p>
  );
}

export function SecureNotice({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-xs text-muted-foreground">
      <ShieldCheck className="size-3.5 text-success" strokeWidth={1.8} />
      {children}
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
        )}
        <h2 className="mt-1.5 font-display text-2xl text-foreground">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
      <p className="font-display text-lg text-foreground">{title}</p>
      {description && <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl leading-none text-foreground">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
