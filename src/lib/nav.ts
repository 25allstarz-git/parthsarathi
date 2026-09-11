export interface NavLink {
  label: string;
  to: string;
}

export const CITIZEN_NAV: NavLink[] = [
  { label: "My matters", to: "/citizen" },
  { label: "File a matter", to: "/citizen/new" },
  { label: "Find an advocate", to: "/citizen/lawyers" },
  { label: "Messages", to: "/citizen/messages" },
  { label: "Assistant", to: "/citizen/assistant" },
  { label: "Profile", to: "/citizen/profile" },
];

export const LAWYER_NAV: NavLink[] = [
  { label: "Workspace", to: "/lawyer" },
  { label: "Profile", to: "/lawyer/profile" },
];

export const JUDICIAL_NAV: NavLink[] = [{ label: "Bench workspace", to: "/judicial" }];

export const ENFORCEMENT_NAV: NavLink[] = [{ label: "Records lookup", to: "/enforcement" }];
