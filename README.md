# Justice Navigator

Build a production-quality full-stack web application called “NyaySetu” using the attached PDF as the primary source of truth for website structure, user flows, permissions, and features.

NyaySetu is an AI-assisted court and legal-access platform for citizens, lawyers, judges/judicial professionals, and authorized law-enforcement users. It should feel trustworthy, calm, secure, and designed specifically for the Indian justice ecosystem.

Important: do not create a generic AI-generated SaaS dashboard. The website must feel intentionally designed by an experienced product designer and frontend engineer.

Design direction

Use a refined judiciary-inspired visual identity: deep navy, ivory/off-white, muted slate, and restrained saffron/gold accents.

Use elegant typography with strong hierarchy, spacious layouts, precise alignment, and clean information density.

Avoid excessive gradients, glassmorphism, neon colors, floating random shapes, overly rounded cards, or generic “AI chatbot” visuals.

Use a consistent icon system such as Lucide icons; icons must be meaningful, restrained, and consistently sized.

Use realistic, respectful visuals where appropriate: Indian courthouse architecture, legal documents, justice scales, consultation settings, document scanning, and secure digital systems. Avoid cliché or cartoon-style imagery.

Use high-quality royalty-free images from Unsplash or equivalent sources only where they add meaning. Do not fill every page with images.

Make the interface fully responsive, accessible, keyboard-friendly, and polished on desktop, tablet, and mobile.

Motion and interactions

Add subtle, purposeful animations only: smooth page transitions, hover elevation, button feedback, accordion expansion, file-upload progress, skeleton loaders, and timeline progress.

Keep animation duration around 150-300ms and respect reduced-motion preferences.

Never use distracting auto-playing animations, excessive parallax, bouncing icons, or unnecessary animated backgrounds.

Core access and security rules

Implement four roles with strict role-based access control:

Public / Citizen

Lawyer

Judge / Judicial Professional

Law Enforcement

Public users must never see restricted lawyer, judicial, or law-enforcement screens, navigation, data, or actions. After authentication, route every user to their permitted dashboard.

Build the website and flows described in the attached NyaySetu flowchart PDF:

Landing page with platform overview, how it works, trust/security section, feature overview, role-aware login/register, and clear calls to action.

Citizen dashboard with active cases, pending cases, urgency, assigned lawyer, activity, notifications, messages, and profile.

Case intake flow: upload PDFs, scanned documents, and images; show a professional step-by-step processing timeline for upload, OCR, fact extraction, AI analysis, categorization, urgency classification, and case summary.

AI case-analysis page with extracted facts, case category, urgency, important dates, parties, document list, similar cases, precedents, legal insights, and “View source / traceability” actions.

Clearly mark every AI-generated result as assistance, not a final legal judgment.

Lawyer discovery with meaningful profile cards: specialization, experience, cases handled, availability, profile, and secure chat.

Case-specific citizen-lawyer messaging with document attachments, accept/reject case actions, and a clear rejected-case return path to recommendations.

Lawyer workspace: overview, case queue, accepted/pending/rejected cases, case analysis, original documents, extracted facts, precedents, similar cases, AI legal assistant, client chat, availability control, and profile.

Judicial workspace: restricted dashboard, case analysis, hearing intelligence, AI assistance, and cause lists.

Law-enforcement dashboard: official verification, case-status lookup, case search by case number/party name/filing number, cause lists, case history, hearing information, and authorized actions.

Build quality requirements

Use a scalable component structure, clean routes, reusable cards, status badges, tables, filters, empty states, loading states, and error states.

Create realistic mock data for the demo, including Indian-style case IDs, hearing dates, legal categories, and lawyer profiles. Do not use lorem ipsum.

Use clear status systems: Critical, High, Medium, Low urgency; Pending, Active, Assigned, Closed case status; Available and Unavailable lawyer availability.

Include realistic form validation, success/error feedback, confirmation dialogs for important actions, and thoughtful empty states.

Make charts, timelines, activity feeds, and tables functional and easy to understand.

Use a professional sidebar/top navigation pattern appropriate for each authenticated role.

Ensure the demo flows are complete and clickable from entry to outcome.

Before finishing, review every screen for visual consistency, responsive quality, functional routing, and whether it looks like a carefully art-directed legal platform rather than a template.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nyaya-gateway.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e6f2aeaa-432a-428c-89da-40499d4aa6e4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Admin Promotion

Since the admin dashboard cannot be accessed or registered for via the public UI, the first admin must be promoted manually via a SQL query in Supabase.

1. Sign up for an account via the normal `/auth` page.
2. In your Supabase SQL editor, run the following query, replacing the email with your account's email:

```sql
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'your-email@example.com';
  
  INSERT INTO public.user_roles (user_id, role, verification)
  VALUES (target_user_id, 'admin', 'verified')
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'admin', verification = 'verified';
END $$;
```

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
