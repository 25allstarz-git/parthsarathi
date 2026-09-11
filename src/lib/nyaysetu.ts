export type AppRole = "citizen" | "lawyer" | "judge" | "law_enforcement";
export type CaseUrgency = "critical" | "high" | "medium" | "low";
export type CaseStatus = "pending" | "active" | "assigned" | "closed";
export type RequestStatus = "pending" | "accepted" | "rejected";
export type VerificationStatus = "pending" | "verified" | "rejected";

export const ROLE_LABEL: Record<AppRole, string> = {
  citizen: "Citizen",
  lawyer: "Advocate",
  judge: "Judicial Officer",
  law_enforcement: "Law Enforcement",
};

export const ROLE_HOME: Record<AppRole, string> = {
  citizen: "/citizen",
  lawyer: "/lawyer",
  judge: "/judicial",
  law_enforcement: "/enforcement",
};

export const URGENCY_LABEL: Record<CaseUrgency, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const URGENCY_ORDER: CaseUrgency[] = ["critical", "high", "medium", "low"];

export const STATUS_LABEL: Record<CaseStatus, string> = {
  pending: "Pending",
  active: "Active",
  assigned: "Assigned",
  closed: "Closed",
};

export const LEGAL_CATEGORIES = [
  "Constitutional Law",
  "Criminal Law",
  "Family Law",
  "Property Law",
  "Consumer Protection",
  "Labour & Employment",
  "Motor Accident Claims",
  "Cyber Law",
  "Corporate Law",
  "Tax & Revenue",
] as const;

export const PROCESSING_STEPS = [
  { key: "upload", label: "Secure upload", detail: "Documents encrypted and stored" },
  { key: "ocr", label: "OCR & text recognition", detail: "Scanned pages converted to text" },
  { key: "facts", label: "Fact extraction", detail: "Parties, dates and events identified" },
  { key: "analysis", label: "AI analysis", detail: "Issues and legal context assessed" },
  { key: "category", label: "Categorisation", detail: "Matched to a legal category" },
  { key: "urgency", label: "Urgency classification", detail: "Time sensitivity assessed" },
  { key: "summary", label: "Case summary", detail: "Plain-language summary prepared" },
] as const;

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(value?: string | null): string {
  if (!value) return "—";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return formatDate(value);
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatFee(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function initials(name: string): string {
  return name
    .replace(/^Adv\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
