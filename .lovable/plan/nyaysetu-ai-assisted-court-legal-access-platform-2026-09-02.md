# NyaySetu — AI-assisted court & legal-access platform

A full-stack, role-aware platform built on Lovable Cloud (real accounts, database, document storage, AI analysis), following the flowchart PDF as the source of truth. Citizen and Lawyer journeys get the deepest treatment; Judicial and Law Enforcement workspaces ship complete but leaner.

## Visual identity

Deep navy foundation, ivory/off-white surfaces, muted slate text, restrained saffron/gold accents used only for emphasis and urgency. Serif display headings paired with a precise sans for UI, generous spacing, square-ish corners, hairline borders instead of heavy shadows. Lucide icons at consistent sizes. A small set of respectful photographs (Indian courthouse architecture, documents, consultation) on the landing page only. Motion limited to 150–300ms transitions, hover elevation, accordion and timeline reveals, upload progress and skeletons, all disabled under reduced-motion.

## Roles and access

Four roles: Citizen, Lawyer, Judge/Judicial, Law Enforcement. Roles live in a dedicated `user_roles` table (never on the profile), checked by a security-definer function and enforced by row-level policies. Professional roles carry a verification state; unverified professionals see a pending-verification screen instead of restricted data. After sign-in, each user is routed to their own dashboard, and navigation renders only what that role may use. Citizens can never reach lawyer, judicial, or law-enforcement screens or data.

## Screens

**Public**
- Landing: platform overview, how it works, feature grid, trust & security section, AI-assistance disclaimer, role-aware sign-in/register CTAs.
- Auth: role selection, sign in / register, professional credential fields, pending-verification state.

**Citizen**
- Dashboard: active/pending cases, urgency breakdown, assigned lawyer, recent activity, notifications.
- New case intake: multi-file upload (PDF, scans, images) with per-file progress, then a step-by-step processing timeline — upload, OCR, fact extraction, AI analysis, categorisation, urgency, summary.
- Case analysis: extracted facts, category, urgency, key dates, parties, document list, similar cases, precedents, legal insights, "View source / traceability" on every AI claim, with a persistent "AI assistance, not a legal judgment" label.
- My cases, case detail, lawyer discovery with meaningful profile cards, case-scoped chat with attachments, AI assistant, profile and notifications.

**Lawyer**
- Overview, case queue with accept/reject and confirmation dialogs, accepted/pending/rejected tabs, case analysis with original documents and extracted facts, precedents and similar cases, AI legal assistant, client chat, availability toggle, profile.
- Rejecting a case returns the citizen to recommendations automatically.

**Judicial**
- Restricted dashboard, case analysis, hearing intelligence, cause list, AI assistance.

**Law Enforcement**
- Verification gate, case-status lookup, search by case number / party name / filing number, cause lists, case history and hearing information, authorized actions log.

## Data and AI

Tables for profiles, roles, cases, case documents, extracted facts, AI analyses, lawyer profiles, case assignments, messages, hearings/cause lists, notifications, and an access-audit log — all with row-level policies scoped to owner, assigned professional, or verified role. Documents go to a private storage bucket with signed access. Uploaded documents are analysed by a server-side AI call (text extraction, category, urgency, parties, dates, summary, insights) with every output stored alongside its source reference for traceability. Cause lists, hearings, precedents and a seeded set of realistic Indian cases, lawyers and case IDs (e.g. CRL.A. 482/2026, W.P.(C) 1189/2026) ship as seed data so the demo is complete from first load.

## Technical notes

- TanStack Start routes: public routes at top level, everything else under the authenticated layout with per-role sub-layouts that redirect on role mismatch.
- All data access through `createServerFn` with the authenticated Supabase middleware; role checks re-verified server-side, never trusted from the client.
- AI analysis runs server-side through the Lovable AI gateway; results persisted, never generated in the browser.
- Shared UI kit: status badges (Critical/High/Medium/Low, Pending/Active/Assigned/Closed, Available/Unavailable), case cards, data tables with filters, timeline, empty/loading/error states, confirmation dialogs, Zod-validated forms.

## Build order

1. Cloud enablement, schema, policies, seed data, auth and role routing.
2. Design system, landing page, auth flows.
3. Citizen: dashboard, intake, processing, analysis, discovery, chat.
4. Lawyer workspace end to end.
5. Judicial and law-enforcement workspaces.
6. Responsive, accessibility and visual-consistency pass across every screen.
