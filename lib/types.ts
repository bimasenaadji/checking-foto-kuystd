export type Role = "cs" | "operator_lt1" | "operator_lt2" | "operator_lt3";

export const CREW_ROLES: Role[] = [
  "cs",
  "operator_lt1",
  "operator_lt2",
  "operator_lt3",
];

export const ROLE_LABELS: Record<Role, string> = {
  cs: "Customer Service",
  operator_lt1: "Operator Lantai 1",
  operator_lt2: "Operator Lantai 2",
  operator_lt3: "Operator Lantai 3",
};

export const ROLE_FLOOR_LABELS: Record<Role, string> = {
  cs: "CS",
  operator_lt1: "Lantai 1",
  operator_lt2: "Lantai 2",
  operator_lt3: "Lantai 3",
};

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface Report {
  id: string;
  reporterName: string;
  reporterRole: Role;
  type: "opening" | "closing";
  timestamp: string; // format ISO date string
  location: string;
  checklist: ChecklistItem[];
  notes?: string;
}
